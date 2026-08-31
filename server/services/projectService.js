const pool = require("../config/db");

const getAllProjects = async (page, limit) => {
    const offset = (page - 1) * limit;
    const result = await pool.query("SELECT * FROM projects ORDER BY project_id LIMIT $1 OFFSET $2", [limit, offset]);
    return result.rows;
};

const createProject = async (name, description, owner_id) => {
    const result = await pool.query(
        "INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *", [name, description, owner_id]
    );
    return result.rows[0];
};

const getProjectById = async (id, owner_id) => {
    const result = await pool.query("SELECT * FROM projects WHERE project_id = $1", [id]);
    return result.rows[0];  
};

const updateProject = async (id, name, description, status) => {
    const result = await pool.query(
        "UPDATE projects SET name = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE project_id = $4 RETURNING *",
        [name, description, status, id]
    );
    return result.rows[0];
};

const deleteProject = async (id) => {
    const result = await pool.query("DELETE FROM projects WHERE project_id = $1 RETURNING *", [id]);
    return result.rows[0];
};

module.exports = {
       getAllProjects,
       createProject,
       getProjectById,
       updateProject,
       deleteProject
};