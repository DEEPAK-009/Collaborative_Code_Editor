const executionService = require("../services/executionService");
const roomService = require("../services/roomService");

const executeCode = async (req, res) => {
  try {
    const { language, code, roomId } = req.body;

    if (!language || typeof code !== "string" || !roomId) {
      return res.status(400).json({
        error: "roomId, language, and code are required",
      });
    }

    await roomService.assertRoomMember(roomId, req.user.id);

    const output = await executionService.executeCode(language, code);

    const io = req.app.get("io");
    io.to(roomId).emit("execution-result", {
      output,
      language,
      roomId,
    });

    res.json({ output });
  } catch (error) {
    const statusCode = error.message === "Room not found" ? 404 : 400;
    res.status(statusCode).json({
      error: error.message || "Execution failed",
    });
  }
};

module.exports = { executeCode };
