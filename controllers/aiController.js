const { askAI } = require("../services/aiservices");

async function askQuestion(req, res) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Question required" });

    const answer = await askAI(question);
    res.json({ answer });
  } catch {
    console.error("AI Error:", error);
  res.status(500).json({
    message: "AI failed",
    error: error.message
  });
  }
}

module.exports = {
  askQuestion
};
