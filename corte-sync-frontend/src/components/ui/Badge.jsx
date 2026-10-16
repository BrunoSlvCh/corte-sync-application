const TONES = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  neutral: "bg-surface-3 text-muted border-border",
  gold: "bg-gold/15 text-gold border-gold/30",
};

// Maps the free-text `status` string coming from the API to a visual tone
export function statusToTone(status) {
  if (!status) return "neutral";
  const s = status.toUpperCase();
  if (["CONFIRMADO", "ATIVO", "CONCLUIDO"].includes(s)) return "success";
  if (["PENDENTE"].includes(s)) return "warning";
  if (["CANCELADO", "INATIVO"].includes(s)) return "danger";
  return "neutral";
}

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
