import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, User, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Stepper from "../../components/booking/Stepper";
import BookingSummary from "../../components/booking/BookingSummary";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { listarBarbeiros } from "../../api/barbeiros";
import { listarServicos } from "../../api/servicos";
import { buscarHorariosDisponiveis, criarAgendamento } from "../../api/agendamentos";
import { formatBRL, formatTime, combineDateTime, todayISODate } from "../../utils/format";
import { IMAGES } from "../../utils/images";

export default function Agendamento() {
  const { auth, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [data, setData] = useState(todayISODate());
  const [hora, setHora] = useState("");

  const [loadingBarbeiros, setLoadingBarbeiros] = useState(true);
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [concluido, setConcluido] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/agendamento" } } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    listarBarbeiros()
      .then((lista) => setBarbeiros(lista.filter((b) => b.status !== false)))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingBarbeiros(false));

    listarServicos()
      .then((data) => setServicos(data.filter((s) => s.status)))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingServicos(false));
  }, []);

  const duracaoTotal = servicosSelecionados.reduce((sum, s) => sum + (s.duracaoServico || 0), 0);

  useEffect(() => {
    if (step === 3 && barbeiroSelecionado && data) {
      setLoadingHorarios(true);
      setHora("");
      buscarHorariosDisponiveis(barbeiroSelecionado.id, data, duracaoTotal || undefined)
        .then((res) => setHorarios(res.horariosDisponiveis || []))
        .catch((err) => setError(err.message))
        .finally(() => setLoadingHorarios(false));
    }
  }, [step, barbeiroSelecionado, data]);

  function toggleServico(servico) {
    setServicosSelecionados((prev) =>
      prev.some((s) => s.nomeServico === servico.nomeServico)
        ? prev.filter((s) => s.nomeServico !== servico.nomeServico)
        : [...prev, servico]
    );
  }

  async function handleConfirmar() {
    setSubmitting(true);
    setError("");
    try {
      const result = await criarAgendamento({
        dataInicio: combineDateTime(data, hora),
        clienteId: auth.id,
        barbeiroId: barbeiroSelecionado.id,
        servicosIds: servicosSelecionados.map((s) => s.id),
      });
      setConcluido(result);
      toast.success("Agendamento confirmado!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (concluido) {
    return (
      <div className="min-h-screen bg-ink">
        <PublicNavbar />
        <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-semibold text-cream">
            Agendamento confirmado!
          </h1>
          <p className="mt-2 text-sm text-muted">
            Seu horário com {concluido.barbeiroNome} está marcado. Nos vemos em breve.
          </p>
          <Button className="mt-8" onClick={() => navigate("/inicio")}>
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <PublicNavbar />

      <section className="relative overflow-hidden border-b border-border/60">
        <img src={IMAGES.agendamento} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(11,14,20,0.6) 0%, rgba(11,14,20,0.93) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <h1 className="font-display text-2xl font-semibold text-cream">Agende seu horário</h1>
          <p className="mt-1 text-sm text-muted">
            Escolha o barbeiro, o serviço e o melhor horário para você.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="pb-2">
          <Stepper current={step} />
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface p-4 sm:p-6">
            {step === 1 && (
              <StepBarbeiro
                barbeiros={barbeiros}
                loading={loadingBarbeiros}
                selecionado={barbeiroSelecionado}
                onSelecionar={setBarbeiroSelecionado}
              />
            )}
            {step === 2 && (
              <StepServico
                servicos={servicos}
                loading={loadingServicos}
                selecionados={servicosSelecionados}
                onToggle={toggleServico}
              />
            )}
            {step === 3 && (
              <StepDataHora
                data={data}
                onData={setData}
                hora={hora}
                onHora={setHora}
                horarios={horarios}
                loading={loadingHorarios}
              />
            )}
            {step === 4 && (
              <StepConfirmar
                barbeiro={barbeiroSelecionado}
                servicos={servicosSelecionados}
                data={data}
                hora={hora}
              />
            )}

            <div className="mt-8 flex justify-between border-t border-border pt-6">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
              >
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>

              {step < 4 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={
                    (step === 1 && !barbeiroSelecionado) ||
                    (step === 2 && servicosSelecionados.length === 0) ||
                    (step === 3 && !hora)
                  }
                >
                  Próximo <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleConfirmar} loading={submitting}>
                  Confirmar agendamento
                </Button>
              )}
            </div>
          </div>

          <BookingSummary
            barbeiro={barbeiroSelecionado}
            servicos={servicosSelecionados}
            data={step >= 3 ? data : null}
            hora={step >= 3 ? hora : null}
          />
        </div>
      </section>
    </div>
  );
}

function StepBarbeiro({ barbeiros, loading, selecionado, onSelecionar }) {
  if (loading) return <p className="text-sm text-muted">Carregando barbeiros...</p>;

  return (
    <div>
      <h2 className="mb-4 font-display text-base font-semibold text-cream">Escolha o barbeiro</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {barbeiros.map((b) => {
          const active = selecionado?.id === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelecionar(b)}
              className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                active ? "border-gold bg-gold/5" : "border-border bg-surface-2 hover:border-gold/40"
              }`}
            >
              <BarberAvatar urlFoto={b.urlFoto} size="h-12 w-12" iconSize="h-5 w-5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-cream">{b.nome}</p>
                <p className="mt-0.5 truncate text-xs text-muted">{b.descricao}</p>
              </div>
              {active && <Check className="h-5 w-5 shrink-0 text-gold" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepServico({ servicos, loading, selecionados, onToggle }) {
  if (loading) return <p className="text-sm text-muted">Carregando serviços...</p>;

  return (
    <div>
      <h2 className="mb-1 font-display text-base font-semibold text-cream">Escolha o serviço</h2>
      <p className="mb-4 text-xs text-muted">Você pode selecionar mais de um serviço.</p>
      <div className="space-y-3">
        {servicos.map((s) => {
          const active = selecionados.some((sel) => sel.nomeServico === s.nomeServico);
          return (
            <button
              key={s.nomeServico}
              type="button"
              onClick={() => onToggle(s)}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                active ? "border-gold bg-gold/5" : "border-border bg-surface-2 hover:border-gold/40"
              }`}
            >
              <div>
                <p className="font-medium text-cream">{s.nomeServico}</p>
                <p className="mt-0.5 text-xs text-muted">{s.duracaoServico} min</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-gold">{formatBRL(s.precoServico)}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    active ? "border-gold bg-gold text-ink" : "border-border"
                  }`}
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDataHora({ data, onData, hora, onHora, horarios, loading }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-base font-semibold text-cream">Escolha data e horário</h2>

      <label className="block max-w-xs">
        <span className="mb-1.5 flex items-center gap-2 text-sm text-muted">
          <CalendarDays className="h-4 w-4" /> Data
        </span>
        <input
          type="date"
          value={data}
          min={todayISODate()}
          onChange={(e) => onData(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-cream outline-none focus:border-gold [color-scheme:dark]"
        />
      </label>

      <div className="mt-6">
        <span className="mb-3 block text-sm text-muted">Horários disponíveis</span>
        {loading && <p className="text-sm text-muted">Buscando horários...</p>}
        {!loading && horarios.length === 0 && (
          <p className="text-sm text-muted">Nenhum horário disponível nesta data.</p>
        )}
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {horarios.map((h) => {
            const label = formatTime(h);
            const active = hora === label;
            return (
              <button
                key={h}
                type="button"
                onClick={() => onHora(label)}
                className={`rounded-lg border py-2 text-sm transition-colors ${
                  active
                    ? "border-gold bg-gold text-ink font-semibold"
                    : "border-border bg-surface-2 text-cream/80 hover:border-gold/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepConfirmar({ barbeiro, servicos, data, hora }) {
  const total = servicos.reduce((sum, s) => sum + parseFloat(s.precoServico || 0), 0);

  return (
    <div>
      <h2 className="mb-4 font-display text-base font-semibold text-cream">Confirme seu agendamento</h2>
      <div className="space-y-4 text-sm">
        <Row label="Barbeiro" value={barbeiro?.nome} />
        <Row
          label="Serviços"
          value={servicos.map((s) => s.nomeServico).join(", ")}
        />
        <Row label="Data" value={data} />
        <Row label="Horário" value={hora} />
        <Row label="Valor total" value={formatBRL(total)} highlight />
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <span className="text-muted">{label}</span>
      <span className={highlight ? "font-display text-lg text-gold" : "text-cream"}>{value}</span>
    </div>
  );
}

function BarberAvatar({ urlFoto, size = "h-10 w-10", iconSize = "h-4.5 w-4.5" }) {
  const [failed, setFailed] = useState(false);

  if (urlFoto && !failed) {
    return (
      <img
        src={urlFoto}
        alt=""
        onError={() => setFailed(true)}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-surface-3 text-gold`}>
      <User className={iconSize} />
    </span>
  );
}
