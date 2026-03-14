const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    const { user, token } = await authService.signupUser(email, password);

    res.status(201).json({
      message: "User created",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
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

    const { user, token } = await authService.loginUser(email, password);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// function is no longer needed once you switch to Passport for Google OAuth.
const googleAuth = async (req, res) => {
  res.json({ message: "Google auth route working" });
};

// The controller is only used after Google finishes authentication.
const googleCallback = async (req, res) => {
  const user = req.user;
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES
    }
  );
  const redirectURL = `http://localhost:3000/oauth-success?token=${token}`;
  res.redirect(redirectURL);
};

module.exports = {
  signup,
  login,
  googleAuth,
  googleCallback,
};
