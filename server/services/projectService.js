const pool = require("../config/db");

const getAllProjects = async (search, status, page, limit, sortBy, sortOrder) => {
    const offset = (page - 1) * limit;
    const searchPattern = `%${search}%`;
    const statusPattern = `%${status}%`;
    const result = await pool.query(`SELECT * FROM projects WHERE name ILIKE $1 AND status ILIKE $2 ORDER BY ${sortBy} ${sortOrder} LIMIT $3 OFFSET $4`, [searchPattern, statusPattern, limit, offset]);
    const countResult = await pool.query(`SELECT COUNT(*) FROM projects WHERE name ILIKE $1 AND status ILIKE $2`, [searchPattern, statusPattern]);
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