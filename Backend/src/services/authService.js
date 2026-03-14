const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signupUser = async (email, password) => {
  const existingUser = await User.findOne({ email });

  // CASE 1: user already exists
  if (existingUser) {
    // If account created with Google only
    if (!existingUser.password) {
      throw new Error(
        "Account exists with Google login. Please login with Google or set a password."
      );
    }

    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    authProviders: ["local"],
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

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

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  return { user, token };
};

module.exports = {
  signupUser,
  loginUser,
};