import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { requestNotificationPermission, getNotificationPermission } from '../utils/notificationHelper';

const NotificationPrompt = ({ onClose }) => {
    const [permission, setPermission] = useState(getNotificationPermission());

    useEffect(() => {
        // Auto-close if permission is already granted or denied
        if (permission === 'granted' || permission === 'denied') {
            setTimeout(() => onClose(), 2000);
        }
    }, [permission, onClose]);

    const handleAllow = async () => {
        const granted = await requestNotificationPermission();
        setPermission(granted ? 'granted' : 'denied');
    };

    const handleSkip = () => {
        onClose();
    };

    if (permission === 'unsupported') {
        return null; // Don't show if not supported
    }

    if (permission === 'granted') {
        return (
            <div style={{
                position: 'fixed',
                bottom: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '50px',
                boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)',
                zIndex: 9998,
                animation: 'slideUp 0.3s ease, fadeOut 0.3s ease 1.7s forwards',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <Bell size={20} />
                <span style={{ fontWeight: '500' }}>¡Notificaciones activadas! 🔔</span>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '400px',
            background: 'linear-gradient(135deg, #fff0f3 0%, #ffe0e8 100%)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(255, 77, 109, 0.3)',
            zIndex: 9998,
            animation: 'slideUp 0.4s ease',
            border: '2px solid rgba(255, 77, 109, 0.2)'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #ff4d6d, #ff8fa3)',
                    borderRadius: '50%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <Bell size={24} color="white" />
                </div>

                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#590d22', fontSize: '1.1rem' }}>
                        ¿Activar notificaciones? 💕
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#c9184a', lineHeight: '1.5' }}>
                        Recibe alertas cuando tu pareja agregue fotos, cartas o te envíe amor
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                    onClick={handleAllow}
                    style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #ff4d6d, #ff8fa3)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(255, 77, 109, 0.3)',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    Activar
                </button>
                <button
                    onClick={handleSkip}
                    style={{
                        flex: 1,
                        background: 'white',
                        color: '#888',
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        padding: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.borderColor = '#ff8fa3';
                        e.target.style.color = '#ff4d6d';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.borderColor = '#ddd';
                        e.target.style.color = '#888';
                    }}
                >
                    Ahora no
                </button>
            </div>

            <style>{`
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        transform: translateX(-50%) translateY(20px);
                    }
                }
            `}</style>
        </div>
    );
};

export default NotificationPrompt;
