import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const ReasonsWhy = () => {
    const reasons = [
        "Por tu forma de reír",
        "Porque me haces mejor persona",
        "Por tus abrazos que reinician mi vida",
        "Por cómo me miras",
        "Porque eres mi mejor amiga",
        "Por tu paciencia infinita",
        "Porque iluminas cualquier lugar",
        "Por tu inteligencia",
        "Porque siempre estás ahí para mí",
        "Simplemente porque eres tú",
        "Por la paciencia que me tienes",
        "Por los besos que me das",
        "Por la forma en que me amas",
        "Por la forma en que me das mi lugar"
    ];

    const [currentReason, setCurrentReason] = useState("Haz clic para saber por qué te amo");
    const [animating, setAnimating] = useState(false);

    const handleClick = () => {
        setAnimating(true);
        setTimeout(() => {
            const random = reasons[Math.floor(Math.random() * reasons.length)];
            setCurrentReason(random);
            setAnimating(false);
        }, 300);
    };

    return (
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleClick}>
            <div style={{ marginBottom: '15px' }}>
                <Sparkles color="var(--primary-color)" size={32} />
            </div>
            <h3 style={{ marginBottom: '10px', color: 'var(--accent-color)' }}>¿Por qué te amo?</h3>
            <p style={{
                fontSize: '1.2rem',
                fontStyle: 'italic',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: animating ? 0 : 1,
                transition: 'opacity 0.3s',
                color: '#444'
            }}>
                "{currentReason}"
            </p>
            <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '10px' }}>(Toca para ver otra razón)</p>
        </div>
    );
};

export default ReasonsWhy;
