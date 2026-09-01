const pool = require("../config/db");

const getAllProjects = async (search, page, limit) => {
    const offset = (page - 1) * limit;
    const searchPattern = `%${search}%`;
    const result = await pool.query(`SELECT * FROM projects WHERE name ILIKE $1 ORDER BY project_id LIMIT $2 OFFSET $3`, [searchPattern, limit, offset]);
    const countResult = await pool.query(`SELECT COUNT(*) FROM projects WHERE name ILIKE $1`, [searchPattern]);
    return {
        projects: result.rows,
        totalProjects: parseInt(countResult.rows[0].count)
    };
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