const mongoose = require("mongoose");

const dailyExecutionSchema = new mongoose.Schema(
  {
    date: {
      type: String, // 'YYYY-MM-DD' (UTC)
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyExecution", dailyExecutionSchema);
