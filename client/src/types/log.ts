export type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG";

export interface LogEntry {
  id: string;
  service: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string; // ISO timestamp
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LogFilters {
  search?: string;
  service?: string;
  level?: LogLevel | "";
  from?: string;
  to?: string;
  page?: number;
}

export interface AnalyticsSummary {
  totalLogs: number;
  errors: number;
  warnings: number;
  info: number;
  logsOverTime: { time: string; count: number }[];
}