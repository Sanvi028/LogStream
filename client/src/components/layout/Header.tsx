import { useAuth } from "../../context/AuthContext";

// `connected` will be driven by the real useSocket() hook once the
// backend is integrated. For now it's honestly shown as "Mock data"
// rather than faking a green "live" status.
export default function Header({ connected = false }: { connected?: boolean }) {
  const { logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-900 bg-slate-950 px-6">
      <div className="flex items-center gap-2 text-sm">
        <span
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-emerald-500" : "bg-slate-600"
          }`}
        />
        <span className="text-slate-400">
          {connected ? "Live" : "Mock data"}
        </span>
      </div>

      <button
        onClick={logout}
        className="rounded-lg border border-slate-800 px-3.5 py-1.5 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-900"
      >
        Log out
      </button>
    </header>
  );
}