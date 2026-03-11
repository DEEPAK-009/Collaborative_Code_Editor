const express = require("express");

const router = express.Router();

const executeController = require("../controllers/executeController");

router.post("/execute", executeController.executeCode);

module.exports = router;