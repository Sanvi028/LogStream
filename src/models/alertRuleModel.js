import pool from "../config/db.js";

export async function createRule({ name, service, level, threshold, windowSeconds, createdBy }) {
  const result = await pool.query(
    `INSERT INTO alert_rules (name, service, level, threshold, window_seconds, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, service || null, level, threshold, windowSeconds, createdBy]
  );
  return result.rows[0];
}

export async function getAllRules() {
  const result = await pool.query(`SELECT * FROM alert_rules ORDER BY created_at DESC`);
  return result.rows;
}

export async function getActiveRulesForLevel(level) {
  const result = await pool.query(
    `SELECT * FROM alert_rules WHERE is_active = true AND level = $1`,
    [level]
  );
  return result.rows;
}

export async function updateRule(id, fields) {
  const result = await pool.query(
    `UPDATE alert_rules SET
       name = COALESCE($1, name),
       is_active = COALESCE($2, is_active),
       threshold = COALESCE($3, threshold)
     WHERE id = $4
     RETURNING *`,
    [fields.name, fields.isActive, fields.threshold, id]
  );
  return result.rows[0];
}

export async function deleteRule(id) {
  await pool.query(`DELETE FROM alert_rules WHERE id = $1`, [id]);
}

export async function markTriggered(id) {
  await pool.query(
    `UPDATE alert_rules SET last_triggered_at = now() WHERE id = $1`,
    [id]
  );
}