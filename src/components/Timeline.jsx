import React, { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Calendar, Plus, Save, X, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const Timeline = () => {
    const [events, setEvents] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ date: '', title: '', desc: '', icon: 'Heart' });

    // Escuchar cambios en tiempo real de Firebase
    useEffect(() => {
        const q = query(collection(db, "timeline"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsData);
        }, (error) => {
            console.error("Error al conectar con Firebase:", error);
            // Fallback si no hay conexión
            if (events.length === 0) {
                setEvents([
                    { date: '2025-02-10', title: 'El comienzo', desc: 'El día que te vi por primera vez', icon: 'Heart' },
                    { date: '2025-04-02', title: 'Primera Cita', desc: 'Ese primer pico inolvidable', icon: 'Star' },
                    { date: '2025-06-28', title: 'Primer Viaje', desc: 'Nuestro primer viaje a la mesa', icon: 'MapPin' },
                ]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.date) return;

        try {
            await addDoc(collection(db, "timeline"), {
                ...newEvent,
                createdAt: serverTimestamp()
            });
            setShowAddModal(false);
            setNewEvent({ date: '', title: '', desc: '', icon: 'Heart' });
        } catch (error) {
            alert("Error al guardar: " + error.message);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm("¿Seguro que quieres borrar este recuerdo?")) {
            try {
                await deleteDoc(doc(db, "timeline", id));
            } catch (error) {
                console.error("Error al borrar:", error);
                alert("No se pudo borrar (quizás es un evento de ejemplo local).");
            }
        }
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Star': return <Star size={16} />;
            case 'MapPin': return <MapPin size={16} />;
            case 'Calendar': return <Calendar size={16} />;
            default: return <Heart size={16} />;
        }
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.8rem' }}>Nuestra Historia</h2>

            <div style={{ position: 'relative', padding: '0 10px' }}>
                {/* Line */}
                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'var(--primary-color)',
                    opacity: 0.3
                }}></div>

                {events.map((event, index) => (
                    <div key={event.id || index} style={{
                        display: 'flex',
                        marginBottom: '30px',
                        position: 'relative',
                        animation: `slideIn 0.5s ease backwards`
                    }}>
                        {/* Dot */}
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'white',
                            border: '2px solid var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                            color: 'var(--primary-color)',
                            flexShrink: 0
                        }}>
                            {getIcon(event.icon)}
                        </div>

                        {/* Content */}
                        <div className="card" style={{
                            marginLeft: '20px',
                            flex: 1,
                            padding: '15px',
                            marginBottom: 0,
                            position: 'relative'
                        }}>
                            <span style={{
                                fontSize: '0.8rem',
                                color: 'var(--primary-color)',
                                fontWeight: 'bold',
                                display: 'block',
                                marginBottom: '5px'
                            }}>{event.date}</span>
                            <h3 style={{ fontSize: '1.1rem', margin: '0 0 5px' }}>{event.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{event.desc}</p>

                            {/* Delete Button (Only for real Firestore items that have an ID) */}
                            {event.id && (
                                <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'none',
                                        color: '#ffcccb', // Light red
                                        padding: '5px',
                                        cursor: 'pointer',
                                        opacity: 0.6,
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={e => e.target.style.opacity = 1}
                                    onMouseLeave={e => e.target.style.opacity = 0.6}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <button
                onClick={() => setShowAddModal(true)}
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

            {/* Add Modal */}
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
                            <h3>Nuevo Recuerdo</h3>
                            <button onClick={() => setShowAddModal(false)}><X /></button>
                        </div>

                        <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input
                                type="date"
                                required
                                value={newEvent.date}
                                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <input
                                type="text"
                                placeholder="Título (ej: Primer Beso)"
                                required
                                value={newEvent.title}
                                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <textarea
                                placeholder="Descripción..."
                                required
                                value={newEvent.desc}
                                onChange={e => setNewEvent({ ...newEvent, desc: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}
                            />
                            <select
                                value={newEvent.icon}
                                onChange={e => setNewEvent({ ...newEvent, icon: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            >
                                <option value="Heart">❤️ Corazón</option>
                                <option value="Star">⭐ Estrella</option>
                                <option value="MapPin">📍 Viaje</option>
                                <option value="Calendar">📅 Fecha</option>
                            </select>

                            <button type="submit" style={{
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}>
                                Guardar Recuerdo
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
};

export default Timeline;
