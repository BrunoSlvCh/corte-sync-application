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

export default function Login() {
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
      const auth = await login(identifier, senha);
      toast.success("Login realizado com sucesso!");
      const redirectTo = location.state?.from?.pathname || (auth.isAdmin ? "/admin" : "/inicio");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen">
      <MobileAuthBackground image={IMAGES.auth} />

      <AuthHero
        eyebrow="Bem-vindo de volta!"
        title={
          <>
            Sua cadeira te
            <br />
            espera.
          </>
        }
        subtitle="Faça login para gerenciar seus agendamentos e manter seu estilo em dia."
        image={IMAGES.auth}
      />

      <div className="relative z-10 flex w-full flex-col justify-center bg-transparent px-6 py-12 sm:px-12 lg:w-1/2 lg:bg-ink lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/inicio" className="mb-10 inline-block">
            <Logo />
          </Link>

          <h2 className="font-display text-2xl font-semibold text-cream">Login</h2>
          <p className="mt-1 text-sm text-muted">Acesse sua conta</p>

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
            Não tem uma conta?{" "}
            <Link to="/criar-conta" className="text-gold hover:underline">
              Criar conta
            </Link>
          </p>

          <div className="mt-4 border-t border-border/60 pt-4 text-center">
            <Link
              to="/login-barbeiro"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold"
            >
              <Scissors className="h-3.5 w-3.5" />
              Sou barbeiro — entrar como profissional
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
