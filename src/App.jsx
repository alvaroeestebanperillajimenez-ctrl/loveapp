import React, { useState } from 'react';
import { Heart, Music, Image as ImageIcon, MessageCircleHeart, CalendarHeart, Mail, History } from 'lucide-react';
import MusicPlayer from './components/MusicPlayer';
import PhotoGallery from './components/PhotoGallery';
import LetterCollection from './components/LetterCollection';
import Timeline from './components/Timeline';
import RelationshipTimer from './components/RelationshipTimer';
import ReasonsWhy from './components/ReasonsWhy';
import BucketList from './components/BucketList';
import DateCalendar from './components/DateCalendar';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [hearts, setHearts] = useState([]);

  const spawnHeart = () => {
    const id = Date.now();
    const left = Math.random() * 100; // Random position
    setHearts(prev => [...prev, { id, left }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 4000); // Remove after animation
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'music':
        return <MusicPlayer />;
      case 'photos':
        return <PhotoGallery />;
      case 'story':
        return <Timeline />;
      case 'letters':
        return <LetterCollection />;
      case 'plans':
        return (
          <div style={{ paddingBottom: '80px', paddingLeft: '10px', paddingRight: '10px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem' }}>Nuestros Planes 🌍</h2>
            <DateCalendar />
            <BucketList />
          </div>
        );
      default:
        return (
          <div style={{ paddingBottom: '80px' }}>
            {/* Hero Section */}
            <header style={{ textAlign: 'center', margin: '30px 0 30px' }}>
              <Heart
                fill="var(--primary-color)"
                color="var(--primary-color)"
                size={56}
                style={{
                  margin: '0 auto 15px',
                  filter: 'drop-shadow(0 4px 6px rgba(255, 77, 109, 0.3))',
                  animation: 'pulse 2s infinite'
                }}
              />
              <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Para Ti ❤️ constuyamos juntos esta historia</h1>
              <p style={{ opacity: 0.8, marginTop: '5px' }}>Mi lugar favorito es contigo</p>
            </header>

            {/* Timer */}
            <div style={{ marginBottom: '25px' }}>
              <RelationshipTimer />
            </div>

            {/* Reasons Why Widget */}
            <div style={{ marginBottom: '25px' }}>
              <ReasonsWhy />
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <p>Explora nuestra historia, fotos y música en el menú de abajo.</p>
            </div>

            <style>{`
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
              }
            `}</style>
          </div>
        );
    }
  };

  return (
    <div className="container">
      {/* Floating Hearts Container */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
        {hearts.map(h => (
          <div key={h.id} style={{
            position: 'absolute',
            bottom: '-20px',
            left: `${h.left}%`,
            fontSize: '24px',
            animation: 'floatUp 4s linear forwards'
          }}>❤️</div>
        ))}
        <style>{`
          @keyframes floatUp {
            to { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Floating Action Button for Hearts */}
      <button
        onClick={spawnHeart}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          background: 'var(--primary-color)',
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(255, 77, 109, 0.5)',
          zIndex: 90,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Heart size={24} fill="white" />
      </button>

      <main style={{ minHeight: '60vh' }}>
        {renderContent()}
      </main>

      {/* Navigation Bar (Bottom) */}
      <nav style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '10px 15px',
        borderRadius: '50px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        display: 'flex',
        gap: '10px',
        zIndex: 100,
        border: '1px solid rgba(255,255,255,0.5)',
        width: '95%',
        maxWidth: '450px',
        justifyContent: 'space-between',
        overflowX: 'auto'
      }}>
        <NavIcon icon={<Heart />} label="Inicio" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavIcon icon={<History />} label="Historia" isActive={activeTab === 'story'} onClick={() => setActiveTab('story')} />
        <NavIcon icon={<CalendarHeart />} label="Planes" isActive={activeTab === 'plans'} onClick={() => setActiveTab('plans')} />
        <NavIcon icon={<ImageIcon />} label="Fotos" isActive={activeTab === 'photos'} onClick={() => setActiveTab('photos')} />
        <NavIcon icon={<Music />} label="Música" isActive={activeTab === 'music'} onClick={() => setActiveTab('music')} />
        <NavIcon icon={<Mail />} label="Cartas" isActive={activeTab === 'letters'} onClick={() => setActiveTab('letters')} />
      </nav>
    </div>
  );
}

const NavIcon = ({ icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: isActive ? 'var(--primary-color)' : 'transparent',
      color: isActive ? 'white' : 'var(--secondary-color)',
      padding: '10px',
      borderRadius: '50%',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: isActive ? 'scale(1.1) translateY(-5px)' : 'scale(1)',
      boxShadow: isActive ? '0 5px 15px rgba(255, 77, 109, 0.4)' : 'none',
      flexShrink: 0
    }}
  >
    {React.cloneElement(icon, { size: 20 })}
  </button>
);

export default App;
