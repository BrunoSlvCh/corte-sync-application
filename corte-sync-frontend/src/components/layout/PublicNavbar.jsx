import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CircleUserRound, LogOut, Menu, X } from "lucide-react";
import Logo from "./Logo";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const linkClass = ({ isActive }) =>
  `text-sm transition-colors hover:text-gold ${isActive ? "text-gold" : "text-cream/80"}`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-sm transition-colors ${
    isActive ? "bg-gold/10 text-gold" : "text-cream/80 hover:bg-surface-3"
  }`;

export default function PublicNavbar() {
  const { isAuthenticated, auth, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Barbeiro vê a própria agenda (com troca de status); cliente vê o histórico dele.
  const meusAgendamentosPath = auth?.isBarbeiro ? "/barbeiro" : "/meus-agendamentos";

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/inicio");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/inicio" onClick={closeMenu}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/inicio" end className={linkClass}>Início</NavLink>
          <NavLink to="/servicos" className={linkClass}>Serviços</NavLink>
          <NavLink to="/agendamento" className={linkClass}>Agendamento</NavLink>
          {isAuthenticated && !auth.isAdmin && (
            <NavLink to={meusAgendamentosPath} className={linkClass}>Meus agendamentos</NavLink>
          )}
          {!isAuthenticated && <NavLink to="/login" className={linkClass}>Entrar</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                {auth.isAdmin && (
                  <Button as={Link} to="/admin" variant="subtle">
                    Painel admin
                  </Button>
                )}
                <Link
                  to="/perfil"
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-cream/80 transition-colors hover:border-gold hover:text-gold"
                  title="Meu perfil"
                >
                  <CircleUserRound className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-cream/80 transition-colors hover:border-gold hover:text-gold"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Button as={Link} to="/criar-conta" variant="primary">
                Criar conta
              </Button>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-cream/80 transition-colors hover:border-gold hover:text-gold md:hidden"
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border/70 bg-ink px-6 py-4 md:hidden">
          <nav className="space-y-1">
            <NavLink to="/inicio" end className={mobileLinkClass} onClick={closeMenu}>
              Início
            </NavLink>
            <NavLink to="/servicos" className={mobileLinkClass} onClick={closeMenu}>
              Serviços
            </NavLink>
            <NavLink to="/agendamento" className={mobileLinkClass} onClick={closeMenu}>
              Agendamento
            </NavLink>
            {isAuthenticated && !auth.isAdmin && (
              <NavLink to={meusAgendamentosPath} className={mobileLinkClass} onClick={closeMenu}>
                Meus agendamentos
              </NavLink>
            )}
            {!isAuthenticated && (
              <NavLink to="/login" className={mobileLinkClass} onClick={closeMenu}>
                Entrar
              </NavLink>
            )}
          </nav>

          <div className="mt-4 border-t border-border/60 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                {auth.isAdmin && (
                  <Button as={Link} to="/admin" variant="subtle" className="w-full" onClick={closeMenu}>
                    Painel admin
                  </Button>
                )}
                <Button as={Link} to="/perfil" variant="subtle" className="w-full" onClick={closeMenu}>
                  <CircleUserRound className="h-4 w-4" /> Meu perfil
                </Button>
                <Button variant="ghost" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Sair
                </Button>
              </div>
            ) : (
              <Button as={Link} to="/criar-conta" variant="primary" className="w-full" onClick={closeMenu}>
                Criar conta
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
