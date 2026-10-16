export default function Input({ label, icon: Icon, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm text-muted">{label}</span>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        )}
        <input
          className={`w-full rounded-lg border border-border bg-surface-2 py-2.5 text-sm text-cream placeholder:text-muted/70 outline-none transition-colors focus:border-gold ${
            Icon ? "pl-10 pr-3" : "px-3"
          } ${error ? "border-danger" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
