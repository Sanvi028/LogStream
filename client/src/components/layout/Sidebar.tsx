import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/logs", label: "Logs" },
  { to: "/alerts", label: "Alerts" },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-900 bg-slate-950 p-4 md:flex md:flex-col">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
            <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">LogStream</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-300"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-300"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`
            }
          >
            Settings
          </NavLink>
        )}
      </nav>

      <div className="rounded-lg border border-slate-900 bg-slate-900/50 px-3 py-2.5 text-xs text-slate-500">
        Signed in as
        <div className="mt-0.5 truncate text-sm font-medium text-slate-300">
          {user?.email}
        </div>
      </div>
    </aside>
  );
}