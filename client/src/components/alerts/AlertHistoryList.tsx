import type { AlertTrigger } from "../../types/alert";
import EmptyState from "../common/EmptyState";

export default function AlertHistoryList({ triggers }: { triggers: AlertTrigger[] }) {
  if (triggers.length === 0) {
    return <EmptyState title="No alerts triggered yet" description="Triggered alerts will show up here." />;
  }

  return (
    <div className="divide-y divide-slate-900 rounded-xl border border-slate-900">
      {triggers.map((t) => (
        <div key={t.id} className="flex items-center justify-between px-4 py-3 text-sm">
          <div>
            <p className="font-medium text-slate-200">{t.ruleName}</p>
            <p className="text-xs text-slate-500">{new Date(t.triggeredAt).toLocaleString()}</p>
          </div>
          <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
            {t.count} hits
          </span>
        </div>
      ))}
    </div>
  );
}