import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, ArrowRight } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Button from "../../components/ui/Button";
import { listarServicos } from "../../api/servicos";
import { formatBRL } from "../../utils/format";

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listarServicos()
      .then(setServicos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const ativos = servicos.filter((s) => s.status);

  return (
    <div className="min-h-screen bg-ink">
      <PublicNavbar />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-cream">Nossos serviços</h1>
        <p className="mt-2 text-sm text-muted">Escolha o serviço ideal e agende seu horário.</p>

        {loading && <p className="mt-10 text-sm text-muted">Carregando serviços...</p>}
        {error && (
          <p className="mt-10 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ativos.map((s) => (
              <div
                key={s.nomeServico}
                className="flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-gold/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Scissors className="h-4.5 w-4.5" />
                </span>
                <p className="mt-4 font-display text-lg text-cream">{s.nomeServico}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">{s.categoria}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted">{s.duracaoServico} min</span>
                  <span className="font-display text-lg text-gold">{formatBRL(s.precoServico)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Button as={Link} to="/agendamento" variant="primary">
            Agendar horário <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
