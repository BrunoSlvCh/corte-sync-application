import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Barbeiro" },
  { n: 2, label: "Serviço" },
  { n: 3, label: "Data e Hora" },
  { n: 4, label: "Confirmar" },
];

export default function Stepper({ current }) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const state =
          step.n < current ? "done" : step.n === current ? "current" : "upcoming";
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
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
                className={`text-xs ${
                  state === "upcoming" ? "text-muted" : "text-cream"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 mb-5 h-px w-12 sm:w-20 ${
                  step.n < current ? "bg-gold" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
