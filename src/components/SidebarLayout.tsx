import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "scada-sidebar-collapsed";

type SidebarMode = "design" | "execution";

type NavigationItem = {
  to: string;
  label: string;
  mode: SidebarMode;
  icon: ReactNode;
};

const navigation: NavigationItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9.5L12 3l9 6.5v11a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-11z" />
      </svg>
    ),
  },
  {
    to: "/nivel-1",
    label: "Nivel 1",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h18" />
        <path d="M3 6h18" />
        <path d="M3 18h18" />
      </svg>
    ),
  },
  {
    to: "/balanza",
    label: "Balanza",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 7h12" />
        <path d="M5 7l1 14h12l1-14" />
        <path d="M9 7v-3h6v3" />
        <path d="M8 14h8" />
      </svg>
    ),
  },
  {
    to: "/ups",
    label: "UPS",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 3h14v18H5z" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
      </svg>
    ),
  },
  {
    to: "/switch",
    label: "Switch",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16v4H4z" />
        <path d="M4 14h16v4H4z" />
        <path d="M7 10v4" />
        <path d="M17 10v4" />
      </svg>
    ),
  },
  {
    to: "/sensores-ir",
    label: "Sensores IR",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h18" />
        <path d="M9 5v14" />
        <path d="M15 5v14" />
        <path d="M12 5v14" />
      </svg>
    ),
  },
  {
    to: "/camara-lpr",
    label: "Camara LPR",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 7h14v11H5z" />
        <path d="M9 12h6" />
        <path d="M12 10v4" />
      </svg>
    ),
  },
  {
    to: "/cartel-led",
    label: "Cartel LED",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="6" width="18" height="10" rx="2" />
        <path d="M7 10h.01" />
        <path d="M11 10h6" />
        <path d="M8 16v3" />
        <path d="M16 16v3" />
      </svg>
    ),
  },
  {
    to: "/alertas",
    label: "Alertas",
    mode: "design",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
        <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2v1h16v-1l-2-2z" />
      </svg>
    ),
  },
  {
    to: "/diagrama-editar",
    label: "Diagrama",
    mode: "execution",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h7v7H4z" />
        <path d="M13 13h7v7h-7z" />
        <path d="M13 4h7v7h-7z" />
        <path d="M4 13h7v7H4z" />
      </svg>
    ),
  },
  {
    to: "/almacenes",
    label: "Almacenes",
    mode: "execution",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7v13h16V7L12 2 4 7z" />
        <path d="M12 2v5" />
        <path d="M7 10h10" />
      </svg>
    ),
  },
];

const SidebarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const currentMode = useMemo<SidebarMode>(() => {
    return location.pathname === "/almacenes" || location.pathname === "/diagrama-editar"
      ? "execution"
      : "design";
  }, [location.pathname]);

  const visibleNavigation = useMemo(
    () => navigation.filter((item) => item.mode === currentMode),
    [currentMode],
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside
        className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-slate-100 font-bold text-slate-700">
              SC
            </span>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight">SCADA Balanza</h1>
                <p className="text-xs text-slate-500">Sistema de Supervision</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label={collapsed ? "Expandir menu" : "Contraer menu"}
            title={collapsed ? "Expandir menu" : "Contraer menu"}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
            </svg>
          </button>
        </div>

        {!collapsed && (
          <div className="border-b border-slate-200 px-2 py-2">
            <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                currentMode === "design"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Diseño
            </button>
            <button
              type="button"
              onClick={() => navigate("/almacenes")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                currentMode === "execution"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Ejecución
            </button>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 px-1 py-4">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <span className="flex shrink-0 items-center justify-center text-slate-500 group-hover:text-slate-900">
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div
          className={`border-t border-slate-200 px-3 py-3 text-xs text-slate-500 transition-opacity duration-200 ${
            collapsed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="mb-1">
            Vista: <span className="font-semibold text-slate-900">{currentMode === "design" ? "Diseño" : "Ejecución"}</span>
          </div>
          <div>
            Estado: <span className="font-semibold text-emerald-600">ONLINE</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-h-0 overflow-hidden bg-slate-50">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
