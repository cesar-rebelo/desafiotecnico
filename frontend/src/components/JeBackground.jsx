/**
 * JeBackground
 *
 * Recria fielmente o padrão da imagem de referência:
 *  - Grid densa de logos JE Portugal em outline
 *  - Logo central maior e mais opaco (como na imagem)
 *  - Vignette radial que ilumina o centro e escurece as bordas
 *  - Leve animação de parallax ao mover o rato
 */

import { useEffect, useRef } from 'react';

/* ─── SVG do logo JE Portugal ─── */
/* Traçado a partir da imagem de referência:
   - J: barra horizontal no topo, stem vertical, curva inferior para a esquerda
   - E: dois retângulos horizontais empilhados (marca gráfica JE Portugal) */
function JeLogo({ size, stroke = 1.6, color = 'currentColor' }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s * 0.78}
      viewBox="0 0 100 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── J ── */}
      {/* Barra horizontal superior */}
      <line x1="4"  y1="7"  x2="36" y2="7"  stroke={color} strokeWidth={stroke * 3.5} strokeLinecap="square" />
      {/* Stem vertical */}
      <line x1="26" y1="7"  x2="26" y2="55" stroke={color} strokeWidth={stroke * 3.5} strokeLinecap="square" />
      {/* Curva inferior — vai para a esquerda */}
      <path
        d="M26 55 Q26 70 14 70 Q5 70 5 62"
        stroke={color} strokeWidth={stroke * 3.5} strokeLinecap="square" fill="none"
      />

      {/* ── E: dois retângulos horizontais empilhados ── */}
      <rect x="44" y="4"  width="52" height="22" stroke={color} strokeWidth={stroke * 3.2} fill="none" />
      <rect x="44" y="46" width="52" height="22" stroke={color} strokeWidth={stroke * 3.2} fill="none" />
    </svg>
  );
}

/* ─── Configuração do grid ─── */
const COLS         = 14;
const ROWS         = 10;
const LOGO_W       = 64;   // largura de cada logo em px
const LOGO_H       = 50;   // altura de cada logo em px
const GAP_X        = 14;   // espaço horizontal entre logos
const GAP_Y        = 18;   // espaço vertical entre logos

/* Calcula opacidade com base na distância ao centro do grid */
function opacityForCell(col, row) {
  const cx   = (COLS - 1) / 2;
  const cy   = (ROWS - 1) / 2;
  const dx   = (col - cx) / cx;
  const dy   = (row - cy) / cy;
  const dist = Math.sqrt(dx * dx + dy * dy);          // 0 = centro, ~1.4 = canto
  // Centro: 0.35, bordas: 0.08
  return Math.max(0.07, 0.35 - dist * 0.22);
}

export default function JeBackground() {
  const wrapRef = useRef(null);

  /* Parallax suave ao mover o rato */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onMove = (e) => {
      const px = (e.clientX / window.innerWidth  - 0.5) * 12;
      const py = (e.clientY / window.innerHeight - 0.5) * 8;
      el.style.transform = `translate(${px}px, ${py}px)`;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const totalW = COLS * (LOGO_W + GAP_X) - GAP_X;
  const totalH = ROWS * (LOGO_H + GAP_Y) - GAP_Y;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none', overflow: 'hidden',
        background: '#f4f5f7',
      }}
    >
      {/* Grid de logos */}
      <div
        ref={wrapRef}
        style={{
          position: 'absolute',
          /* Centrar o grid no ecrã e deixar margem extra para o parallax */
          top:  '50%', left: '50%',
          width:  totalW,
          height: totalH,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.6s cubic-bezier(.22,1,.36,1)',
          willChange: 'transform',
        }}
      >
        {Array.from({ length: ROWS }).map((_, row) =>
          Array.from({ length: COLS }).map((_, col) => {
            const isCenterCol = col === Math.floor(COLS / 2);
            const isCenterRow = row === Math.floor(ROWS / 2);
            const isCenter    = isCenterCol && isCenterRow;
            const size        = isCenter ? LOGO_W * 1.85 : LOGO_W;
            const op          = isCenter ? 0.42 : opacityForCell(col, row);

            return (
              <div
                key={`${col}-${row}`}
                style={{
                  position: 'absolute',
                  left: col * (LOGO_W + GAP_X) + (isCenter ? -(size - LOGO_W) / 2 : 0),
                  top:  row * (LOGO_H + GAP_Y) + (isCenter ? -(size * 0.78 - LOGO_H) / 2 : 0),
                  color: '#374151',
                  opacity: op,
                  /* Animação de flutuação apenas no logo central */
                  ...(isCenter ? { animation: 'jeFloat 5s ease-in-out infinite' } : {}),
                }}
              >
                <JeLogo
                  size={size}
                  stroke={isCenter ? 1.2 : 1.6}
                  color={isCenter ? '#1e293b' : '#6b7280'}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Vignette radial — centro aberto, bordas fechadas */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(
          ellipse 60% 55% at 50% 50%,
          rgba(244,245,247,0.0)  0%,
          rgba(244,245,247,0.45) 45%,
          rgba(244,245,247,0.88) 80%,
          rgba(244,245,247,0.97) 100%
        )`,
      }} />

      {/* Keyframe inline para o logo central */}
      <style>{`
        @keyframes jeFloat {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
