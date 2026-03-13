const rateLimit = require("express-rate-limit");

const executionLimiter = rateLimit({

  windowMs: 60 * 1000, // 1 minute

  max: 5, // 5 executions per minute

  message: {
    error: "Too many code executions. Try again later."
  },

  standardHeaders: true,

  legacyHeaders: false

});

module.exports = executionLimiter;