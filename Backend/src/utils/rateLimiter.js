const { ipKeyGenerator, rateLimit } = require("express-rate-limit");

const executionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  message: {
    error: "Too many code executions. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = executionLimiter;
