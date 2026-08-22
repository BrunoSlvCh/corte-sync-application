import { LogOut } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { userEmail, logout } = useAuth();

  const initial = (userEmail?.[0] ?? '?').toUpperCase();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 py-1 pl-1 pr-3 sm:flex dark:border-slate-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {initial}
            </span>
            <span className="max-w-[160px] truncate text-sm text-slate-700 dark:text-slate-200">
              {userEmail ?? 'Usuário'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            title="Sair"
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
