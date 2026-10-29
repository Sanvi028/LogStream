
import pool from "../config/db.js";
import {
  getActiveRulesForLevel,
  markTriggered,
} from "../models/alertRuleModel.js";
import { recordTrigger } from "../models/alertTriggerModel.js";
import { getIO } from "./socket.js";

const COOLDOWN_MINUTES = 5;

export async function checkAlerts({ service, level }) {
  console.log("[Alert Debug] Incoming log:", { service, level });

  try {
    const rules = await getActiveRulesForLevel(level);

    console.log(
      "[Alert Debug] Active rules:",
      rules.map((rule) => ({
        id: rule.id,
        name: rule.name,
        service: rule.service,
        level: rule.level,
        threshold: rule.threshold,
        window_seconds: rule.window_seconds,
        last_triggered_at: rule.last_triggered_at,
      }))
    );

    for (const rule of rules) {
      // Normalize service names to avoid accidental whitespace mismatches.
      const ruleService = rule.service?.trim();
      const incomingService = service?.trim();

      if (ruleService && ruleService !== incomingService) {
        console.log(`[Alert Debug] Skipping ${rule.name}: service mismatch`, {
          ruleService,
          incomingService,
        });
        continue;
      }

      // Enforce cooldown only when the timestamp is in the past.
      if (rule.last_triggered_at) {
        const lastTriggeredAt = new Date(
          rule.last_triggered_at
        ).getTime();

        const elapsedMs = Date.now() - lastTriggeredAt;
        const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;

        console.log("[Alert Debug] Cooldown check:", {
          rule: rule.name,
          lastTriggeredAt: rule.last_triggered_at,
          nodeTime: new Date().toISOString(),
          elapsedMs,
        });

        if (elapsedMs >= 0 && elapsedMs < cooldownMs) {
          console.log(
            `[Alert Debug] Skipping ${rule.name}: cooldown active`
          );
          continue;
        }
      }

      const count = await countRecentLogs(rule);

      console.log("[Alert Debug] Rule count:", {
        name: rule.name,
        count,
        threshold: Number(rule.threshold),
        windowSeconds: Number(rule.window_seconds),
      });

      if (count >= Number(rule.threshold)) {
        console.log(`[Alert Debug] Threshold reached for ${rule.name}`);

        await recordTrigger(rule.id, count);
        await markTriggered(rule.id);

        getIO().to("logs").emit("new-alert", {
          ruleId: rule.id,
          ruleName: rule.name,
          triggeredAt: new Date().toISOString(),
          count,
        });

        console.log(`Alert fired: ${rule.name} (${count} hits)`);
      }
    }
  } catch (error) {
    console.error("[Alert Debug] Alert detection failed:", error);
    throw error;
  }
}

async function countRecentLogs(rule) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM public.logs
     WHERE level = $1
       AND created_at > NOW() - INTERVAL '1 second' * $2
       ${rule.service ? "AND service = $3" : ""}`,
    rule.service
      ? [rule.level, rule.window_seconds, rule.service.trim()]
      : [rule.level, rule.window_seconds]
  );

  return result.rows[0].count;
}
