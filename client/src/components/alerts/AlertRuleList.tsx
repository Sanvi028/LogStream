import type { AlertRule } from "../../types/alert";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";

interface AlertRuleListProps {
  rules: AlertRule[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AlertRuleList({ rules, onToggle, onDelete }: AlertRuleListProps) {
  if (rules.length === 0) {
    return <EmptyState title="No alert rules yet" description="Create one to get notified when error rates spike." />;
  }

  return (
    <div className="divide-y divide-slate-900 rounded-xl border border-slate-900">
      {rules.map((rule) => (
        <div key={rule.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-slate-200">{rule.name}</p>
              <Badge level={rule.level} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {rule.service || "All services"} · &gt;{rule.threshold} in {rule.windowSeconds}s
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => onToggle(rule.id)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                rule.isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {rule.isActive ? "Active" : "Inactive"}
            </button>
            <button
              onClick={() => onDelete(rule.id)}
              className="text-xs text-slate-500 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}