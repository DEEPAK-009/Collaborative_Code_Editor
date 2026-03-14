const signup = async (req, res) => {
  res.json({ message: "Signup route working" });
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