const express = require("express");
const { getLogs } = require("../controllers/activityLogController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticate, getLogs);

module.exports = router;
