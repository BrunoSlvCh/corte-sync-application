import { Scissors } from "lucide-react";

export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
        <Scissors className="h-4 w-4 text-gold" />
      </span>
      <span className="font-display leading-none">
        <span className="block text-sm font-semibold tracking-wide text-cream">CorteSync</span>
        <span className="block text-[10px] tracking-[0.25em] text-gold">BARBER'S</span>
      </span>
    </div>
  );
}
