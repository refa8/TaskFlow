const pool = require('../config/db');

const createActivityLog = async (userId, action, entityType, entityId, details) => {
  const result = await pool.query(
    'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, action, entityType, entityId, details]
  );
  return result.rows[0];
};

module.exports = {
  createActivityLog,
};