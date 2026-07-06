import { useEffect, useState } from 'react';

export default function JeBackground() {
  const [dimensions, setDimensions] = useState({ cols: 18, rows: 14 });

  // Valores de espaçamento para repetição seamless perfeita do grid
  const COL_W = 140; // largura de cada coluna
  const GAP_Y = 180; // espaço vertical entre logos na mesma coluna

  // Ajustar colunas e linhas baseadas no tamanho do ecrã para cobrir totalmente sem quebras
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth * 1.5;
      const h = window.innerHeight * 1.5;
      setDimensions({
        cols: Math.max(12, Math.ceil(w / COL_W) + 2),
        rows: Math.max(10, Math.ceil(h / GAP_Y) + 2)
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      {/* Container principal animado diagonalmente */}
      <div
        className="je-grid-scroller"
        style={{
          position: 'absolute',
          width: '150vw',
          height: '150vh',
          top: '-25vh',
          left: '-25vw',
          willChange: 'transform',
        }}
      >
        {Array.from({ length: dimensions.cols }).map((_, colIdx) => {
          const x = colIdx * COL_W;
          const isStaggered = colIdx % 2 === 1;
          const yOffset = isStaggered ? GAP_Y / 2 : 0;

          return (
            <div
              key={colIdx}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: 0,
                width: '50px',
                height: '100%',
              }}
            >
              {Array.from({ length: dimensions.rows }).map((_, rowIdx) => {
                const y = rowIdx * GAP_Y + yOffset;
                return (
                  <img
                    key={rowIdx}
                    src="/je-outline.png?v=2"
                    alt=""
                    style={{
                      position: 'absolute',
                      top: `${y}px`,
                      left: 0,
                      width: '46px',
                      height: 'auto',
                      opacity: 0.22, // Opacidade ideal para contornos visíveis mas discretos
                      filter: 'grayscale(1)',
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Vignette radial ultra suave (apenas esbate ligeiramente nos cantos extremos) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(244,245,247,0) 65%, rgba(244,245,247,0.35) 100%)',
        }}
      />

      <style>{`
        .je-grid-scroller {
          animation: diagonalGridScroll 50s linear infinite;
        }
        @keyframes diagonalGridScroll {
          0% {
            transform: translate(0, 0);
          }
          100% {
            /* COL_W * 2 = 280px, GAP_Y = 180px para repetição perfeitamente seamless */
            transform: translate(-280px, 180px);
          }
        }
      `}</style>
    </div>
  );
}
