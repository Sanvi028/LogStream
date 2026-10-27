import pool from "../config/db.js";

export async function recordTrigger(ruleId, count) {
  const result = await pool.query(
    `INSERT INTO alert_triggers (rule_id, count)
     VALUES ($1, $2)
     RETURNING *`,
    [ruleId, count]
  );
  return result.rows[0];
}

export async function getRecentTriggers(limit = 20) {
  const result = await pool.query(
    `SELECT t.id, t.rule_id as "ruleId", r.name as "ruleName",
            t.triggered_at as "triggeredAt", t.count
     FROM alert_triggers t
     JOIN alert_rules r ON r.id = t.rule_id
     ORDER BY t.triggered_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}