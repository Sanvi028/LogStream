
import type { LogEntry } from "../../types/log";
import Badge from "../common/Badge";

export default function LogDetailModal({
  log,
  onClose,
}: {
  log: LogEntry;
  onClose: () => void;
}) {
  const logTimestamp = log.createdAt ?? log.timestamp;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge level={log.level} />
              <span className="text-sm text-slate-400">
                {log.service}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-200">
              {log.message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          {logTimestamp
            ? new Date(logTimestamp).toLocaleString()
            : "Timestamp unavailable"}
        </div>

        {log.metadata && (
          <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-400">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
