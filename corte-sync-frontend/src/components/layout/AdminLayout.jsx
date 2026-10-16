import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Scissors,
  ListChecks,
  CalendarClock,
  LogOut,
  Menu,
  X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/inicio");
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink lg:flex-row">
      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Logo />
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-cream/80 hover:border-gold hover:text-gold"
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={closeSidebar} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-surface px-4 py-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between px-2">
              <Logo />
              <button
                onClick={closeSidebar}
                className="rounded-full p-1 text-muted hover:bg-surface-3 hover:text-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeSidebar}
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
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
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

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
