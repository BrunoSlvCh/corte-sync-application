const VARIANTS = {
  primary:
    "bg-gold text-ink font-semibold hover:bg-gold-light active:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-cream border border-border hover:border-gold hover:text-gold disabled:opacity-50",
  danger:
    "bg-danger text-cream font-semibold hover:brightness-110 disabled:opacity-50",
  subtle:
    "bg-surface-3 text-cream hover:bg-surface-2 disabled:opacity-50",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  className = "",
  loading = false,
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm transition-colors duration-150 ${VARIANTS[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Tag>
  );
}
