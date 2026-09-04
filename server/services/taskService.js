const pool = require("../config/db");

const getAllTasks = async (owner_id, search, status, priority, page, limit, sortBy, sortOrder) => {

    const offset = (page - 1) * limit;
    const searchPattern = `%${search}%`;
    const statusPattern = `%${status}%`;
    const priorityPattern = `%${priority}%`;

    const result = await pool.query(
        `SELECT tasks.* FROM tasks JOIN projects ON tasks.project_id = projects.project_id WHERE projects.owner_id = $1 AND tasks.name ILIKE $2 AND tasks.status ILIKE $3 AND tasks.priority ILIKE $4 ORDER BY tasks.${sortBy} ${sortOrder} LIMIT $5 OFFSET $6`,
        [owner_id, searchPattern, statusPattern, priorityPattern, limit, offset]
    );
    const countResult = await pool.query(
        `SELECT COUNT(*) FROM tasks JOIN projects ON tasks.project_id = projects.project_id WHERE projects.owner_id = $1 AND tasks.name ILIKE $2 AND tasks.status ILIKE $3 AND tasks.priority ILIKE $4`,
        [owner_id, searchPattern, statusPattern, priorityPattern]
    );
    return { tasks: result.rows, totalTasks: Number(countResult.rows[0].count) };
};

const createTask = async (name, project_id, assigned_to, status, priority, owner_id) => {
    const result = await pool.query("INSERT INTO tasks (name, project_id, assigned_to, status, priority) SELECT $1, $2, $3, $4, $5 WHERE EXISTS (SELECT 1 FROM projects WHERE project_id = $2 AND owner_id = $6) RETURNING *", [name, project_id, assigned_to, status, priority, owner_id]);
    return result.rows[0];
};

const getTaskById = async (id) => {
            const result = await pool.query("SELECT * FROM tasks WHERE task_id = $1", [id]);
            return result.rows[0];
        };        

const updateTask = async (id, name, project_id, assigned_to, status, priority) => {
    const result = await pool.query(
        "UPDATE tasks SET name = $1, project_id = $2, assigned_to = $3, status = $4, priority = $5, updated_at = CURRENT_TIMESTAMP WHERE task_id = $6 RETURNING *",
        [name, project_id, assigned_to, status, priority, id]
    );
    return result.rows[0];
};

const deleteTask = async (id) => {
    const result = await pool.query("DELETE FROM tasks WHERE task_id = $1 RETURNING *", [id]);
    return result.rows[0];
};


module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
};