import type { LogEntry } from "../../types/log";

const services = ["payment-service", "login-service", "order-service", "inventory-service"];
const levels: LogEntry["level"][] = ["ERROR", "WARN", "INFO", "DEBUG"];
const messages: Record<string, string[]> = {
  ERROR: ["Payment gateway timeout", "Unhandled exception in handler", "Database connection refused", "Null reference error"],
  WARN: ["Retrying request (attempt 2)", "Response time above threshold", "Deprecated endpoint called"],
  INFO: ["Request completed successfully", "User logged in", "Order placed", "Cache refreshed"],
  DEBUG: ["Incoming request payload", "Cache hit for key", "Health check passed"],
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockLogs(count = 60): LogEntry[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const level = randomItem(levels);
    return {
      id: `log_${i}_${now}`,
      service: randomItem(services),
      level,
      message: randomItem(messages[level]),
      metadata: {
        requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
        durationMs: Math.floor(Math.random() * 800),
      },
      createdAt: new Date(now - i * 45_000).toISOString(),
    };
  });
}

export const mockLogs: LogEntry[] = generateMockLogs(80);