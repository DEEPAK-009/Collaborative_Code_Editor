const authService = require("../services/authService");
const signup = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required"
      });
    }

    const user = await authService.signupUser(email, password);

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }

};
const login = async (req, res) => {
  res.json({ message: "Login route working" });
};

const googleAuth = async (req, res) => {
  res.json({ message: "Google auth route working" });
};

const googleCallback = async (req, res) => {
  res.json({ message: "Google callback route working" });
};

module.exports = {
  signup,
  login,
  googleAuth,
  googleCallback
};