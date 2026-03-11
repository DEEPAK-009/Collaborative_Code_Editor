const executionService = require("../services/executionService");

const executeCode = async (req, res) => {

  try {

    const { language, code } = req.body;

    const output = await executionService.executeCode(language, code);

    res.json({
      output
    });

  } catch (error) {

    res.status(500).json({
      error: "Execution failed"
    });

  }

};

module.exports = {
  executeCode
};