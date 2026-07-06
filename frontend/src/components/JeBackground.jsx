/**
 * JeBackground — renderiza o logo real da JE Portugal em múltiplas posições,
 * tamanhos e rotações irregulares, com animação de flutuação suave.
 *
 * O logo SVG foi traçado fielmente a partir do branding oficial da JE Portugal:
 *  - J: stem vertical, barra horizontal no topo, curva inferior para a esquerda
 *  - E: dois retângulos horizontais empilhados (a marca gráfica característica)
 * Tudo em stroke (outline) sem preenchimento, igual à imagem de referência.
 */

// Logo JE Portugal traçado em SVG — fiel ao original
const JE_LOGO = (
  <svg
    viewBox="0 0 100 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%' }}
  >
    {/* ── J ── */}
    {/* Barra horizontal superior */}
    <line x1="8" y1="12" x2="42" y2="12" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
    {/* Stem vertical */}
    <line x1="30" y1="12" x2="30" y2="64" stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" />
    {/* Curva inferior para a esquerda */}
    <path
      d="M30 64 Q30 80 18 80 Q8 80 8 70"
      stroke="currentColor" strokeWidth="5.5" strokeLinecap="square" fill="none"
    />

    {/* ── E (duas barras horizontais empilhadas) ── */}
    {/* Barra superior */}
    <rect x="52" y="10" width="40" height="16" rx="0" stroke="currentColor" strokeWidth="4.5" fill="none" />
    {/* Barra inferior */}
    <rect x="52" y="42" width="40" height="16" rx="0" stroke="currentColor" strokeWidth="4.5" fill="none" />
  </svg>
);

// Distribuição irregular e orgânica — diferentes posições, escalas e rotações
// left/top em %, size em px, rot em graus, opacidade, delay de animação
const LOGOS = [
  // Muito pequenos — fundo distante
  { left: 3,   top: 5,   size: 28, rot: -8,  op: 0.12, anim: 0 },
  { left: 18,  top: 2,   size: 22, rot: 5,   op: 0.10, anim: 2 },
  { left: 38,  top: 6,   size: 26, rot: -3,  op: 0.11, anim: 1 },
  { left: 58,  top: 3,   size: 20, rot: 10,  op: 0.09, anim: 3 },
  { left: 75,  top: 7,   size: 30, rot: -6,  op: 0.12, anim: 0 },
  { left: 91,  top: 2,   size: 24, rot: 3,   op: 0.10, anim: 2 },

  { left: 7,   top: 22,  size: 24, rot: 12,  op: 0.10, anim: 1 },
  { left: 27,  top: 18,  size: 32, rot: -5,  op: 0.13, anim: 3 },
  { left: 48,  top: 21,  size: 22, rot: 8,   op: 0.09, anim: 0 },
  { left: 68,  top: 17,  size: 28, rot: -10, op: 0.11, anim: 2 },
  { left: 85,  top: 22,  size: 26, rot: 4,   op: 0.10, anim: 1 },

  { left: 1,   top: 42,  size: 20, rot: -7,  op: 0.09, anim: 2 },
  { left: 15,  top: 38,  size: 30, rot: 6,   op: 0.12, anim: 0 },
  { left: 33,  top: 44,  size: 24, rot: -12, op: 0.10, anim: 3 },
  { left: 52,  top: 39,  size: 28, rot: 2,   op: 0.11, anim: 1 },
  { left: 72,  top: 43,  size: 22, rot: -4,  op: 0.09, anim: 0 },
  { left: 89,  top: 40,  size: 32, rot: 9,   op: 0.13, anim: 2 },

  { left: 5,   top: 62,  size: 26, rot: 5,   op: 0.11, anim: 1 },
  { left: 22,  top: 58,  size: 22, rot: -9,  op: 0.09, anim: 3 },
  { left: 43,  top: 63,  size: 30, rot: 7,   op: 0.12, anim: 0 },
  { left: 62,  top: 59,  size: 24, rot: -3,  op: 0.10, anim: 2 },
  { left: 80,  top: 62,  size: 28, rot: 11,  op: 0.11, anim: 1 },
  { left: 95,  top: 58,  size: 20, rot: -6,  op: 0.09, anim: 3 },

  { left: 10,  top: 80,  size: 24, rot: -4,  op: 0.10, anim: 2 },
  { left: 30,  top: 78,  size: 28, rot: 8,   op: 0.12, anim: 0 },
  { left: 55,  top: 82,  size: 22, rot: -11, op: 0.09, anim: 1 },
  { left: 74,  top: 79,  size: 32, rot: 3,   op: 0.13, anim: 3 },
  { left: 93,  top: 83,  size: 26, rot: -7,  op: 0.10, anim: 2 },

  // Médios — camada intermédia
  { left: 12,  top: 12,  size: 50, rot: -6,  op: 0.07, anim: 1 },
  { left: 62,  top: 55,  size: 46, rot: 8,   op: 0.06, anim: 3 },
  { left: 82,  top: 30,  size: 52, rot: -3,  op: 0.07, anim: 0 },
  { left: 35,  top: 68,  size: 48, rot: 12,  op: 0.06, anim: 2 },
  { left: 5,   top: 50,  size: 44, rot: -10, op: 0.06, anim: 1 },
  { left: 48,  top: 8,   size: 54, rot: 5,   op: 0.07, anim: 3 },

  // Grandes — destaque difuso
  { left: 20,  top: 32,  size: 88, rot: -4,  op: 0.045, anim: 2 },
  { left: 60,  top: 15,  size: 76, rot: 7,   op: 0.04,  anim: 0 },
  { left: 70,  top: 65,  size: 82, rot: -8,  op: 0.045, anim: 1 },
];

export default function JeBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none', overflow: 'hidden',
        background: '#f4f5f7',
      }}
    >
      {/* Logos dispersos irregularmente */}
      {LOGOS.map((l, i) => (
        <div
          key={i}
          className={`je-logo-float-${l.anim}`}
          style={{
            position: 'absolute',
            left: `${l.left}%`,
            top: `${l.top}%`,
            width: l.size,
            height: l.size * 0.9,
            color: '#6b7280',
            opacity: l.op,
            '--r': `${l.rot}deg`,
            transform: `rotate(${l.rot}deg)`,
            animationDelay: `${(i * 0.37) % 4}s`,
          }}
        >
          {JE_LOGO}
        </div>
      ))}

      {/* Vignette radial suave — o centro fica mais limpo */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 65% at 52% 46%, rgba(244,245,247,0.05) 0%, rgba(244,245,247,0.5) 50%, rgba(244,245,247,0.93) 100%)',
      }} />
    </div>
  );
}
