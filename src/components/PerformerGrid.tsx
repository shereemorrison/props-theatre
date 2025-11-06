import React, { useMemo } from 'react';
import { Performer } from '../data/performers';
import { normalizePerformerNameForPhoto } from '../utils/photoMapper';

// Import all performer photos
const performerPhotos = import.meta.glob('../assets/images/performers/*.{jpg,jpeg,png,webp}', { eager: true });

// Import the no photo placeholder
// @ts-ignore - Image import handled by Vite
import noPhotoImage from '../assets/images/performers/nophoto.png';

interface PerformerGridProps {
  performers: Performer[];
}

export default function PerformerGrid({ performers }: PerformerGridProps) {
  // List of performers who should use nophoto.png
  const performersWithoutPhotos = ['Charlie Flack', 'Thomas McColl', 'Leila Skan', 'Olivia Ogeimi'];
  
  // Create a map of normalized names to photo paths
  // Prioritize webp files over jpg/png for better performance
  const photoMap = useMemo(() => {
    const map = new Map<string, string>();
    const webpPaths = new Map<string, string>(); // Track webp files separately
    
    Object.keys(performerPhotos).forEach((path) => {
      // Extract filename from path
      const filename = path.split('/').pop() || '';
      const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      const normalizedName = normalizePerformerNameForPhoto(nameWithoutExt);
      const ext = filename.split('.').pop()?.toLowerCase() || '';
      
      // Get the actual imported path
      const photoModule = performerPhotos[path] as { default?: string };
      const photoPath = photoModule?.default || path;
      
      // Prioritize webp files
      if (ext === 'webp') {
        webpPaths.set(normalizedName, photoPath);
      } else if (!webpPaths.has(normalizedName)) {
        // Only use jpg/png if no webp exists
        map.set(normalizedName, photoPath);
      }
    });
    
    // Merge webp paths (they take priority)
    webpPaths.forEach((path, name) => map.set(name, path));
    
    return map;
  }, []);

  // Function to get photo path for a performer
  const getPhotoPath = (performer: Performer): string | null => {
    // Check if this performer should use nophoto.png
    if (performersWithoutPhotos.includes(performer.name)) {
      return noPhotoImage;
    }
    
    const normalizedName = normalizePerformerNameForPhoto(performer.name);
    return photoMap.get(normalizedName) || null;
  };

  if (performers.length === 0) {
    return (
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.7)', 
        fontFamily: "Oswald, sans-serif",
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        marginTop: 'clamp(1rem, 2vh, 1.5rem)',
        marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
      }}>
        Performer information coming soon
      </p>
    );
  }

  return (
    <div className="performer-grid" style={{
      marginTop: 'clamp(1.5rem, 3vh, 2rem)',
      marginBottom: 'clamp(1.5rem, 3vh, 2rem)'
    }}>
      {performers.map((performer) => {
        const photoPath = getPhotoPath(performer);
        
        // Determine award from commitment
        const commitment = performer.commitment;
        const shouldShowAward = commitment && 
          commitment !== '(None)' && 
          commitment !== 'Beginner' && 
          commitment !== 'Intermediate';
        
        return (
          <div 
            key={performer.id} 
            className="performer-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(0.5rem, 1vw, 0.75rem)',
              padding: 'clamp(0.75rem, 1.5vw, 1rem)',
              borderRadius: 'clamp(8px, 1.5vw, 12px)',
              background: 'rgba(255, 215, 0, 0.05)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              opacity: 0, // Start hidden - GSAP will animate this
              transform: 'translateY(30px) scale(0.9)', // Start position - GSAP will animate this
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }}
          >
            {/* Photo */}
            <div style={{
              width: '100%',
              aspectRatio: '3 / 4',
              borderRadius: 'clamp(6px, 1vw, 8px)',
              overflow: 'hidden',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {photoPath ? (
                <img 
                  src={photoPath}
                  alt={performer.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    // Hide image if not found
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : null}
              {/* Placeholder if no photo */}
              {!photoPath && (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 215, 0, 0.5)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontFamily: 'Oswald, sans-serif',
                  fontWeight: 'bold'
                }}>
                  {performer.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name */}
            <div style={{
              fontWeight: 'bold',
              color: '#ffd700',
              fontFamily: "Oswald, sans-serif",
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              textAlign: 'center',
              lineHeight: 1.2
            }}>
              {performer.name}
            </div>

            {/* Role */}
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: "Oswald, sans-serif",
              fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
              textAlign: 'center',
              opacity: 0.8
            }}>
              Performer
            </div>

            {/* Award */}
            {shouldShowAward && (
              <div style={{
                color: '#ffd700',
                fontFamily: "Oswald, sans-serif",
                fontSize: 'clamp(0.75rem, 1.6vw, 0.85rem)',
                textAlign: 'center',
                opacity: 0.9,
                fontStyle: 'italic',
                marginTop: '0.25rem'
              }}>
                {commitment}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

