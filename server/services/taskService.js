const pool = require("../config/db");

const getAllTasks = async (owner_id) => {
    const result = await pool.query("SELECT * FROM tasks JOIN projects ON tasks.project_id = projects.project_id WHERE projects.owner_id = $1", [owner_id]);
    return result.rows;
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