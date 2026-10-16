import { useEffect, useState } from "react";
import { Scissors, RefreshCw } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Badge, { statusToTone } from "../../components/ui/Badge";
import StatusSelect from "../../components/ui/StatusSelect";
import { useToast } from "../../context/ToastContext";
import {
  meusAgendamentosBarbeiro,
  concluirAgendamento,
  cancelarAgendamento,
  reverterParaConfirmado,
} from "../../api/agendamentos";
import { formatBRL, formatDatePtBR, formatTime, todayISODate } from "../../utils/format";

// Tela "Meus agendamentos" do barbeiro: lista só os atendimentos dele
// (o servidor identifica o barbeiro pelo token) e permite trocar o status.
export default function BarberArea() {
  const toast = useToast();

  const [agendamentos, setAgendamentos] = useState(null);
  const [falhou, setFalhou] = useState(false);
  const [actingId, setActingId] = useState(null);

  function load() {
    setFalhou(false);
    meusAgendamentosBarbeiro()
      .then(setAgendamentos)
      .catch((err) => {
        // Sem agendamentos para mostrar (ou conta sem vínculo de barbeiro): mostramos o
        // estado vazio em vez de uma caixa de erro. O detalhe fica no console.
        console.error("meus-agendamentos:", err);
        setAgendamentos([]);
        setFalhou(true);
      });
  }

  useEffect(load, []);

  async function handleStatusChange(agendamento, novoStatus) {
    if (novoStatus === agendamento.status) return;

    // Cancelar exige o id do cliente. Se a listagem não trouxer esse dado,
    // não dá para cancelar daqui — avisamos em vez de falhar em silêncio.
    if (novoStatus === "CANCELADO" && !agendamento.clienteId) {
      toast.error("Não foi possível cancelar este agendamento por aqui. Fale com o administrador.");
      return;
    }

    setActingId(agendamento.id);
    try {
      if (novoStatus === "CONCLUIDO") {
        await concluirAgendamento(agendamento.id);
        toast.success("Atendimento concluído com sucesso!");
      } else if (novoStatus === "CANCELADO") {
        await cancelarAgendamento(agendamento.id, agendamento.clienteId);
        toast.success("Agendamento cancelado com sucesso!");
      } else {
        await reverterParaConfirmado(agendamento.id);
        toast.success("Atendimento revertido para Confirmado!");
      }
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActingId(null);
    }
  }

  const hoje = todayISODate();
  const doDia = agendamentos?.filter((a) => a.dataInicio?.startsWith(hoje)) ?? [];
  const outros = agendamentos?.filter((a) => !a.dataInicio?.startsWith(hoje)) ?? [];

  return (
    <div className="min-h-screen bg-ink">
      <PublicNavbar />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
              <Scissors className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-cream sm:text-2xl">Meus agendamentos</h1>
              <p className="text-sm text-muted">Seus atendimentos. Altere o status ao lado de cada um.</p>
            </div>
          </div>
          <button
            onClick={load}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-cream/70 hover:border-gold hover:text-gold"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </button>
        </div>

        {agendamentos === null && <p className="mt-8 text-sm text-muted">Carregando...</p>}

        {agendamentos !== null && (
          <>
            <Section title="Hoje" items={doDia} onStatusChange={handleStatusChange} actingId={actingId} />
            <Section title="Próximos e anteriores" items={outros} onStatusChange={handleStatusChange} actingId={actingId} />
            {agendamentos.length === 0 && (
              <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-sm text-cream/80">Nenhum atendimento encontrado.</p>
                {falhou && (
                  <p className="mt-1 text-xs text-muted">
                    Se você esperava ver atendimentos aqui, toque em Atualizar.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Section({ title, items, onStatusChange, actingId }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="mb-3 font-display text-base font-semibold text-cream">{title}</h2>
      <div className="space-y-3">
        {items.map((a) => (
          <div
            key={a.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-cream">{a.clienteNome}</p>
              <p className="text-xs text-muted">
                {formatDatePtBR(a.dataInicio)} · {formatTime(a.dataInicio.slice(11, 19))} ·{" "}
                {a.servicos?.map((s) => s.nomeServico).join(", ")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gold">{formatBRL(a.valorTotal)}</span>
              <Badge tone={statusToTone(a.status)}>{a.status}</Badge>
              <StatusSelect
                value={a.status}
                disabled={actingId === a.id}
                onChange={(novoStatus) => onStatusChange(a, novoStatus)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
