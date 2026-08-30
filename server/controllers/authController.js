const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser,getUserByUsername } = require('../services/authService');

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const user = await createUser(username, passwordHash);
        const { password_hash, ...safeUser } = user;
        res.status(201).json({ message: "User registered successfully", user: safeUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password_hash, ...safeUser } = user;
        res.status(200).json({ message: "Login successful", user: safeUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
};

module.exports = {
    registerUser,
    loginUser
};