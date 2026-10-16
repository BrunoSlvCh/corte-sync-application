import { Link, NavLink, useNavigate } from "react-router-dom";
import { CircleUserRound, LogOut } from "lucide-react";
import Logo from "./Logo";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const linkClass = ({ isActive }) =>
  `text-sm transition-colors hover:text-gold ${isActive ? "text-gold" : "text-cream/80"}`;

export default function PublicNavbar() {
  const { isAuthenticated, auth, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={linkClass}>Início</NavLink>
          <NavLink to="/servicos" className={linkClass}>Serviços</NavLink>
          <NavLink to="/agendamento" className={linkClass}>Agendamento</NavLink>
          {!isAuthenticated && <NavLink to="/login" className={linkClass}>Entrar</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {auth.isAdmin && (
                <Button as={Link} to="/admin" variant="subtle" className="hidden sm:inline-flex">
                  Painel admin
                </Button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-cream/80 transition-colors hover:border-gold hover:text-gold"
                title="Sair"
              >
                <CircleUserRound className="h-4 w-4" />
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Button as={Link} to="/criar-conta" variant="primary">
              Criar conta
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
