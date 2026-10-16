import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ArrowRight } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Badge, { statusToTone } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { buscarAgendamentosPorUsuario, cancelarAgendamento } from "../../api/agendamentos";
import { formatBRL, formatDatePtBR, formatTime } from "../../utils/format";

export default function MeusAgendamentos() {
  const { auth } = useAuth();
  const toast = useToast();

  const [agendamentos, setAgendamentos] = useState(null);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  function load() {
    setError("");
    buscarAgendamentosPorUsuario(auth.id)
      .then(setAgendamentos)
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleCancelar(id) {
    setActingId(id);
    try {
      await cancelarAgendamento(id, auth.id);
      toast.success("Agendamento cancelado com sucesso!");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActingId(null);
    }
  }

  const ordenados = agendamentos
    ? [...agendamentos].sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio))
    : [];

  return (
    <div className="min-h-screen bg-ink">
      <PublicNavbar />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-2xl font-semibold text-cream">Meus agendamentos</h1>
        <p className="mt-1 text-sm text-muted">Acompanhe seus horários marcados na barbearia.</p>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {agendamentos === null && !error && <p className="mt-8 text-sm text-muted">Carregando...</p>}

        {agendamentos !== null && ordenados.length === 0 && (
          <div className="mt-10 flex flex-col items-center rounded-xl border border-border bg-surface p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
              <CalendarClock className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm text-muted">Você ainda não tem nenhum agendamento.</p>
            <Button as={Link} to="/agendamento" className="mt-6">
              Agendar horário <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="mt-8 space-y-3">
          {ordenados.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-cream">{a.barbeiroNome}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {formatDatePtBR(a.dataInicio)} · {formatTime(a.dataInicio.slice(11, 19))} ·{" "}
                  {a.servicos?.map((s) => s.nomeServico).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gold">{formatBRL(a.valorTotal)}</span>
                <Badge tone={statusToTone(a.status)}>{a.status}</Badge>
                {a.status === "CONFIRMADO" && (
                  <Button
                    variant="ghost"
                    className="px-3 py-1.5 text-xs"
                    loading={actingId === a.id}
                    onClick={() => handleCancelar(a.id)}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
