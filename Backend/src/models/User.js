const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      default: null
    },

    googleId: {
      type: String,
      default: null
    },

    authProviders: {
      type: [String],
      enum: ["local", "google"],
      default: []
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);