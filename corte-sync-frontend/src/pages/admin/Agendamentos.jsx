import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Badge, { statusToTone } from "../../components/ui/Badge";
import StatusSelect from "../../components/ui/StatusSelect";
import { useToast } from "../../context/ToastContext";
import {
  listarTodosAgendamentos,
  cancelarAgendamento,
  concluirAgendamento,
  reverterParaConfirmado,
} from "../../api/agendamentos";
import { formatBRL, formatDatePtBR, formatTime } from "../../utils/format";
import { IMAGES } from "../../utils/images";

const STATUS_TABS = [
  { value: "TODOS", label: "Todos" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "CONCLUIDO", label: "Concluído" },
  { value: "CANCELADO", label: "Cancelado" },
];

export default function AdminAgendamentos() {
  const toast = useToast();
  const [todosAgendamentos, setTodosAgendamentos] = useState([]);
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  function load() {
    setLoading(true);
    setError("");
    listarTodosAgendamentos()
      .then(setTodosAgendamentos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  // Filtering client-side avoids a backend quirk where the status-filtered
  // endpoint doesn't include clienteId/barbeiroId in its response.
  const agendamentos =
    statusFiltro === "TODOS"
      ? todosAgendamentos
      : todosAgendamentos.filter((a) => a.status === statusFiltro);

  async function handleStatusChange(agendamento, novoStatus) {
    if (novoStatus === agendamento.status) return;

    setActingId(agendamento.id);
    try {
      if (novoStatus === "CONCLUIDO") {
        await concluirAgendamento(agendamento.id);
        toast.success("Agendamento concluído com sucesso!");
      } else if (novoStatus === "CANCELADO") {
        await cancelarAgendamento(agendamento.id, agendamento.clienteId);
        toast.success("Agendamento cancelado com sucesso!");
      } else {
        await reverterParaConfirmado(agendamento.id);
        toast.success("Agendamento revertido para Confirmado!");
      }
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActingId(null);
    }
  }

  return (
    <AdminLayout>
      <div className="relative overflow-hidden rounded-xl border border-border">
        <img src={IMAGES.adminAgendamentos} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(11,14,20,0.92) 30%, rgba(11,14,20,0.55) 100%)" }}
        />
        <div className="relative px-4 py-6 sm:px-6 sm:py-8">
          <h1 className="font-display text-2xl font-semibold text-cream">Agendamentos</h1>
          <p className="mt-1 text-sm text-muted">Acompanhe e gerencie todos os agendamentos.</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFiltro(tab.value)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              statusFiltro === tab.value
                ? "border-gold bg-gold text-ink font-semibold"
                : "border-border text-cream/70 hover:border-gold/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => load()}
          className="ml-auto flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-cream/70 hover:border-gold hover:text-gold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Atualizar
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
        {loading && <p className="p-6 text-sm text-muted">Carregando...</p>}
        {error && <p className="p-6 text-sm text-danger">{error}</p>}

        {!loading && !error && (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Barbeiro</th>
                <th className="px-6 py-3 font-medium">Data / Hora</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((a) => (
                <tr key={a.id} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-4 font-medium text-cream">{a.clienteNome}</td>
                  <td className="px-6 py-4 text-cream/70">{a.barbeiroNome}</td>
                  <td className="px-6 py-4 text-cream/70">
                    {formatDatePtBR(a.dataInicio)} · {formatTime(a.dataInicio.slice(11, 19))}
                  </td>
                  <td className="px-6 py-4 text-cream/70">{formatBRL(a.valorTotal)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge tone={statusToTone(a.status)}>{a.status}</Badge>
                      <StatusSelect
                        value={a.status}
                        disabled={actingId === a.id}
                        onChange={(novoStatus) => handleStatusChange(a, novoStatus)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {agendamentos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
