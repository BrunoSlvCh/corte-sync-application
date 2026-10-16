const OPTIONS = [
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "CONCLUIDO", label: "Concluído" },
  { value: "CANCELADO", label: "Cancelado" },
];

export default function StatusSelect({ value, disabled, onChange }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-cream outline-none focus:border-gold disabled:opacity-50"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
