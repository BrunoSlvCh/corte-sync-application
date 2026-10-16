import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, width = "max-w-md" }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[90vh] w-full ${width} flex-col rounded-2xl border border-border bg-surface shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-6 py-5">
          <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted transition-colors hover:bg-surface-3 hover:text-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
