const express = require("express");

const router = express.Router();

const executeController = require("../controllers/executeController");
const executionLimiter = require("../utils/rateLimiter");
const authenticateUser = require("../middleware/authMiddleware");
const { authenticate } = require("passport");

router.post(
  "/execute",
  authenticateUser, 
  executionLimiter, 
  executeController.executeCode
);

module.exports = router;