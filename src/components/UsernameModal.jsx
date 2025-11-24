import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const UsernameModal = ({ onSubmit }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onSubmit(username.trim());
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #fff0f3 0%, #ffe0e8 100%)',
                borderRadius: '25px',
                padding: '40px 30px',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(255, 77, 109, 0.3)',
                border: '2px solid rgba(255, 77, 109, 0.2)',
                animation: 'slideUp 0.4s ease'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #ff4d6d, #ff8fa3)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 10px 30px rgba(255, 77, 109, 0.4)',
                    animation: 'pulse 2s infinite'
                }}>
                    <Heart size={40} color="white" fill="white" />
                </div>

                <h2 style={{
                    fontSize: '1.8rem',
                    color: '#590d22',
                    marginBottom: '10px',
                    fontFamily: 'var(--font-serif)'
                }}>
                    ¡Bienvenido! 💕
                </h2>

                <p style={{
                    color: '#c9184a',
                    marginBottom: '30px',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                }}>
                    Para comenzar, cuéntanos...<br />
                    <strong>¿Cómo te llamas?</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tu nombre"
                        autoFocus
                        maxLength={20}
                        style={{
                            width: '100%',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            border: '2px solid #ff8fa3',
                            fontSize: '1.1rem',
                            textAlign: 'center',
                            marginBottom: '20px',
                            background: 'white',
                            color: '#590d22',
                            fontWeight: '500',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#ff4d6d';
                            e.target.style.boxShadow = '0 0 0 4px rgba(255, 77, 109, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ff8fa3';
                            e.target.style.boxShadow = 'none';
                        }}
                    />

                    <button
                        type="submit"
                        disabled={!username.trim()}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: username.trim()
                                ? 'linear-gradient(135deg, #ff4d6d, #ff8fa3)'
                                : '#ddd',
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: username.trim() ? 'pointer' : 'not-allowed',
                            boxShadow: username.trim()
                                ? '0 8px 20px rgba(255, 77, 109, 0.3)'
                                : 'none',
                            transition: 'all 0.3s ease',
                            opacity: username.trim() ? 1 : 0.5
                        }}
                        onMouseEnter={(e) => {
                            if (username.trim()) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 12px 30px rgba(255, 77, 109, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = username.trim()
                                ? '0 8px 20px rgba(255, 77, 109, 0.3)'
                                : 'none';
                        }}
                    >
                        Comenzar ❤️
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default UsernameModal;
