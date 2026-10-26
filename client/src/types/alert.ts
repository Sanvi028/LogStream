import type { LogLevel } from "./log";

export interface AlertRule {
  id: string;
  name: string;
  service: string | null; // null = all services
  level: LogLevel;
  threshold: number;
  windowSeconds: number;
  isActive: boolean;
}

export interface AlertTrigger {
  id: string;
  ruleId: string;
  ruleName: string;
  triggeredAt: string;
  count: number;
}