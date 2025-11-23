import React, { useState, useEffect } from 'react';

const RelationshipTimer = () => {
    // FECHA DE INICIO: Cambia esto por la fecha de su aniversario
    // Formato: YYYY-MM-DDTHH:MM:SS
    const startDate = new Date('2025-06-29T00:00:00');

    const [timeElapsed, setTimeElapsed] = useState({});

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = now - startDate;

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeElapsed({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#590d22' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', opacity: 0.9 }}>Juntos desde hace</h3>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <TimeBox value={timeElapsed.days} label="Días" />
                <TimeBox value={timeElapsed.hours} label="Horas" />
                <TimeBox value={timeElapsed.minutes} label="Min" />
                <TimeBox value={timeElapsed.seconds} label="Seg" />
            </div>
        </div>
    );
};

const TimeBox = ({ value, label }) => (
    <div style={{
        background: 'rgba(255,255,255,0.5)',
        padding: '10px',
        borderRadius: '10px',
        minWidth: '60px',
        backdropFilter: 'blur(5px)'
    }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value || 0}</div>
        <div style={{ fontSize: '0.8rem' }}>{label}</div>
    </div>
);

export default RelationshipTimer;
