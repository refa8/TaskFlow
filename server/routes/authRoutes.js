const express = require('express');

const { registerUser, loginUser } = require('../controllers/authController');
const validateAuth = require('../middleware/authValidation');


const router = express.Router();


router.post('/register', validateAuth, registerUser);
router.post('/login', validateAuth, loginUser);


module.exports = router;