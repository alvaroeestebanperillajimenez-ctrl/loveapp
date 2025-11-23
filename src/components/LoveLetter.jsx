import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const LoveLetter = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 500);
    }, []);

    return (
        <div style={{
            padding: '20px',
            paddingBottom: '100px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s ease'
        }}>
            <div className="card" style={{
                background: '#fff',
                padding: '30px',
                position: 'relative',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-color)',
                    padding: '10px',
                    borderRadius: '50%'
                }}>
                    <Heart fill="var(--primary-color)" color="var(--primary-color)" size={32} />
                </div>

                <h2 style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    marginBottom: '30px',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    color: 'var(--accent-color)'
                }}>
                    Mi Amor,
                </h2>

                <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    color: '#444'
                }}>
                    <p style={{ marginBottom: '20px' }}>
                        Quería crear este pequeño espacio solo para nosotros, para recordarte lo especial que eres para mí.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        Cada canción, cada foto y cada palabra aquí está pensada en ti. Eres la melodía de mis días y la imagen más bella en mi mente.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        No importa la distancia o el tiempo, mi corazón siempre late al ritmo del tuyo. Gracias por ser mi inspiración y mi alegría.
                    </p>
                    <p style={{ textAlign: 'right', marginTop: '40px', fontWeight: 'bold', fontStyle: 'italic' }}>
                        Te amo infinitamente,<br />
                        [Tu Nombre]
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoveLetter;
