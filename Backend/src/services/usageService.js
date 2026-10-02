const DailyExecution = require("../models/DailyExecution");

const getTodayDateString = () => new Date().toISOString().slice(0, 10);
const DAILY_LIMIT = Number(process.env.DAILY_EXECUTION_LIMIT) || 50;

const getDailyUsage = async () => {
  const date = getTodayDateString();
  const record = await DailyExecution.findOne({ date });

  const used = record ? record.count : 0;
  const limit = record?.limit || DAILY_LIMIT;

  return {
    date,
    used,
    limit,
    remaining: Math.max(0, limit - used),
  };
};

const incrementDailyUsage = async () => {
  const date = getTodayDateString();
  const record = await DailyExecution.findOneAndUpdate(
    { date },
    { $inc: { count: 1 }, $setOnInsert: { limit: DAILY_LIMIT } },
    { upsert: true, new: true }
  );

  return {
    date,
    used: record.count,
    limit: record.limit,
    remaining: Math.max(0, record.limit - record.count),
  };
};

module.exports = {
  getDailyUsage,
  incrementDailyUsage,
  DAILY_LIMIT,
};
