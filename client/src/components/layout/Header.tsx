
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-end border-b border-slate-900 bg-slate-950 px-6">
      <button
        onClick={logout}
        className="rounded-lg border border-slate-800 px-3.5 py-1.5 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-900"
      >
        Log out
      </button>
    </header>
  );
}
