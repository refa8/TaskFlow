const pool = require('../config/db');

const createActivityLog = async (userId, action, entityType, entityId, details) => {
  const result = await pool.query(
    'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, action, entityType, entityId, details]
  );
  return result.rows[0];
};

const getVisibilityClause = (role) => {
  if (role === "admin") {
    return "";
  }

  if (role === "manager") {
    return `WHERE (
        (al.entity_type = 'project' AND EXISTS (
          SELECT 1 FROM projects p
          WHERE p.project_id = al.entity_id AND p.owner_id = $1
        ))
        OR
        (al.entity_type = 'task' AND EXISTS (
          SELECT 1 FROM tasks t
          JOIN projects p ON t.project_id = p.project_id
          WHERE t.task_id = al.entity_id AND p.owner_id = $1
        ))
      )`;
  }

  if (role === "member") {
    return `WHERE al.entity_type = 'task' AND EXISTS (
        SELECT 1 FROM tasks t
        WHERE t.task_id = al.entity_id AND t.assigned_to = $1
      )`;
  }

  throw new Error("Invalid role");
};

const getActivityLogs = async (userId, role, page, limit, sortBy, sortOrder) => {
  const offset = (page - 1) * limit;
  const visibilityClause = getVisibilityClause(role);
  const isAdmin = role === "admin";
  const params = isAdmin ? [limit, offset] : [userId, limit, offset];
  const limitPlaceholder = isAdmin ? "$1" : "$2";
  const offsetPlaceholder = isAdmin ? "$2" : "$3";
  const countParams = isAdmin ? [] : [userId];

  const selectSql = `
    SELECT
      al.id,
      al.user_id,
      u.username,
      al.action,
      al.entity_type,
      al.entity_id,
      al.details,
      al.created_at
    FROM activity_logs al
    LEFT JOIN users u ON u.id = al.user_id
    ${visibilityClause}
    ORDER BY al.${sortBy} ${sortOrder}
    LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
  `;

  const countSql = `
    SELECT COUNT(*)
    FROM activity_logs al
    ${visibilityClause}
  `;

  const result = await pool.query(selectSql, params);
  const countResult = await pool.query(countSql, countParams);

  return {
    logs: result.rows,
    totalLogs: Number(countResult.rows[0].count),
  };
};

module.exports = {
  createActivityLog,
  getActivityLogs,
};
