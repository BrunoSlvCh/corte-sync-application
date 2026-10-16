// Interruptor liga/desliga (usado para Ativo/Inativo).
export default function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors disabled:opacity-50 ${
        checked ? "border-success/40 bg-success/30" : "border-border bg-surface-3"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full transition-transform ${
          checked ? "translate-x-6 bg-success" : "translate-x-1 bg-muted"
        }`}
      />
    </button>
  );
}
