const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
};

const getDisplayName = (user) => {
  if (user.displayName && user.displayName.trim()) {
    return user.displayName.trim();
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Anonymous";
};

const buildTokenPayload = (user) => ({
  id: user._id.toString(),
  email: user.email,
  displayName: getDisplayName(user),
});

const signAuthToken = (user) =>
  jwt.sign(buildTokenPayload(user), getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret());

module.exports = {
  buildTokenPayload,
  getDisplayName,
  signAuthToken,
  verifyAuthToken,
};
