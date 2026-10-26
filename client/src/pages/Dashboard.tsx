import { useState } from "react";
import Layout from "../components/layout/Layout";
import StatsCard from "../components/dashboard/StatsCard";
import LogsOverTimeChart from "../components/dashboard/LogsOverTimeCharts";
import LogTable from "../components/logs/LogTable";
import LogDetailModal from "../components/logs/LogDetailModal";
import { mockLogs } from "../lib/mock/mockLogs";
import { mockAnalytics } from "../lib/mock/mockAnalytics";
import type { LogEntry } from "../types/log";

export default function DashboardPage() {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const recentLogs = mockLogs.slice(0, 8);

  return (
    <Layout>
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Last 24 hours across all services.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard label="Total logs" value={mockAnalytics.totalLogs} />
        <StatsCard label="Errors" value={mockAnalytics.errors} accent="error" />
        <StatsCard label="Warnings" value={mockAnalytics.warnings} accent="warn" />
        <StatsCard label="Info" value={mockAnalytics.info} />
      </div>

      <div className="mt-6">
        <LogsOverTimeChart data={mockAnalytics.logsOverTime} />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-300">Recent logs</p>
        <LogTable
          logs={recentLogs}
          onSelect={setSelectedLog}
          page={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </div>

      {selectedLog && (
        <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </Layout>
  );
}