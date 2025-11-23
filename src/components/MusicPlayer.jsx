import React from 'react';

const MusicPlayer = () => {
    // Instrucciones para cambiar la playlist:
    // 1. Ve a Spotify y abre tu playlist.
    // 2. Click en los 3 puntos -> Compartir -> Insertar playlist (Embed).
    // 3. Copia el link que dice 'src="..."' (solo la url).
    // 4. Pégalo abajo en la variable 'spotifyEmbedUrl'.

    // Ejemplo: Playlist "Románticas en Español"
    const spotifyEmbedUrl = "https://open.spotify.com/embed/playlist/3JKBwdD1KVI5XoeQlkhI8P?utm_source=generator";

    return (
        <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Nuestra Playlist</h2>

            <p style={{ marginBottom: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
                Canciones que me recuerdan a ti...
            </p>

            <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                background: '#282828' // Spotify dark bg fallback
            }}>
                <iframe
                    style={{ borderRadius: '12px' }}
                    src={spotifyEmbedUrl}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    allowFullScreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify Player"
                ></iframe>
            </div>
        </div>
    );
};

export default MusicPlayer;
