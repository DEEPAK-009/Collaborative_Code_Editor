const executionService = require("../services/executionService");

const executeCode = async (req, res) => {
  try {
    const { language, code, roomId } = req.body;

    const output = await executionService.executeCode(language, code);

    const io = req.app.get("io"); // ✅ get socket instance

    // 🔥 broadcast to ALL users in room
    io.to(roomId).emit("execution-result", {
      output,
    });

    res.json({ output });
  } catch (error) {
    res.status(500).json({
      error: "Execution failed",
    });
  }
};

module.exports = { executeCode };