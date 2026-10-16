export default function AuthHero({ eyebrow, title, subtitle, image }) {
  return (
    <div className="relative hidden overflow-hidden bg-surface lg:flex lg:w-1/2">
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: image
            ? "linear-gradient(180deg, rgba(11,14,20,0.55) 0%, rgba(11,14,20,0.75) 55%, rgba(11,14,20,0.96) 100%)"
            : "radial-gradient(circle at 20% 20%, rgba(212,169,74,0.16), transparent 45%), radial-gradient(circle at 80% 70%, rgba(212,169,74,0.10), transparent 50%), linear-gradient(160deg, #12151F 0%, #0B0E14 70%)",
        }}
      />

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
      </div>
    </div>
  );
}
