import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9.5L12 3l9 6.5v11a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-11z" />
      </svg>
    ),
  },
  {
    to: "/nivel-1",
    label: "Nivel 1",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h18" />
        <path d="M3 6h18" />
        <path d="M3 18h18" />
      </svg>
    ),
  },
  {
    to: "/alertas",
    label: "Alertas",
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside
        className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-3 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded bg-slate-100 text-slate-700 font-bold">
              SC
            </span>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight">SCADA Balanza</h1>
                <p className="text-xs text-slate-500">Sistema de Supervisión</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <path d="M15 18l-6-6 6-6" />
              )}
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-1 py-4 space-y-1">
          {navigation.map((item) => (
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
          className={`px-3 py-3 border-t border-slate-200 text-xs text-slate-500 transition-opacity duration-200 ${
            collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="mb-1">
            Estado: <span className="font-semibold text-emerald-600">ONLINE</span>
          </div>
          <div>
            Última actualización: <span className="font-semibold">ahora</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 bg-slate-50">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
