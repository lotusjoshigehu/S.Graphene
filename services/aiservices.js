
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

async function askAI(question) {

    const prompt = `
Answer the user's question in clean HTML.

Rules:
- Use only h2, h3, p, ul, li, strong.
- Do not use markdown.
- Do not use ### headings.
- Do not use **bold** syntax.
- Do not use * bullets.
- Return ONLY HTML.
- Make the answer easy to read.

Question:
${question}
`;

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;
}

module.exports = { askAI };

