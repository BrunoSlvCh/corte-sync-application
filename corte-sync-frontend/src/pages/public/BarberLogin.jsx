import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Scissors } from "lucide-react";
import Logo from "../../components/layout/Logo";
import AuthHero from "../../components/layout/AuthHero";
import MobileAuthBackground from "../../components/layout/MobileAuthBackground";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { IMAGES } from "../../utils/images";

export default function BarberLogin() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identifier, senha, "barbeiro");
      toast.success("Login realizado com sucesso!");
      const redirectTo = location.state?.from?.pathname || "/barbeiro";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen">
      <MobileAuthBackground image={IMAGES.authBarbeiro} />

      <AuthHero
        eyebrow="Área do profissional"
        title={
          <>
            Sua técnica,
            <br />
            sua marca.
          </>
        }
        subtitle="Entre com sua conta de barbeiro para gerenciar seus atendimentos do dia."
        image={IMAGES.authBarbeiro}
      />

      <div className="relative z-10 flex w-full flex-col justify-center bg-transparent px-6 py-12 sm:px-12 lg:w-1/2 lg:bg-ink lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/inicio" className="mb-10 inline-block">
            <Logo />
          </Link>

          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold">
              <Scissors className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs uppercase tracking-wide text-gold">Login do barbeiro</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-cream">Entrar</h2>
          <p className="mt-1 text-sm text-muted">Acesse sua agenda de atendimentos</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="E-mail ou telefone"
              icon={Mail}
              type="text"
              autoComplete="username"
              placeholder="seu@email.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <Input
              label="Senha"
              icon={Lock}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            {error && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            É cliente?{" "}
            <Link to="/login" className="text-gold hover:underline">
              Entrar como cliente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
