const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ["owner", "editor", "viewer"],
    default: "editor"
  }
}, { _id: false });

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },

  ownerId: {
    type: String,
    required: true
  },

  members: [memberSchema],

  code: {
    type: String,
    default: ""
  },

  language: {
    type: String,
    default: "javascript"
  }

}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
