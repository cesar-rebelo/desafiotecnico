import { useEffect, useRef } from 'react';

// Disposição irregular, orgânica e dinâmica para dar vida ao fundo.
// Coordenadas x/y em %, tamanho em px, rotação em graus, opacidade, desfoque (blur) e tipo de animação.
// Aumentamos as opacidades (para a faixa de 0.08 a 0.22) para garantir que os logos sejam visíveis.
const LOGO_CONFIGS = [
  { x: 4,   y: 8,   size: 45,  rot: -15, op: 0.16, blur: 0, anim: 0 },
  { x: 22,  y: 5,   size: 65,  rot: 12,  op: 0.14, blur: 0.5, anim: 1 },
  { x: 10,  y: 32,  size: 90,  rot: 8,   op: 0.12, blur: 1.5, anim: 2 },
  { x: 35,  y: 12,  size: 130, rot: -8,  op: 0.09, blur: 2, anim: 3 },
  { x: 54,  y: 6,   size: 55,  rot: 18,  op: 0.15, blur: 0, anim: 0 },
  { x: 74,  y: 10,  size: 80,  rot: -22, op: 0.13, blur: 1, anim: 1 },
  { x: 90,  y: 4,   size: 60,  rot: 10,  op: 0.15, blur: 0, anim: 2 },

  { x: 7,   y: 56,  size: 110, rot: 25,  op: 0.10, blur: 2, anim: 3 },
  { x: 28,  y: 48,  size: 150, rot: -10, op: 0.08, blur: 3, anim: 0 },
  { x: 48,  y: 38,  size: 210, rot: 15,  op: 0.07, blur: 4, anim: 1 },
  { x: 66,  y: 52,  size: 120, rot: -18, op: 0.09, blur: 2, anim: 2 },
  { x: 84,  y: 44,  size: 170, rot: 6,   op: 0.08, blur: 3, anim: 3 },

  { x: 2,   y: 82,  size: 50,  rot: -12, op: 0.14, blur: 0, anim: 0 },
  { x: 19,  y: 88,  size: 85,  rot: 20,  op: 0.12, blur: 1, anim: 1 },
  { x: 38,  y: 75,  size: 125, rot: -15, op: 0.09, blur: 2, anim: 2 },
  { x: 58,  y: 82,  size: 180, rot: 8,   op: 0.08, blur: 3, anim: 3 },
  { x: 78,  y: 86,  size: 100, rot: -5,  op: 0.11, blur: 1.5, anim: 0 },
  { x: 92,  y: 78,  size: 70,  rot: 24,  op: 0.14, blur: 0.5, anim: 1 },
];

export default function JeBackground() {
  const containerRef = useRef(null);

  // Parallax suave ao mover o rato
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 16;
      const py = (e.clientY / window.innerHeight - 0.5) * 12;
      el.style.transform = `translate(${px}px, ${py}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#f4f5f7',
      }}
    >
      {/* Camada interativa dos logos */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: '-20px', // Margem para evitar corte nas bordas durante o parallax
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
      >
        {LOGO_CONFIGS.map((logo, idx) => (
          <img
            key={idx}
            src="/je-logo.png"
            alt=""
            className={`je-logo-float-${logo.anim}`}
            style={{
              position: 'absolute',
              left: `${logo.x}%`,
              top: `${logo.y}%`,
              width: `${logo.size}px`,
              height: 'auto',
              opacity: logo.op,
              transform: `rotate(${logo.rot}deg)`,
              filter: logo.blur > 0 ? `blur(${logo.blur}px)` : 'none',
              animationDelay: `${(idx * 0.45) % 5}s`,
              transformOrigin: 'center center',
              // Definir a variável CSS --r usada na animação de rotação no index.css
              '--r': `${logo.rot}deg`,
            }}
          />
        ))}
      </div>

      {/* Vignette radial suave para garantir legibilidade perfeita da app no centro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(244,245,247,0.1) 0%, rgba(244,245,247,0.45) 40%, rgba(244,245,247,0.82) 75%, rgba(244,245,247,0.96) 100%)',
        }}
      />
    </div>
  );
}
