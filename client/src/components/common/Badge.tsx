import type { LogLevel } from "../../types/log";

const styles: Record<LogLevel, string> = {
  ERROR: "bg-red-500/10 text-red-400 border-red-500/20",
  WARN: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  INFO: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DEBUG: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function Badge({ level }: { level: LogLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles[level]}`}
    >
      {level}
    </span>
  );
}