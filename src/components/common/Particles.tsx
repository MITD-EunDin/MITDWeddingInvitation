import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'sparkle' | 'petal';
  color: string;
  delay: number;
}

interface ParticlesProps {
  children?: ReactNode;
  /** Số lượng particle tối đa */
  count?: number;
  /** Bật/tắt particle */
  enabled?: boolean;
  /** Màu chủ đạo (hex) */
  primaryColor?: string;
  /** Màu phụ (hex) */
  secondaryColor?: string;
  /** Container className */
  className?: string;
  /** Giảm chuyển động */
  respectReducedMotion?: boolean;
}

const TYPE_WEIGHTS = { heart: 0.6, sparkle: 0.25, petal: 0.15 };

function getRandomType(): 'heart' | 'sparkle' | 'petal' {
  const r = Math.random();
  if (r < TYPE_WEIGHTS.heart) return 'heart';
  if (r < TYPE_WEIGHTS.heart + TYPE_WEIGHTS.sparkle) return 'sparkle';
  return 'petal';
}

function createParticle(
  width: number,
  height: number,
  primaryColor: string,
  secondaryColor: string
): Particle {
  const type = getRandomType();
  const isHeart = type === 'heart';
  const size = isHeart ? 16 + Math.random() * 12 : type === 'sparkle' ? 8 + Math.random() * 8 : 10 + Math.random() * 10;

  return {
    x: Math.random() * width,
    y: height + size,
    size,
    speed: isHeart ? 0.3 + Math.random() * 0.4 : type === 'sparkle' ? 0.5 + Math.random() * 0.5 : 0.2 + Math.random() * 0.3,
    opacity: 0,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    type,
    color: Math.random() < 0.7 ? primaryColor : secondaryColor,
    delay: Math.random() * 3000,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function Particles({
  children,
  count = 15,
  enabled = true,
  primaryColor = '#B99364',
  secondaryColor = '#E8B4B4',
  className = '',
  respectReducedMotion = true,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [prefersReduced, setPrefersReduced] = useState(false);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    if (respectReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReduced(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [respectReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        setDimensions({ width: rect.width, height: rect.height });
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!enabled || prefersReduced || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(dimensions.width, dimensions.height, primaryColor, secondaryColor)
    );

    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTimeRef.current) / 1000;
      const { width, height } = dimensions;

      ctx.clearRect(0, 0, width * window.devicePixelRatio, height * window.devicePixelRatio);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      particlesRef.current = particlesRef.current
        .map((p) => {
          // Wait for delay
          if (elapsed * 1000 < p.delay) return p;

          // Update position
          const newY = p.y - p.speed * 60;
          const newX = p.x + Math.sin(elapsed * 2 + p.x * 0.01) * 0.5;
          const newRotation = p.rotation + p.rotationSpeed;
          const progress = 1 - newY / (height + p.size);

          // Fade in/out
          let newOpacity = p.opacity;
          if (progress < 0.1) {
            newOpacity = lerp(p.opacity, 1, 0.1);
          } else if (progress > 0.9) {
            newOpacity = lerp(p.opacity, 0, 0.1);
          } else {
            newOpacity = lerp(p.opacity, 0.8 + Math.sin(elapsed * 3 + p.x) * 0.2, 0.05);
          }

          // Draw particle
          if (newOpacity > 0.01) {
            ctx.save();
            ctx.translate(newX, newY);
            ctx.rotate((newRotation * Math.PI) / 180);
            ctx.globalAlpha = newOpacity;
            ctx.fillStyle = p.color;

            // Draw as text/emoji for simplicity (better performance)
            const char = p.type === 'heart' ? '♥' : p.type === 'sparkle' ? '✦' : '❀';
            const fontSize = p.size;
            ctx.font = `${fontSize}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char, 0, 0);

            ctx.restore();
          }

          // Recycle if out of bounds
          if (newY < -p.size || newOpacity <= 0.01) {
            return createParticle(width, height, primaryColor, secondaryColor);
          }

          return { ...p, x: newX, y: newY, rotation: newRotation, opacity: newOpacity };
        })
        .filter((p) => p.y > -p.size && p.opacity > 0.01);

      // Maintain particle count
      while (particlesRef.current.length < count) {
        particlesRef.current.push(createParticle(width, height, primaryColor, secondaryColor));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [enabled, prefersReduced, dimensions.width, dimensions.height, count, primaryColor, secondaryColor]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{ touchAction: 'none' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Lightweight CSS-only floating hearts alternative (no canvas)
 * Use this for simpler implementation or as fallback
 */
export function FloatingHearts({
  count = 12,
  colors = ['#E8B4B4', '#B99364', '#F5D0D0', '#D4A5A5'],
  className = '',
}: { count?: number; colors?: string[]; className?: string }) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const color = colors[i % colors.length];
        const size = 16 + (i % 4) * 8;
        const left = 5 + (i * 8.33) % 90;
        const delay = (i * 0.7) % 8;
        const duration = 8 + (i % 3) * 4;
        const drift = (i % 5 - 2) * 15;

        return (
          <div
            key={i}
            className="absolute bottom-[-50px]"
            style={{
              left: `${left}%`,
              fontSize: `${size}px`,
              color,
              opacity: 0.6 + (i % 3) * 0.15,
              animation: `float-heart ${duration}s ease-in-out ${delay}s infinite`,
              transform: `translateX(${drift}px)`,
            }}
          >
            ♥
          </div>
        );
      })}
    </div>
  );
}

/**
 * Falling Hearts - CSS-only animation of hearts falling from top to bottom
 * Full screen effect, optimized with CSS animations
 */
export function FallingHearts({
  count = 15,
  colors = ['#E8B4B4', '#B99364', '#F5D0D0', '#D4A5A5', '#FFB6C1', '#FFA0A0'],
  className = '',
  respectReducedMotion = true,
}: { count?: number; colors?: string[]; className?: string; respectReducedMotion?: boolean }) {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (respectReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReduced(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [respectReducedMotion]);

  if (prefersReduced) return null;

  // Generate unique keyframes for each heart
  const hearts = Array.from({ length: count }).map((_, i) => {
    const color = colors[i % colors.length];
    // Random size between 12px and 32px
    const size = 12 + Math.random() * 20;
    // Random horizontal position (5% to 95%)
    const left = 5 + Math.random() * 90;
    // Random delay (0 to 15s)
    const delay = Math.random() * 15;
    // Random duration (10s to 22s) - slower = more elegant
    const duration = 10 + Math.random() * 12;
    // Random horizontal drift (-50px to 50px)
    const drift = (Math.random() - 0.5) * 100;
    // Random rotation direction and speed
    const rotationDirection = Math.random() > 0.5 ? 1 : -1;
    const rotationDegrees = 360 * rotationDirection * (1 + Math.random() * 2);
    // Random opacity (0.3 to 0.8)
    const opacity = 0.3 + Math.random() * 0.5;
    // Random heart style (♥ or ♡)
    const heartChar = Math.random() > 0.7 ? '♡' : '♥';

    return { i, color, size, left, delay, duration, drift, rotationDegrees, opacity, heartChar };
  });

  // Build keyframes CSS
  const keyframesCSS = hearts.map((h) => `
    @keyframes fall-heart-${h.i} {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 0;
      }
      5% {
        opacity: ${h.opacity};
      }
      10% {
        opacity: ${h.opacity};
      }
      90% {
        opacity: ${h.opacity};
      }
      95% {
        opacity: 0;
      }
      100% {
        transform: translateY(110vh) translateX(${h.drift}px) rotate(${h.rotationDegrees}deg);
        opacity: 0;
      }
    }
  `).join('');

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true" style={{ perspective: '1000px' }}>
      {hearts.map((h) => (
        <div
          key={h.i}
          className="absolute"
          style={{
            left: `${h.left}%`,
            top: '-50px',
            fontSize: `${h.size}px`,
            color: h.color,
            opacity: h.opacity,
            animation: `fall-heart-${h.i} ${h.duration}s ease-in ${h.delay}s infinite`,
          }}
        >
          {h.heartChar}
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: keyframesCSS }} />
    </div>
  );
}