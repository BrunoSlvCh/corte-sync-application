import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Scissors,
  ListChecks,
  CalendarClock,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../../context/AuthContext";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/barbeiros", label: "Barbeiros", icon: Scissors },
  { to: "/admin/servicos", label: "Serviços", icon: ListChecks },
  { to: "/admin/agendamentos", label: "Agendamentos", icon: CalendarClock },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6">
        <div className="mb-8 px-2">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-gold text-ink font-semibold"
                    : "text-cream/80 hover:bg-surface-3 hover:text-cream"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/70 transition-colors hover:bg-surface-3 hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
