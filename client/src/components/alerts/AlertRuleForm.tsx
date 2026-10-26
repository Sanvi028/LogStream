import { useState, type FormEvent } from "react";
import type { AlertRule } from "../../types/alert";
import type { LogLevel } from "../../types/log";

const LEVELS: LogLevel[] = ["ERROR", "WARN", "INFO", "DEBUG"];

interface AlertRuleFormProps {
  onSubmit: (rule: Omit<AlertRule, "id" | "isActive">) => void;
  onCancel: () => void;
}

export default function AlertRuleForm({ onSubmit, onCancel }: AlertRuleFormProps) {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [level, setLevel] = useState<LogLevel>("ERROR");
  const [threshold, setThreshold] = useState(50);
  const [windowSeconds, setWindowSeconds] = useState(60);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      service: service || null,
      level,
      threshold,
      windowSeconds,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-900 bg-slate-900/40 p-4"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Rule name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. High error rate - payments"
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Service</label>
          <input
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="All services"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as LogLevel)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Threshold (count)</label>
          <input
            type="number"
            min={1}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Window (seconds)</label>
          <input
            type="number"
            min={10}
            value={windowSeconds}
            onChange={(e) => setWindowSeconds(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Fires when {level} logs{service ? ` from "${service}"` : " from any service"} exceed{" "}
        {threshold} within {windowSeconds}s.
      </p>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-800 px-3.5 py-2 text-sm text-slate-300 hover:bg-slate-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Create rule
        </button>
      </div>
    </form>
  );
}