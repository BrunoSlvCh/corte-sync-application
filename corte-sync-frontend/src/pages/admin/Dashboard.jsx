import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, ListChecks, CalendarClock, Users, UserPlus, PlusCircle, Eye } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Badge, { statusToTone } from "../../components/ui/Badge";
import { listarBarbeiros } from "../../api/barbeiros";
import { listarServicos } from "../../api/servicos";
import { listarTodosAgendamentos } from "../../api/agendamentos";
import fachada from "../../assets/dashboard-fachada.svg";
import { formatDatePtBR, formatTime, todayISODate } from "../../utils/format";

export default function Dashboard() {
  const [totalBarbeiros, setTotalBarbeiros] = useState(null);
  const [totalServicos, setTotalServicos] = useState(null);
  const [agendamentos, setAgendamentos] = useState(null);

  useEffect(() => {
    listarBarbeiros().then((data) => setTotalBarbeiros(data.length)).catch(() => setTotalBarbeiros(0));
    listarServicos().then((data) => setTotalServicos(data.length)).catch(() => setTotalServicos(0));
    listarTodosAgendamentos().then(setAgendamentos).catch(() => setAgendamentos([]));
  }, []);

  const hoje = todayISODate();
  const agendamentosHoje = agendamentos?.filter((a) => a.dataInicio?.startsWith(hoje)) ?? [];
  const clientesUnicos = agendamentos ? new Set(agendamentos.map((a) => a.clienteId ?? a.clienteNome)).size : null;

  const recentes = agendamentos
    ? [...agendamentos]
        .sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio))
        .slice(0, 5)
    : [];

  return (
    <AdminLayout>
      <div className="relative flex min-h-[9rem] items-center overflow-hidden rounded-xl border border-border sm:min-h-[11rem]">
        <img src={fachada} alt="" className="absolute inset-0 h-full w-full object-cover object-[74%_center]" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(11,14,20,0.88) 0%, rgba(11,14,20,0.6) 26%, rgba(11,14,20,0) 55%)" }}
        />
        <div className="absolute inset-0 bg-ink/60 sm:hidden" />
        <div className="relative px-4 py-6 sm:px-6 sm:py-8">
          <h1 className="font-display text-2xl font-semibold text-cream">Olá, Admin!</h1>
          <p className="mt-1 text-sm text-muted">Aqui está um resumo da sua barbearia.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Scissors} label="Barbeiros" value={totalBarbeiros} />
        <StatCard icon={ListChecks} label="Serviços" value={totalServicos} />
        <StatCard icon={CalendarClock} label="Agendamentos hoje" value={agendamentos ? agendamentosHoje.length : null} />
        <StatCard icon={Users} label="Clientes" value={clientesUnicos} hint="Clientes distintos com agendamento registrado" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-cream">Agendamentos recentes</h2>
            <Link to="/admin/agendamentos" className="text-sm text-gold hover:underline">
              Ver todos
            </Link>
          </div>

          {agendamentos === null && <p className="text-sm text-muted">Carregando...</p>}
          {agendamentos !== null && recentes.length === 0 && (
            <p className="text-sm text-muted">Nenhum agendamento registrado ainda.</p>
          )}

          <div className="space-y-3">
            {recentes.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">{a.clienteNome}</p>
                  <p className="text-xs text-muted">
                    {formatDatePtBR(a.dataInicio)} · {formatTime(a.dataInicio.slice(11, 19))} · {a.barbeiroNome}
                  </p>
                </div>
                <Badge tone={statusToTone(a.status)}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-display text-base font-semibold text-cream">Ações rápidas</h2>
          <div className="space-y-3">
            <QuickAction to="/admin/barbeiros" icon={UserPlus} label="Cadastrar barbeiro" />
            <QuickAction to="/admin/servicos" icon={PlusCircle} label="Adicionar serviço" />
            <QuickAction to="/admin/agendamentos" icon={Eye} label="Ver agendamentos" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5" title={hint}>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span className="text-sm text-muted">{label}</span>
      </div>
      <p className="mt-3 font-display text-3xl text-cream">{value ?? "..."}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm text-cream/80 transition-colors hover:border-gold hover:text-gold"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
