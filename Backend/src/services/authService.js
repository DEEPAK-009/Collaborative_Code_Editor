const bcrypt = require("bcrypt");
const User = require("../models/User");
const { getDisplayName, signAuthToken } = require("../utils/jwt");

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  displayName: getDisplayName(user),
  googleId: user.googleId,
  authProviders: user.authProviders,
});

const normalizeEmail = (email) => email.trim().toLowerCase();

const ensureDisplayName = (displayName, email) => {
  const normalized = displayName?.trim();

  if (normalized) {
    return normalized;
  }

  return email.split("@")[0];
};

const signupUser = async ({ email, password, displayName }) => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    if (existingUser.authProviders.includes("local")) {
      throw new Error("Email already registered");
    }

    existingUser.password = await bcrypt.hash(password, 10);
    existingUser.displayName = ensureDisplayName(
      displayName,
      existingUser.email
    );
    existingUser.authProviders = Array.from(
      new Set([...existingUser.authProviders, "local"])
    );
    await existingUser.save();

    return {
      user: sanitizeUser(existingUser),
      token: signAuthToken(existingUser),
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email: normalizedEmail,
    displayName: ensureDisplayName(displayName, normalizedEmail),
    password: hashedPassword,
    authProviders: ["local"],
  });

  await user.save();

  return {
    user: sanitizeUser(user),
    token: signAuthToken(user),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.password) {
    throw new Error("Please login using Google authentication");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }

  return {
    user: sanitizeUser(user),
    token: signAuthToken(user),
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return sanitizeUser(user);
};

const updateCurrentUser = async ({ userId, displayName, password }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updates = {};

  if (displayName !== undefined) {
    updates.displayName = ensureDisplayName(displayName, user.email);
  }

  if (password) {
    updates.password = await bcrypt.hash(password, 10);
    updates.authProviders = Array.from(
      new Set([...(user.authProviders || []), "local"])
    );
  }

  Object.assign(user, updates);
  await user.save();

  return {
    user: sanitizeUser(user),
    token: signAuthToken(user),
  };
};

module.exports = {
  getCurrentUser,
  signupUser,
  loginUser,
  sanitizeUser,
  updateCurrentUser,
};
