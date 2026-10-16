export default function AuthHero({ eyebrow, title, subtitle, bullets }) {
  return (
    <div className="relative hidden overflow-hidden bg-surface lg:flex lg:w-1/2">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(212,169,74,0.16), transparent 45%), radial-gradient(circle at 80% 70%, rgba(212,169,74,0.10), transparent 50%), linear-gradient(160deg, #12151F 0%, #0B0E14 70%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="lines" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="42" stroke="#D4A94A" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col justify-end p-14">
        {eyebrow && (
          <span className="mb-4 text-sm text-gold">{eyebrow}</span>
        )}
        <h1 className="font-display text-4xl font-semibold leading-[1.1] text-cream">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{subtitle}</p>
        )}

        {bullets && (
          <div className="mt-10 flex gap-8">
            {bullets.map((b) => (
              <div key={b.label} className="flex flex-col items-start gap-2">
                <b.icon className="h-5 w-5 text-gold" />
                <span className="text-xs text-muted">{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
