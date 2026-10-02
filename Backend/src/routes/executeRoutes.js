const express = require("express");

const router = express.Router();

const executeController = require("../controllers/executeController");
const executionLimiter = require("../utils/rateLimiter");
const authenticateUser = require("../middleware/authMiddleware");

router.get("/execute/usage", authenticateUser, executeController.getExecutionUsage);

router.post(
  "/execute",
  authenticateUser,
  executionLimiter,
  executeController.executeCode
);

module.exports = router;