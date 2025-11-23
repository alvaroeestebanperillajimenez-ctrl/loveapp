import React, { useState, useEffect } from 'react';
import { X, FolderHeart, ArrowLeft, Plus, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, where, serverTimestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const PhotoGallery = () => {
    const [folders, setFolders] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Estados para modales y cargas
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // 1. Cargar Carpetas (Folders)
    useEffect(() => {
        const q = query(collection(db, "folders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const foldersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFolders(foldersData);
        }, (error) => {
            console.error("Error cargando carpetas:", error);
        });
        return () => unsubscribe();
    }, []);

    // 2. Cargar Fotos cuando se selecciona una carpeta
    useEffect(() => {
        if (!currentFolder) {
            setPhotos([]);
            return;
        }

        const q = query(
            collection(db, "photos"),
            where("folderId", "==", currentFolder.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const photosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Ordenar en el cliente para evitar requerir índice compuesto en Firestore
            photosData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setPhotos(photosData);
        }, (error) => {
            console.error("Error cargando fotos:", error);
        });

        return () => unsubscribe();
    }, [currentFolder]);

    // Crear Nueva Carpeta
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        try {
            await addDoc(collection(db, "folders"), {
                name: newFolderName,
                createdAt: serverTimestamp()
            });
            setNewFolderName('');
            setShowNewFolderModal(false);
        } catch (error) {
            alert("Error al crear carpeta: " + error.message);
        }
    };

    // Borrar Carpeta (y sus fotos)
    const handleDeleteFolder = async (e, folderId) => {
        e.stopPropagation();
        if (!window.confirm("⚠️ ¿Estás seguro? Se borrarán TODAS las fotos de esta carpeta para siempre.")) return;

        try {
            // 1. Buscar todas las fotos de la carpeta
            const q = query(collection(db, "photos"), where("folderId", "==", folderId));
            const snapshot = await getDocs(q);

            // 2. Borrar cada foto (Storage + Firestore)
            const deletePromises = snapshot.docs.map(async (photoDoc) => {
                const photoData = photoDoc.data();
                // Intentar borrar de Storage (si existe la URL)
                try {
                    const fileRef = ref(storage, photoData.url);
                    await deleteObject(fileRef);
                } catch (err) {
                    console.warn("No se pudo borrar archivo de Storage (quizás ya no existe):", err);
                }
                // Borrar de Firestore
                return deleteDoc(doc(db, "photos", photoDoc.id));
            });

            await Promise.all(deletePromises);

            // 3. Borrar la carpeta
            await deleteDoc(doc(db, "folders", folderId));

        } catch (error) {
            console.error("Error borrando carpeta:", error);
            alert("Error al borrar carpeta: " + error.message);
        }
    };

    // Subir Foto
    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const storageRef = ref(storage, `photos/${currentFolder.id}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Error subiendo foto:", error);
                alert("Error al subir la foto.");
                setUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                // Guardar referencia en Firestore
                await addDoc(collection(db, "photos"), {
                    folderId: currentFolder.id,
                    url: downloadURL,
                    caption: '',
                    createdAt: serverTimestamp()
                });

                setUploading(false);
                setUploadProgress(0);
            }
        );
    };

    // Borrar Foto Individual
    const handleDeletePhoto = async (e, photo) => {
        e.stopPropagation();
        if (!window.confirm("¿Borrar esta foto?")) return;

        try {
            // 1. Borrar de Storage
            const fileRef = ref(storage, photo.url);
            await deleteObject(fileRef);

            // 2. Borrar de Firestore
            await deleteDoc(doc(db, "photos", photo.id));

            if (selectedImage && selectedImage.id === photo.id) {
                setSelectedImage(null);
            }
        } catch (error) {
            console.error("Error borrando foto:", error);
            alert("Error al borrar foto: " + error.message);
        }
    };

    const renderFolders = () => (
        <div>
            {folders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
                    <FolderHeart size={48} style={{ marginBottom: '10px' }} />
                    <p>No hay álbumes aún.</p>
                    <p>¡Crea el primero!</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    padding: '10px'
                }}>
                    {folders.map((folder) => (
                        <div
                            key={folder.id}
                            onClick={() => setCurrentFolder(folder)}
                            className="folder-card"
                            style={{
                                background: 'var(--card-bg)',
                                borderRadius: '20px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow)',
                                border: '1px solid rgba(255,255,255,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'transform 0.2s ease',
                                position: 'relative'
                            }}
                        >
                            <FolderHeart size={48} color="var(--primary-color)" fill="rgba(255, 77, 109, 0.1)" />
                            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-color)', margin: 0 }}>{folder.name}</h3>

                            {/* Botón Borrar Carpeta */}
                            <button
                                onClick={(e) => handleDeleteFolder(e, folder.id)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(0,0,0,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-color)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Botón Flotante Nueva Carpeta */}
            <button
                onClick={() => setShowNewFolderModal(true)}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '20px',
                    background: 'var(--accent-color)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 90,
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <Plus size={24} />
            </button>
        </div>
    );

    const renderPhotos = () => (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                <button
                    onClick={() => setCurrentFolder(null)}
                    style={{
                        background: 'none',
                        color: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={24} style={{ marginRight: '5px' }} /> Volver
                </button>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{currentFolder.name}</h2>
            </div>

            {/* Botón Subir Foto (Input oculto) */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(255, 77, 109, 0.3)'
                }}>
                    {uploading ? (
                        <span>Subiendo... {Math.round(uploadProgress)}%</span>
                    ) : (
                        <>
                            <Upload size={20} /> Agregar Foto
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPhoto}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px',
                padding: '0 5px'
            }}>
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        onClick={() => setSelectedImage(photo)}
                        style={{
                            position: 'relative',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            aspectRatio: '1/1',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            animation: 'fadeIn 0.5s ease',
                            background: '#eee'
                        }}
                    >
                        <img
                            src={photo.url}
                            alt="Recuerdo"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Botón Borrar Foto */}
                        <button
                            onClick={(e) => handleDeletePhoto(e, photo)}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'rgba(0,0,0,0.5)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>

            {photos.length === 0 && !uploading && (
                <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.6 }}>
                    <ImageIcon size={40} />
                    <p>Esta carpeta está vacía.</p>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ paddingBottom: '80px' }}>
            {!currentFolder ? (
                <>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.8rem' }}>Nuestros Recuerdos</h2>
                    {renderFolders()}
                </>
            ) : (
                renderPhotos()
            )}

            {/* Modal Nueva Carpeta */}
            {showNewFolderModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3>Nueva Carpeta</h3>
                            <button onClick={() => setShowNewFolderModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleCreateFolder}>
                            <input
                                type="text"
                                placeholder="Nombre (ej: Viajes 2024)"
                                value={newFolderName}
                                onChange={e => setNewFolderName(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    marginBottom: '15px'
                                }}
                            />
                            <button type="submit" style={{
                                width: '100%',
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '8px',
                                fontWeight: 'bold'
                            }}>Crear</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.95)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.3s ease'
                }} onClick={() => setSelectedImage(null)}>
                    <button
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'white',
                            borderRadius: '50%',
                            padding: '8px',
                            color: 'black',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ maxWidth: '100%', maxHeight: '80%' }} onClick={e => e.stopPropagation()}>
                        <img
                            src={selectedImage.url}
                            alt="Full size"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '70vh',
                                borderRadius: '8px',
                                boxShadow: '0 0 20px rgba(255,255,255,0.1)'
                            }}
                        />
                    </div>
                </div>
            )}

            <style>{`
                .folder-card:active { transform: scale(0.95); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default PhotoGallery;
