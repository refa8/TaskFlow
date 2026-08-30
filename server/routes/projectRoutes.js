const express = require("express");
const { getProjects, addProject, getProject, editProject, removeProject } = require("../controllers/projectController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", authenticate, getProjects);
router.post("/", authenticate, authorize('admin', 'manager'), addProject);
router.get("/:id", authenticate, getProject);
router.put("/:id", authenticate, authorize('admin', 'manager'), editProject);
router.delete("/:id", authenticate, authorize('admin', 'manager'), removeProject);

module.exports = router;