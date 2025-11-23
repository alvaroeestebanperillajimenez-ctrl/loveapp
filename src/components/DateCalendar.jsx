import React, { useState, useEffect } from 'react';
import { CalendarHeart, Plus, Trash2, Clock } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const DateCalendar = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: '' });

    useEffect(() => {
        const q = query(collection(db, "calendar"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsData);
        }, (error) => {
            console.error("Error loading calendar:", error);
        });
        return () => unsubscribe();
    }, []);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.date) return;

        try {
            await addDoc(collection(db, "calendar"), {
                ...newEvent,
                createdAt: serverTimestamp()
            });
            setNewEvent({ title: '', date: '' });
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar esta cita?")) return;
        try {
            await deleteDoc(doc(db, "calendar", id));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getDaysUntil = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(dateString);
        eventDate.setHours(0, 0, 0, 0);

        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Pasó hace " + Math.abs(diffDays) + " días";
        if (diffDays === 0) return "¡Es hoy!";
        if (diffDays === 1) return "¡Es mañana!";
        return "Faltan " + diffDays + " días";
    };

    return (
        <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <CalendarHeart color="var(--primary-color)" />
                <h3 style={{ margin: 0, color: 'var(--accent-color)' }}>Próximas Citas</h3>
            </div>

            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Título (ej: Noche de cine)"
                    style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                    }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                        }}
                    />
                    <button type="submit" style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        width: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        <Plus size={20} />
                    </button>
                </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {events.length === 0 ? (
                    <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                        No hay citas programadas. ¡Invítala a salir! 🌹
                    </p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} style={{
                            padding: '15px',
                            background: '#fff0f3',
                            borderRadius: '12px',
                            borderLeft: '4px solid var(--primary-color)',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{event.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Clock size={14} /> {formatDate(event.date)}
                                    </p>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '8px',
                                        fontSize: '0.8rem',
                                        padding: '4px 8px',
                                        background: 'white',
                                        borderRadius: '20px',
                                        color: 'var(--primary-color)',
                                        fontWeight: 'bold'
                                    }}>
                                        {getDaysUntil(event.date)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#ff4d6d',
                                        opacity: 0.6
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DateCalendar;
