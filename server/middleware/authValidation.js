const validateAuth = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (typeof username !== 'string' || username.length < 3 || username.length > 50) {
        return res.status(400).json({ message: "Username must be a string between 3 and 50 characters" });
    }

    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ message: "Password must be a string with at least 8 characters" });
    }

    next();
};

module.exports = validateAuth;