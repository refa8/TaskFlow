const express = require('express');
const { getTasks, addTask, getTask, editTask, removeTask } = require('../controllers/taskController');
const { validateTask} = require('../middleware/taskValidation');
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const router = express.Router();

router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, getTask);
router.put('/:id', authenticate, editTask);
router.delete('/:id', authenticate, authorize('admin','manager'), removeTask);
router.post('/', authenticate, validateTask, addTask);


module.exports = router;