import React, { useState, useEffect } from 'react';
import { Mail, X, Plus, Trash2, Pencil } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const LetterCollection = () => {
    const [letters, setLetters] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newLetter, setNewLetter] = useState({ title: '', content: '', color: '#ff4d6d' });
    const [editingId, setEditingId] = useState(null);

    // Colores predefinidos para los sobres
    const envelopeColors = [
        '#ff4d6d', // Rosa fuerte
        '#ff8fa3', // Rosa claro
        '#c9184a', // Rojo vino
        '#590d22', // Vino oscuro
        '#ffb3c1', // Rosa pastel
        '#e0aaff', // Lila
    ];

    // Escuchar cambios en tiempo real
    useEffect(() => {
        const q = query(collection(db, "letters"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lettersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLetters(lettersData);
        }, (error) => {
            console.error("Error al conectar con Firebase:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleSaveLetter = async (e) => {
        e.preventDefault();
        if (!newLetter.title || !newLetter.content) return;

        try {
            if (editingId) {
                // Actualizar carta existente
                await updateDoc(doc(db, "letters", editingId), {
                    ...newLetter,
                    updatedAt: serverTimestamp()
                });
            } else {
                // Crear nueva carta
                await addDoc(collection(db, "letters"), {
                    ...newLetter,
                    createdAt: serverTimestamp()
                });
            }
            setShowAddModal(false);
            setNewLetter({ title: '', content: '', color: '#ff4d6d' });
            setEditingId(null);
        } catch (error) {
            alert("Error al guardar la carta: " + error.message);
        }
    };

    const handleEditLetter = (e, letter) => {
        e.stopPropagation();
        setNewLetter({
            title: letter.title,
            content: letter.content,
            color: letter.color
        });
        setEditingId(letter.id);
        setShowAddModal(true);
    };

    const handleDeleteLetter = async (e, id) => {
        e.stopPropagation(); // Evitar abrir la carta al borrar
        if (window.confirm("¿Seguro que quieres quemar esta carta? 🔥")) {
            try {
                await deleteDoc(doc(db, "letters", id));
                if (selectedLetter && selectedLetter.id === id) {
                    setSelectedLetter(null);
                }
            } catch (error) {
                console.error("Error al borrar:", error);
            }
        }
    };

    const openModal = () => {
        setNewLetter({ title: '', content: '', color: '#ff4d6d' });
        setEditingId(null);
        setShowAddModal(true);
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.8rem' }}>Mis Cartas para Ti</h2>

            {letters.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.7, padding: '20px' }}>
                    <p>Aún no hay cartas en el buzón.</p>
                    <p>¡Sé el primero en escribir una!</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px',
                    padding: '0 10px'
                }}>
                    {letters.map((letter) => (
                        <div
                            key={letter.id}
                            onClick={() => setSelectedLetter(letter)}
                            style={{
                                background: letter.color,
                                borderRadius: '15px',
                                padding: '20px',
                                aspectRatio: '1/1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                textAlign: 'center',
                                transition: 'transform 0.2s',
                                position: 'relative'
                            }}
                            className="envelope-card"
                        >
                            <Mail size={32} style={{ marginBottom: '10px' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{letter.title}</span>

                            {/* Botones de acción */}
                            <div style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                display: 'flex',
                                gap: '5px'
                            }}>
                                <button
                                    onClick={(e) => handleEditLetter(e, letter)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
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
                                    title="Editar"
                                >
                                    <Pencil size={12} />
                                </button>
                                <button
                                    onClick={(e) => handleDeleteLetter(e, letter.id)}
                                    style={{
                                        background: 'rgba(0,0,0,0.2)',
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
                                    title="Borrar"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .envelope-card:active { transform: scale(0.95); }
            `}</style>

            {/* Modal Letter View */}
            {selectedLetter && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.3s'
                }} onClick={() => setSelectedLetter(null)}>
                    <div className="card" style={{
                        width: '100%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        position: 'relative',
                        background: '#fff0f3',
                        border: '2px solid var(--primary-color)'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedLetter(null)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'none',
                                color: 'var(--text-color)'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            color: 'var(--accent-color)',
                            fontSize: '1.5rem',
                            marginTop: '10px'
                        }}>{selectedLetter.title}</h3>

                        <p style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {selectedLetter.content}
                        </p>
                    </div>
                </div>
            )}

            {/* Add Button */}
            <button
                onClick={openModal}
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

            {/* Add/Edit Modal Form */}
            {showAddModal && (
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
                    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3>{editingId ? 'Editar Carta' : 'Escribir Carta'}</h3>
                            <button onClick={() => setShowAddModal(false)}><X /></button>
                        </div>

                        <form onSubmit={handleSaveLetter} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                type="text"
                                placeholder="Título (ej: Ábrela cuando estés feliz)"
                                required
                                value={newLetter.title}
                                onChange={e => setNewLetter({ ...newLetter, title: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />

                            <textarea
                                placeholder="Escribe tu mensaje de amor aquí..."
                                required
                                value={newLetter.content}
                                onChange={e => setNewLetter({ ...newLetter, content: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '150px' }}
                            />

                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem' }}>Color del Sobre:</label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {envelopeColors.map(color => (
                                        <div
                                            key={color}
                                            onClick={() => setNewLetter({ ...newLetter, color })}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                background: color,
                                                cursor: 'pointer',
                                                border: newLetter.color === color ? '3px solid #333' : '1px solid #ddd',
                                                transform: newLetter.color === color ? 'scale(1.1)' : 'scale(1)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button type="submit" style={{
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}>
                                {editingId ? 'Guardar Cambios' : 'Enviar Carta'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LetterCollection;
