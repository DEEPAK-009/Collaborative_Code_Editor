const authService = require("../services/authService");
const { signAuthToken } = require("../utils/jwt");

const signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName?.trim()) {
      return res.status(400).json({
        error: "Display name, email, and password are required",
      });
    }

    const { user, token } = await authService.signupUser({
      email,
      password,
      displayName,
    });

    res.status(201).json({
      message: "User created",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const { user, token } = await authService.loginUser({ email, password });

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const { displayName, password } = req.body;
    const result = await authService.updateCurrentUser({
      userId: req.user.id,
      displayName,
      password,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const googleCallback = async (req, res) => {
  const user = req.user;
  const token = signAuthToken(user);
  const redirectURL = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/oauth-success?token=${encodeURIComponent(token)}`;
  res.redirect(redirectURL);
};

module.exports = {
  signup,
  login,
  me,
  googleCallback,
  updateMe,
};
