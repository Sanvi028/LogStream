import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import FilterBar from "../components/logs/FilterBar";
import LogTable from "../components/logs/LogTable";
import LogDetailModal from "../components/logs/LogDetailModal";
import api from "../lib/api";
import type { LogEntry, LogFilters } from "../types/log";

const PAGE_SIZE = 10;

export default function LogsPage() {
  const [filters, setFilters] = useState<LogFilters>({
    search: "",
    service: "",
    level: "",
    page: 1,
  });

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError("");

        const params: Record<string, string> = {};

        if (filters.search.trim()) {
          params.query = filters.search.trim();
        }

        if (filters.service) {
          params.service = filters.service;
        }

        if (filters.level) {
          params.level = filters.level;
        }

        const response = await api.get("/logs/search", { params });

        if (!cancelled) {
          setLogs(response.data.logs ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);

        if (!cancelled) {
          setError("Could not load logs. Please try again.");
          setLogs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      cancelled = true;
    };
  }, [filters.search, filters.service, filters.level]);

  const page = filters.page || 1;
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageLogs = logs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const updateFilters = (nextFilters: LogFilters) => {
    setFilters({
      ...nextFilters,
      page: 1,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      service: "",
      level: "",
      page: 1,
    });
  };

  return (
    <Layout>
      <h1 className="text-xl font-semibold text-white">Logs</h1>

      <p className="mt-1 text-sm text-slate-500">
        Search and filter across every service.
      </p>

      <div className="mt-6">
        <FilterBar filters={filters} onChange={updateFilters} />
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Loading logs...
          </p>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={() => setFilters({ ...filters })}
              className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900"
            >
              Retry
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">No logs found.</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <LogTable
            logs={pageLogs}
            onSelect={setSelectedLog}
            page={safePage}
            totalPages={totalPages}
            onPageChange={(nextPage) =>
              setFilters((current) => ({
                ...current,
                page: nextPage,
              }))
            }
            onClearFilters={clearFilters}
          />
        )}
      </div>

      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </Layout>
  );
}
