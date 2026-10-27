import pool from "../config/db.js";
import { getActiveRulesForLevel, markTriggered } from "../models/alertRuleModel.js";
import { recordTrigger } from "../models/alertTriggerModel.js";
import { getIO } from "./socket.js";

const COOLDOWN_MINUTES = 5;

export async function checkAlerts({ service, level }) {
  const rules = await getActiveRulesForLevel(level);

  for (const rule of rules) {
    // Skip rules scoped to a different service
    if (rule.service && rule.service !== service) continue;

    // Skip if still in cooldown from the last time this rule fired
    if (rule.last_triggered_at) {
      const minutesSinceLastTrigger =
        (Date.now() - new Date(rule.last_triggered_at).getTime()) / 60000;
      if (minutesSinceLastTrigger < COOLDOWN_MINUTES) continue;
    }

    const count = await countRecentLogs(rule);

    if (count >= rule.threshold) {
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
}

async function countRecentLogs(rule) {
  const result = await pool.query(
    `SELECT COUNT(*) FROM logs
     WHERE level = $1
       AND created_at > now() - interval '1 second' * $2
       ${rule.service ? "AND service = $3" : ""}`,
    rule.service
      ? [rule.level, rule.window_seconds, rule.service]
      : [rule.level, rule.window_seconds]
  );
  return parseInt(result.rows[0].count, 10);
}