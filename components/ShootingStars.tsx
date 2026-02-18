'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  speed: number;
  size: number;
}

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  const createStarExplosion = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const numStars = 30;
    const newStars: Star[] = [];

    for (let i = 0; i < numStars; i++) {
      const angle = (Math.PI * 2 * i) / numStars;
      newStars.push({
        id: Date.now() + i,
        startX: centerX,
        startY: centerY,
        angle,
        speed: 3 + Math.random() * 4,
        size: 2 + Math.random() * 3
      });
    }

    setStars(newStars);

    setTimeout(() => {
      setStars([]);
    }, 2000);
  };

  useEffect(() => {
    const handleLogoClick = () => {
      createStarExplosion();
    };

    window.addEventListener('logo-click', handleLogoClick);

    return () => {
      window.removeEventListener('logo-click', handleLogoClick);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes shoot-star {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--star-x), var(--star-y));
            opacity: 0;
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {stars.map((star) => {
          const translateX = Math.cos(star.angle) * star.speed * 300;
          const translateY = Math.sin(star.angle) * star.speed * 300;

          return (
            <div
              key={star.id}
              className="absolute"
              style={{
                left: `${star.startX}px`,
                top: `${star.startY}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                ['--star-x' as any]: `${translateX}px`,
                ['--star-y' as any]: `${translateY}px`,
                animation: 'shoot-star 2s ease-out forwards',
              }}
            >
              <div className="relative w-full h-full">
                <div
                  className="absolute w-full h-full rounded-full bg-white"
                  style={{
                    boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(6, 182, 212, 0.6)',
                  }}
                />
                <div
                  className="absolute h-0.5 bg-gradient-to-r from-white to-transparent"
                  style={{
                    width: `${star.size * 20}px`,
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${star.angle}rad) translateY(-50%)`,
                    transformOrigin: 'left center',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
