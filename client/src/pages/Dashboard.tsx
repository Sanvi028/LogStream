import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import StatsCard from "../components/dashboard/StatsCard";
import LogsOverTimeChart from "../components/dashboard/LogsOverTimeCharts";
import LogTable from "../components/logs/LogTable";
import LogDetailModal from "../components/logs/LogDetailModal";
import api from "../lib/api";
import type { LogEntry, AnalyticsSummary } from "../types/log";

const emptyAnalytics: AnalyticsSummary = {
  totalLogs: 0,
  errors: 0,
  warnings: 0,
  info: 0,
  logsOverTime: [],
};

export default function DashboardPage() {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(emptyAnalytics);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [logsError, setLogsError] = useState("");
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingLogs(true);
        setLogsError("");

        const response = await api.get("/logs/search");
        setRecentLogs((response.data.logs ?? []).slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLogsError("Could not load logs. Please try again.");
      } finally {
        setLoadingLogs(false);
      }

      try {
        setLoadingAnalytics(true);
        setAnalyticsError("");

        const response = await api.get("/logs/analytics");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setAnalyticsError("Could not load analytics.");
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Last 24 hours across all services.
      </p>

      {analyticsError && (
        <p className="mt-3 text-sm text-red-400">{analyticsError}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          label="Total logs"
          value={loadingAnalytics ? "..." : analytics.totalLogs}
        />
        <StatsCard
          label="Errors"
          value={loadingAnalytics ? "..." : analytics.errors}
          accent="error"
        />
        <StatsCard
          label="Warnings"
          value={loadingAnalytics ? "..." : analytics.warnings}
          accent="warn"
        />
        <StatsCard
          label="Info"
          value={loadingAnalytics ? "..." : analytics.info}
        />
      </div>

      <div className="mt-6">
        <LogsOverTimeChart data={analytics.logsOverTime} />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-300">
          Recent logs
        </p>

        {loadingLogs ? (
          <p className="text-sm text-slate-400">Loading logs...</p>
        ) : logsError ? (
          <p className="text-sm text-red-400">{logsError}</p>
        ) : recentLogs.length === 0 ? (
          <p className="text-sm text-slate-400">
            No logs found. Send a log to see it here.
          </p>
        ) : (
          <LogTable
            logs={recentLogs}
            onSelect={setSelectedLog}
            page={1}
            totalPages={1}
            onPageChange={() => {}}
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
