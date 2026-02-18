'use client';

import { useEffect, useRef, useState } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkMobile();
    checkReducedMotion();

    window.addEventListener('resize', checkMobile);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      motionQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    interface Wave {
      amplitude: number;
      frequency: number;
      phase: number;
      speed: number;
      yOffset: number;
      opacity: number;
      color: string;
    }

    const waves: Wave[] = [
      {
        amplitude: 40,
        frequency: 0.003,
        phase: 0,
        speed: 0.0028,
        yOffset: canvas.height * 0.7,
        opacity: 0.15,
        color: '107, 142, 178'
      },
      {
        amplitude: 50,
        frequency: 0.0025,
        phase: Math.PI / 3,
        speed: 0.0021,
        yOffset: canvas.height * 0.75,
        opacity: 0.2,
        color: '123, 158, 194'
      },
      {
        amplitude: 35,
        frequency: 0.004,
        phase: Math.PI / 2,
        speed: 0.0035,
        yOffset: canvas.height * 0.8,
        opacity: 0.25,
        color: '139, 174, 210'
      },
      {
        amplitude: 60,
        frequency: 0.002,
        phase: Math.PI,
        speed: 0.0014,
        yOffset: canvas.height * 0.65,
        opacity: 0.1,
        color: '91, 126, 162'
      },
      {
        amplitude: 45,
        frequency: 0.0035,
        phase: Math.PI * 1.5,
        speed: 0.00245,
        yOffset: canvas.height * 0.85,
        opacity: 0.18,
        color: '115, 150, 186'
      }
    ];

    let animationFrameId: number;

    const drawWave = (wave: Wave) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x++) {
        const y = wave.yOffset +
          Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
          Math.cos(x * wave.frequency * 0.7 + wave.phase * 0.5) * (wave.amplitude * 0.3);

        if (x === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, wave.yOffset - wave.amplitude, 0, canvas.height);
      gradient.addColorStop(0, `rgba(${wave.color}, ${wave.opacity})`);
      gradient.addColorStop(0.5, `rgba(${wave.color}, ${wave.opacity * 0.6})`);
      gradient.addColorStop(1, `rgba(${wave.color}, 0.02)`);

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = `rgba(${wave.color}, ${wave.opacity * 1.5})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${wave.color}, ${wave.opacity * 2})`;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    let lastTime = performance.now();
    const targetFPS = 20;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastTime;

      if (elapsed > frameInterval) {
        lastTime = currentTime - (elapsed % frameInterval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        waves.forEach(wave => {
          wave.phase += wave.speed;
          drawWave(wave);
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(performance.now());

    const handleResize = () => {
      setCanvasSize();
      waves.forEach(wave => {
        const heightRatio = wave.yOffset / canvas.height;
        wave.yOffset = canvas.height * heightRatio;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, prefersReducedMotion]);

  if (isMobile || prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
