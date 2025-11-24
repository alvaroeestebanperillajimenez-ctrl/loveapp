import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot, increment, serverTimestamp } from 'firebase/firestore';

const LoveCounter = ({ username }) => {
    const [counters, setCounters] = useState({});
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'love_clicks'), (snapshot) => {
            const data = {};
            snapshot.docs.forEach(doc => {
                data[doc.id] = doc.data();
            });
            setCounters(data);
        });

        return () => unsubscribe();
    }, []);

    const handleHeartClick = async () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);

        try {
            const userRef = doc(db, 'love_clicks', username);
            await setDoc(userRef, {
                username: username,
                clicks: increment(1),
                lastClick: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error('Error updating counter:', error);
        }
    };

    const myClicks = counters[username]?.clicks || 0;
    const otherUsers = Object.entries(counters).filter(([name]) => name !== username);

    return (
        <div className="card" style={{
            marginBottom: '25px',
            padding: '25px',
            background: 'linear-gradient(135deg, #fff0f3 0%, #ffe0e8 100%)',
            border: '2px solid rgba(255, 77, 109, 0.2)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative hearts background */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                opacity: 0.1,
                fontSize: '100px',
                color: '#ff4d6d',
                pointerEvents: 'none'
            }}>❤️</div>

            <h3 style={{
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '1.3rem',
                color: '#590d22',
                fontFamily: 'var(--font-serif)'
            }}>
                Contador de Amor 💕
            </h3>

            {/* Counters Display */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: otherUsers.length > 0 ? 'repeat(2, 1fr)' : '1fr',
                gap: '15px',
                marginBottom: '25px'
            }}>
                {/* My Counter */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    border: '2px solid #ff4d6d',
                    boxShadow: '0 4px 15px rgba(255, 77, 109, 0.2)'
                }}>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '5px' }}>Tú</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#590d22', marginBottom: '5px' }}>
                        {username}
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff4d6d' }}>
                        {myClicks} ❤️
                    </div>
                </div>

                {/* Other User Counter */}
                {otherUsers.length > 0 && (
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        border: '2px solid #ff8fa3',
                        boxShadow: '0 4px 15px rgba(255, 143, 163, 0.2)'
                    }}>
                        <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '5px' }}>
                            {otherUsers[0][1].username}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#590d22', marginBottom: '5px' }}>
                            {otherUsers[0][0]}
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff8fa3' }}>
                            {otherUsers[0][1].clicks || 0} ❤️
                        </div>
                    </div>
                )}
            </div>

            {/* Click Button */}
            <button
                onClick={handleHeartClick}
                style={{
                    width: '100%',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #ff4d6d, #ff8fa3)',
                    border: 'none',
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 25px rgba(255, 77, 109, 0.3)',
                    transition: 'all 0.3s ease',
                    transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(255, 77, 109, 0.4)';
                }}
                onMouseLeave={(e) => {
                    if (!isAnimating) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(255, 77, 109, 0.3)';
                    }
                }}
            >
                <Heart
                    size={28}
                    fill={isAnimating ? 'white' : 'transparent'}
                    style={{
                        transition: 'all 0.3s ease',
                        animation: isAnimating ? 'heartBeat 0.6s ease' : 'none'
                    }}
                />
                ¡Enviar Amor!
            </button>

            {/* Total Love */}
            <div style={{
                textAlign: 'center',
                marginTop: '20px',
                fontSize: '0.9rem',
                color: '#888'
            }}>
                Total de amor compartido: <strong style={{ color: '#ff4d6d' }}>
                    {Object.values(counters).reduce((sum, user) => sum + (user.clicks || 0), 0)} ❤️
                </strong>
            </div>

            <style>{`
                @keyframes heartBeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.3); }
                    50% { transform: scale(1.1); }
                    75% { transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
};

export default LoveCounter;
