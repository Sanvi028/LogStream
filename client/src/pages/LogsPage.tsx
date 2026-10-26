import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import FilterBar from "../components/logs/FilterBar";
import LogTable from "../components/logs/LogTable";
import LogDetailModal from "../components/logs/LogDetailModal";
import { mockLogs } from "../lib/mock/mockLogs";
import type { LogEntry, LogFilters } from "../types/log";

const PAGE_SIZE = 10;

export default function LogsPage() {
  const [filters, setFilters] = useState<LogFilters>({ search: "", service: "", level: "", page: 1 });
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const filtered = useMemo(() => {
    return mockLogs.filter((log) => {
      if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.service && log.service !== filters.service) return false;
      if (filters.level && log.level !== filters.level) return false;
      return true;
    });
  }, [filters]);

  const page = filters.page || 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageLogs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout>
      <h1 className="text-xl font-semibold text-white">Logs</h1>
      <p className="mt-1 text-sm text-slate-500">Search and filter across every service.</p>

      <div className="mt-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-4">
        <LogTable
          logs={pageLogs}
          onSelect={setSelectedLog}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setFilters({ ...filters, page: p })}
          onClearFilters={() => setFilters({ search: "", service: "", level: "", page: 1 })}
        />
      </div>

      {selectedLog && (
        <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </Layout>
  );
}