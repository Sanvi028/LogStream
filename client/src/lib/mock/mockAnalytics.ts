import { mockLogs } from "./mockLogs";
import type { AnalyticsSummary } from "../../types/log";

export function buildMockAnalytics(): AnalyticsSummary {
  const errors = mockLogs.filter((l) => l.level === "ERROR").length;
  const warnings = mockLogs.filter((l) => l.level === "WARN").length;
  const info = mockLogs.filter((l) => l.level === "INFO").length;

  // Bucket logs into hourly counts for the chart
  const buckets = new Map<string, number>();
  mockLogs.forEach((log) => {
    const hour = new Date(log.createdAt);
    hour.setMinutes(0, 0, 0);
    const key = hour.toISOString();
    buckets.set(key, (buckets.get(key) || 0) + 1);
  });

  const logsOverTime = Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, count]) => ({
      time: new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      count,
    }));

  return {
    totalLogs: mockLogs.length,
    errors,
    warnings,
    info,
    logsOverTime,
  };
}

export const mockAnalytics: AnalyticsSummary = buildMockAnalytics();