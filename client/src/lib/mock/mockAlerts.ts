import type { AlertRule, AlertTrigger } from "../../types/alert";

export const mockAlertRules: AlertRule[] = [
  {
    id: "rule_1",
    name: "High error rate - payments",
    service: "payment-service",
    level: "ERROR",
    threshold: 10,
    windowSeconds: 60,
    isActive: true,
  },
  {
    id: "rule_2",
    name: "Global error spike",
    service: null,
    level: "ERROR",
    threshold: 50,
    windowSeconds: 60,
    isActive: true,
  },
  {
    id: "rule_3",
    name: "Login service warnings",
    service: "login-service",
    level: "WARN",
    threshold: 20,
    windowSeconds: 300,
    isActive: false,
  },
];

export const mockAlertTriggers: AlertTrigger[] = [
  {
    id: "trigger_1",
    ruleId: "rule_1",
    ruleName: "High error rate - payments",
    triggeredAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    count: 14,
  },
  {
    id: "trigger_2",
    ruleId: "rule_2",
    ruleName: "Global error spike",
    triggeredAt: new Date(Date.now() - 95 * 60_000).toISOString(),
    count: 57,
  },
];