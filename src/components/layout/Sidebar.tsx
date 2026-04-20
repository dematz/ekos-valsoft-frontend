import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, Boxes, Bell, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventario', icon: Boxes },
  { to: '/notifications', label: 'Notificaciones', icon: Bell },
] as const;

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.4} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">Inventario</p>
          <p className="text-[11px] font-medium text-muted-foreground">Inteligente · v1</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navegación
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] transition-colors",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                    )}
                    strokeWidth={2}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary">
            MR
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-sm font-medium">María R.</p>
            <p className="text-[11px] text-muted-foreground">Operaciones</p>
          </div>
          <button
            onClick={logout}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
