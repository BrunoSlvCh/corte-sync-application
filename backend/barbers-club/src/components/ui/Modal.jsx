import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, width = "max-w-md" }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full ${width} rounded-2xl border border-border bg-surface p-6 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted transition-colors hover:bg-surface-3 hover:text-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
