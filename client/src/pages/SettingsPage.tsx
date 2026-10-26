import Layout from "../components/layout/Layout";

// Mock users - will be replaced with a real GET /api/v1/users call
const mockUsers = [
  { id: "u1", email: "admin@logstream.dev", role: "admin" },
  { id: "u2", email: "viewer@logstream.dev", role: "viewer" },
];

export default function SettingsPage() {
  return (
    <Layout>
      <h1 className="text-xl font-semibold text-white">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage team access. Admin only.</p>

      <div className="mt-6 divide-y divide-slate-900 rounded-xl border border-slate-900">
        {mockUsers.map((u) => (
          <div key={u.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-slate-200">{u.email}</span>
            <span className="flex items-center gap-2">
              <span className="rounded-md border border-slate-700 px-2 py-0.5 text-xs capitalize text-slate-400">
                {u.role}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Layout>
  );
}