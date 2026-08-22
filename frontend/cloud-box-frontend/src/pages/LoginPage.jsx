import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, Mail, Lock, Eye, EyeOff, Cloud, User } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { isAuthenticated, loading, login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (tab === 'login') {
      await login(email, senha);
    } else {
      const ok = await register(nome, email, senha);
      if (ok) {
        setTab('login');
        setSenha('');
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Painel de marca — some em telas pequenas */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-blue-600 p-10 text-white lg:flex dark:bg-blue-500/90">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10" />

        <Logo className="[&_span:last-child]:text-white" />

        <div className="relative">
          <Cloud size={40} className="mb-6 opacity-90" strokeWidth={1.5} />
          <h1 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight">
            Seus arquivos, sempre à mão.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-blue-100">
            Envie, organize e acesse seus arquivos com segurança, de qualquer lugar.
          </p>
        </div>

        <p className="relative text-xs text-blue-100/80">© {new Date().getFullYear()} Cloud Box</p>
      </div>

      {/* Painel do formulário */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between p-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              {tab === 'login' ? 'Entrar na sua conta' : 'Criar uma conta'}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {tab === 'login'
                ? 'Informe suas credenciais para acessar seus arquivos.'
                : 'Leva menos de um minuto para começar.'}
            </p>

            {/* Abas */}
            <div className="mt-6 flex gap-1.5 rounded-lg border border-slate-200 p-1.5 dark:border-slate-700">
              {[
                { id: 'login', label: 'Entrar' },
                { id: 'register', label: 'Cadastrar' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Nome
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {tab === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
