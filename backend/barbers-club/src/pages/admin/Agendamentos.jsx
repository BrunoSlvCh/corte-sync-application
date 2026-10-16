import { useState } from "react";
import { Search, XCircle, AlertCircle } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge, { statusToTone } from "../../components/ui/Badge";
import { useToast } from "../../context/ToastContext";
import { buscarAgendamento, cancelarAgendamento } from "../../api/agendamentos";
import { formatBRL, formatDatePtBR, formatTime } from "../../utils/format";

export default function AdminAgendamentos() {
  const toast = useToast();
  const [idAgendamento, setIdAgendamento] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [agendamento, setAgendamento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAgendamento(null);
    try {
      const data = await buscarAgendamento(idAgendamento, idUsuario);
      setAgendamento(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelar() {
    setLoading(true);
    try {
      await cancelarAgendamento(idAgendamento, idUsuario);
      toast.success("Agendamento cancelado com sucesso!");
      setAgendamento((a) => ({ ...a, status: "CANCELADO" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-cream">Agendamentos</h1>
      <p className="mt-1 text-sm text-muted">Consulte e gerencie agendamentos por ID.</p>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          A API ainda não possui um endpoint para listar todos os agendamentos, então esta tela
          permite apenas consultar um agendamento específico informando o ID do agendamento e o
          ID do cliente dono dele.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mt-6 flex flex-wrap items-end gap-4">
        <Input
          label="ID do agendamento"
          type="number"
          value={idAgendamento}
          onChange={(e) => setIdAgendamento(e.target.value)}
          className="max-w-[180px]"
          required
        />
        <Input
          label="ID do cliente"
          type="number"
          value={idUsuario}
          onChange={(e) => setIdUsuario(e.target.value)}
          className="max-w-[180px]"
          required
        />
        <Button type="submit" loading={loading}>
          <Search className="h-4 w-4" /> Buscar
        </Button>
      </form>

      {error && (
        <p className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {agendamento && (
        <div className="mt-6 rounded-xl border border-border bg-surface p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-lg text-cream">{agendamento.clienteNome}</p>
              <p className="text-sm text-muted">com {agendamento.barbeiroNome}</p>
            </div>
            <Badge tone={statusToTone(agendamento.status)}>{agendamento.status}</Badge>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-muted">Data</p>
              <p className="mt-1 text-cream">{formatDatePtBR(agendamento.dataInicio)}</p>
            </div>
            <div>
              <p className="text-muted">Horário</p>
              <p className="mt-1 text-cream">{formatTime(agendamento.dataInicio.slice(11, 19))}</p>
            </div>
            <div>
              <p className="text-muted">Serviços</p>
              <p className="mt-1 text-cream">{agendamento.servicos?.map((s) => s.nomeServico).join(", ")}</p>
            </div>
            <div>
              <p className="text-muted">Valor total</p>
              <p className="mt-1 text-gold">{formatBRL(agendamento.valorTotal)}</p>
            </div>
          </div>

          {agendamento.status !== "CANCELADO" && (
            <Button variant="danger" className="mt-6" onClick={handleCancelar} loading={loading}>
              <XCircle className="h-4 w-4" /> Cancelar agendamento
            </Button>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
