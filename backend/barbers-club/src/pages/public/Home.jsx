import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScissorsSquare, Users, Clock, ArrowRight } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { listarServicos } from "../../api/servicos";
import { formatBRL } from "../../utils/format";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    listarServicos()
      .then((data) => setServicos(data.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, rgba(212,169,74,0.14), transparent 45%), linear-gradient(180deg, #12151F 0%, #0B0E14 80%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <span className="text-sm text-gold">Barbearia de bairro, padrão internacional</span>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] text-cream lg:text-6xl">
            Mais que um corte, é sobre você.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Agende seu horário e mantenha seu estilo em dia com profissionais que entendem
            exatamente o que você precisa.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button as={Link} to="/agendamento" variant="primary">
              Agendar horário <ArrowRight className="h-4 w-4" />
            </Button>
            {!isAuthenticated && (
              <Button as={Link} to="/criar-conta" variant="ghost">
                Criar conta
              </Button>
            )}
          </div>

          <div className="mt-16 flex flex-wrap gap-10 border-t border-border/60 pt-10">
            <Feature icon={Users} label="Profissionais qualificados" />
            <Feature icon={ScissorsSquare} label="Ambiente confortável" />
            <Feature icon={Clock} label="Atendimento personalizado" />
          </div>
        </div>
      </section>

      {/* Services teaser */}
      {servicos.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-cream">Serviços em destaque</h2>
              <p className="mt-1 text-sm text-muted">Escolha o que combina com seu estilo.</p>
            </div>
            <Link to="/servicos" className="text-sm text-gold hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicos.map((s) => (
              <div
                key={s.nomeServico}
                className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-gold/40"
              >
                <p className="font-medium text-cream">{s.nomeServico}</p>
                <p className="mt-1 text-xs text-muted">{s.duracaoServico} min</p>
                <p className="mt-4 font-display text-lg text-gold">{formatBRL(s.precoServico)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Feature({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-gold" />
      <span className="text-sm text-cream/80">{label}</span>
    </div>
  );
}
