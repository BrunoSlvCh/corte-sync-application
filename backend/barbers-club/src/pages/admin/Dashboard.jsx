import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, ListChecks, CalendarClock, Users, UserPlus, PlusCircle, Eye } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import { listarBarbeiros } from "../../api/barbeiros";
import { listarServicos } from "../../api/servicos";

export default function Dashboard() {
  const [totalBarbeiros, setTotalBarbeiros] = useState(null);
  const [totalServicos, setTotalServicos] = useState(null);

  useEffect(() => {
    listarBarbeiros().then((data) => setTotalBarbeiros(data.length)).catch(() => setTotalBarbeiros(0));
    listarServicos().then((data) => setTotalServicos(data.length)).catch(() => setTotalServicos(0));
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-cream">Olá, Admin!</h1>
      <p className="mt-1 text-sm text-muted">Aqui está um resumo da sua barbearia.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Scissors} label="Barbeiros" value={totalBarbeiros} />
        <StatCard icon={ListChecks} label="Serviços" value={totalServicos} />
        <StatCard icon={CalendarClock} label="Agendamentos" value="—" hint="Sem endpoint de listagem na API" />
        <StatCard icon={Users} label="Clientes" value="—" hint="Sem endpoint de listagem na API" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-display text-base font-semibold text-cream">Agendamentos recentes</h2>
          <p className="mt-4 text-sm text-muted">
            A API atual não expõe um endpoint para listar todos os agendamentos, então esta seção
            não pode ser preenchida automaticamente. Para consultar um agendamento específico,
            use a busca por ID em{" "}
            <Link to="/admin/agendamentos" className="text-gold hover:underline">
              Agendamentos
            </Link>
            .
          </p>
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
