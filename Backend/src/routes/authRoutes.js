const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const authenticateUser = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authenticateUser, authController.me);
router.patch("/me", authenticateUser, authController.updateMe);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

module.exports = router;
