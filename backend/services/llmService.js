const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateResponse = async ({
    systemInstruction,
    history,
    userMessage
}) => {

    const response =
        await ai.models.generateContent({

            model: process.env.LLM_MODEL,

            contents: [
                ...history,
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ],

            config: {
                systemInstruction
            }
        });

    return response.text;
};

module.exports = {
    generateResponse
};