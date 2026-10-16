import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import Logo from "../../components/layout/Logo";
import AuthHero from "../../components/layout/AuthHero";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: "", email: "", telefone: "", senha: "", confirmar: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.senha !== form.confirmar) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await register({
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        senha: form.senha,
      });
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <AuthHero
        eyebrow="Mais que um corte,"
        title={<>é sobre você.</>}
        subtitle="Agende seu horário e mantenha seu estilo em dia."
      />

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-10 inline-block">
            <Logo />
          </Link>

          <h2 className="font-display text-2xl font-semibold text-cream">Criar conta</h2>
          <p className="mt-1 text-sm text-muted">Preencha os dados abaixo para se cadastrar.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Nome completo"
              icon={User}
              placeholder="Seu nome"
              value={form.nome}
              onChange={set("nome")}
              required
            />
            <Input
              label="E-mail"
              icon={Mail}
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={set("email")}
              required
            />
            <Input
              label="Telefone"
              icon={Phone}
              type="tel"
              placeholder="(11) 98765-4321"
              value={form.telefone}
              onChange={set("telefone")}
              required
            />
            <Input
              label="Senha"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={set("senha")}
              required
            />
            <Input
              label="Confirmar senha"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={form.confirmar}
              onChange={set("confirmar")}
              required
            />

            {error && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Criar conta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-gold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
