import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Activity, Image as ImageIcon, Mail, CalendarHeart, ListTodo, Heart, Clock } from 'lucide-react';

const ActivityFeed = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(
            collection(db, "activity_log"),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLogs(logsData);
            setLoading(false);
            setError(null);
        }, (error) => {
            console.error("Error loading activity log:", error);
            setError(error.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'photo': return <ImageIcon size={16} />;
            case 'letter': return <Mail size={16} />;
            case 'calendar': return <CalendarHeart size={16} />;
            case 'bucket': return <ListTodo size={16} />;
            case 'timeline': return <Clock size={16} />;
            default: return <Activity size={16} />;
        }
    };

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const date = timestamp.toDate();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Hace un momento';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `Hace ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Hace ${hours} h`;
        return `Hace ${Math.floor(hours / 24)} días`;
    };

    return (
        <div className="card" style={{ marginBottom: '25px', padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <Activity color="var(--primary-color)" size={20} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-color)' }}>Últimas Novedades</h3>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>Cargando...</p>
            ) : error ? (
                <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem', color: '#ff4d6d' }}>
                    Error: {error}
                </p>
            ) : logs.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                    Aún no hay actividad. ¡Empieza a crear recuerdos! ✨
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {logs.map(log => (
                        <div key={log.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '0.9rem',
                            paddingBottom: '8px',
                            borderBottom: '1px solid #eee'
                        }}>
                            <div style={{
                                background: '#fff0f3',
                                padding: '8px',
                                borderRadius: '50%',
                                color: 'var(--primary-color)',
                                display: 'flex'
                            }}>
                                {getIcon(log.icon)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 2px 0', fontWeight: '500' }}>{log.action}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                                    {log.details} • {getTimeAgo(log.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActivityFeed;
