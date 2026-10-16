import { CalendarDays, Clock, Scissors, User } from "lucide-react";
import { formatBRL, formatDatePtBR } from "../../utils/format";

export default function BookingSummary({ barbeiro, servicos, data, hora }) {
  const total = servicos.reduce((sum, s) => sum + parseFloat(s.precoServico || 0), 0);
  const duracao = servicos.reduce((sum, s) => sum + (s.duracaoServico || 0), 0);

  return (
    <div className="w-full rounded-xl border border-border bg-surface p-6 lg:w-80 lg:shrink-0">
      <h3 className="font-display text-base font-semibold text-cream">Resumo do agendamento</h3>

      {barbeiro ? (
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
            <User className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-sm font-medium text-cream">{barbeiro.nome}</p>
            <p className="text-xs text-muted">Barbeiro selecionado</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Selecione um barbeiro para continuar.</p>
      )}

      {servicos.length > 0 && (
        <div className="mt-5 space-y-2 border-t border-border pt-4">
          {servicos.map((s) => (
            <div key={s.nomeServico} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-cream/80">
                <Scissors className="h-3.5 w-3.5 text-gold" />
                {s.nomeServico}
              </span>
              <span className="text-cream/60">{formatBRL(s.precoServico)}</span>
            </div>
          ))}
        </div>
      )}

      {(data || hora) && (
        <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          {data && (
            <div className="flex items-center gap-2 text-cream/80">
              <CalendarDays className="h-3.5 w-3.5 text-gold" />
              {formatDatePtBR(`${data}T00:00:00`)}
            </div>
          )}
          {hora && (
            <div className="flex items-center gap-2 text-cream/80">
              <Clock className="h-3.5 w-3.5 text-gold" />
              {hora}
            </div>
          )}
        </div>
      )}

      {servicos.length > 0 && (
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted">Total ({duracao} min)</span>
          <span className="font-display text-lg text-gold">{formatBRL(total)}</span>
        </div>
      )}
    </div>
  );
}
