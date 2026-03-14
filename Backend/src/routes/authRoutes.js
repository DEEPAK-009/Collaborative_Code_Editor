const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");


// Email signup
router.post("/signup", authController.signup);

// Email login
router.post("/login", authController.login);

// start google auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

module.exports = router;