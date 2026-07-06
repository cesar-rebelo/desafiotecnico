export default function JeBackground() {
  return (
    <div className="je-bg-scroll">
      {/* Vignette radial suave para garantir legibilidade perfeita da app no centro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(244,245,247,0.05) 0%, rgba(244,245,247,0.4) 40%, rgba(244,245,247,0.85) 75%, rgba(244,245,247,0.98) 100%)',
        }}
      />
    </div>
  );
}
