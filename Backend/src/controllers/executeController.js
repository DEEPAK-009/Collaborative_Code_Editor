const executionService = require("../services/executionService");
const roomService = require("../services/roomService");
const usageService = require("../services/usageService");

const getExecutionUsage = async (req, res) => {
  try {
    const usage = await usageService.getDailyUsage();
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch execution usage" });
  }
};

const executeCode = async (req, res) => {
  try {
    const { language, code, roomId, input } = req.body;

    if (!language || typeof code !== "string" || !roomId) {
      return res.status(400).json({
        error: "roomId, language, and code are required",
      });
    }

    await roomService.assertRoomMember(roomId, req.user.id);

    // Check daily execution limit
    const currentUsage = await usageService.getDailyUsage();
    if (currentUsage.remaining <= 0) {
      return res.status(429).json({
        error: `Daily execution limit reached (${currentUsage.used}/${currentUsage.limit} runs today). Resets at 00:00 UTC.`,
        usage: currentUsage,
      });
    }

    const output = await executionService.executeCode(
      language,
      code,
      input || ""
    );

    // Increment usage counter in MongoDB
    const updatedUsage = await usageService.incrementDailyUsage();

    const io = req.app.get("io");
    if (io) {
      io.to(roomId).emit("execution-result", {
        output,
        language,
        roomId,
      });

      // Broadcast live counter update to ALL users across ALL rooms globally
      io.emit("execution-usage", updatedUsage);
    }

    res.json({ output, usage: updatedUsage });
  } catch (error) {
    const statusCode = error.message === "Room not found" ? 404 : 400;
    res.status(statusCode).json({
      error: error.message || "Execution failed",
    });
  }
};

module.exports = { executeCode, getExecutionUsage };
