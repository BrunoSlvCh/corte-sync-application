import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { ScissorsSquare, Users, Clock, ArrowRight } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { listarServicos } from "../../api/servicos";
import { formatBRL } from "../../utils/format";
import { IMAGES } from "../../utils/images";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [servicos, setServicos] = useState([]);
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    listarServicos()
      .then((data) => setServicos(data.slice(0, 4)))
      .catch(() => {});
  }, []);

  useLayoutEffect(() => {
    function measure() {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <div ref={navRef}>
        <PublicNavbar />
      </div>

      {/* Hero */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: navHeight ? `calc(100vh - ${navHeight}px)` : "100vh" }}
      >
        <img
          src={IMAGES.home}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_15%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(11,14,20,0.97) 0%, rgba(11,14,20,0.85) 45%, rgba(11,14,20,0.55) 100%), radial-gradient(circle at 85% 15%, rgba(212,169,74,0.14), transparent 45%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:py-16">
          <span className="text-sm text-gold">Barbearia de bairro, padrão internacional</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-cream lg:text-5xl">
            Mais que um corte, é sobre você.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Agende seu horário e mantenha seu estilo em dia com profissionais que entendem
            exatamente o que você precisa.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button as={Link} to="/agendamento" variant="primary">
              Agendar horário <ArrowRight className="h-4 w-4" />
            </Button>
            {!isAuthenticated && (
              <Button as={Link} to="/criar-conta" variant="ghost">
                Criar conta
              </Button>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-10 border-t border-border/60 pt-6">
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
              <Link
                key={s.nomeServico}
                to="/agendamento"
                className="rounded-xl border border-border bg-surface p-5 text-left transition-colors hover:border-gold/40 hover:bg-surface-2"
              >
                <p className="font-medium text-cream">{s.nomeServico}</p>
                <p className="mt-1 text-xs text-muted">{s.duracaoServico} min</p>
                <p className="mt-4 font-display text-lg text-gold">{formatBRL(s.precoServico)}</p>
              </Link>
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
