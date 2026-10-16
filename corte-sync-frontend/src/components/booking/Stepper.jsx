import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Barbeiro" },
  { n: 2, label: "Serviço" },
  { n: 3, label: "Data e Hora" },
  { n: 4, label: "Confirmar" },
];

// As linhas entre os passos esticam (flex-1) para o indicador sempre caber na
// largura da tela, inclusive em celulares estreitos.
export default function Stepper({ current }) {
  return (
    <div className="flex w-full max-w-xl items-start">
      {STEPS.map((step, i) => {
        const state = step.n < current ? "done" : step.n === current ? "current" : "upcoming";
        return (
          <div key={step.n} className={`flex items-start ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex w-14 shrink-0 flex-col items-center gap-1.5 sm:w-16">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors sm:h-9 sm:w-9 ${
                  state === "done"
                    ? "border-gold bg-gold text-ink"
                    : state === "current"
                    ? "border-gold bg-transparent text-gold"
                    : "border-border bg-surface text-muted"
                }`}
              >
                {state === "done" ? <Check className="h-4 w-4" /> : step.n}
              </div>
              <span
                className={`text-center text-[11px] leading-tight sm:text-xs ${
                  state === "upcoming" ? "text-muted" : "text-cream"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mt-4 h-px min-w-2 flex-1 sm:mt-[18px] ${step.n < current ? "bg-gold" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
