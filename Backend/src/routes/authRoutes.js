const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

// Email signup
router.post("/signup", authController.signup);

// Email login
router.post("/login", authController.login);

// Google OAuth start
router.get("/google", authController.googleAuth);

// Google OAuth callback
router.get("/google/callback", authController.googleCallback);

module.exports = router;