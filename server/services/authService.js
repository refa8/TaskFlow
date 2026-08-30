const pool = require("../config/db");

const createUser = async (username, passwordHash) => {
    const result = await pool.query("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *", [username, passwordHash]);
    return result.rows[0];  
};

const getUserByUsername = async (username) => {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0];
};

module.exports = {
    createUser,
    getUserByUsername
};