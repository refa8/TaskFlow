const express = require('express');

const { registerUser, loginUser } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const authorize = require('../middleware/roleMiddleware');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/admin-test', authenticate, authorize('admin'), (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

module.exports = router;