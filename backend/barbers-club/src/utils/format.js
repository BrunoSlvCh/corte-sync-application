export function formatBRL(value) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num || 0);
}

export function formatDatePtBR(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(d);
}

export function formatTime(localTime) {
  // Accepts "HH:mm:ss" or "HH:mm"
  if (!localTime) return "";
  return localTime.slice(0, 5);
}

// Combines a "yyyy-MM-dd" date string and "HH:mm" time string into
// a LocalDateTime-compatible ISO string without timezone (e.g. 2026-09-10T14:00:00)
export function combineDateTime(dateStr, timeStr) {
  const time = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  return `${dateStr}T${time}`;
}

export function todayISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}
