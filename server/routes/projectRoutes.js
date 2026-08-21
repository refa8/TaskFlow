const express = require("express");
const { getProjects, addProject, getProject, editProject, removeProject } = require("../controllers/projectController");
const router = express.Router();

router.get("/", getProjects);
router.post("/", addProject);
router.get("/:id", getProject);
router.put("/:id", editProject);
router.delete("/:id", removeProject);

module.exports = router;