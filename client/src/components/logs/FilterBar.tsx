import { useEffect, useState } from "react";
import type { LogFilters, LogLevel } from "../../types/log";

const LEVELS: LogLevel[] = ["ERROR", "WARN", "INFO", "DEBUG"];
const SERVICES = ["payment-service", "login-service", "order-service", "inventory-service"];

interface FilterBarProps {
  filters: LogFilters;
  onChange: (filters: LogFilters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  // Debounce: wait 300ms after typing stops before firing the filter change
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ ...filters, search: searchInput, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-900 bg-slate-900/40 p-3">
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search messages…"
        className="min-w-[200px] flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />

      <select
        value={filters.service || ""}
        onChange={(e) => onChange({ ...filters, service: e.target.value, page: 1 })}
        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-indigo-500"
      >
        <option value="">All services</option>
        {SERVICES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.level || ""}
        onChange={(e) => onChange({ ...filters, level: e.target.value as LogLevel | "", page: 1 })}
        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-indigo-500"
      >
        <option value="">All levels</option>
        {LEVELS.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      {(filters.search || filters.service || filters.level) && (
        <button
          onClick={() => {
            setSearchInput("");
            onChange({ search: "", service: "", level: "", page: 1 });
          }}
          className="text-sm text-slate-500 hover:text-slate-300"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}