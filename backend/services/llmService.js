const { GoogleGenAI } = require("@google/genai");

/**
 * Converts provider-agnostic history into Gemini format.
 */
const formatHistoryForGemini = (history = []) => {

    return history.map(message => ({

        role:
            message.role === "assistant"
                ? "model"
                : "user",

        parts: [
            {
                text: message.content
            }
        ]

    }));

};

/**
 * Calls Gemini and returns parsed JSON.
 */
const generateResponse = async ({

    systemInstruction,
    history = [],
    userMessage

}) => {

    if (!process.env.GEMINI_API_KEY) {

        throw new Error(
            "GEMINI_API_KEY is missing in the environment."
        );

    }

    if (!process.env.LLM_MODEL) {

        throw new Error(
            "LLM_MODEL is missing in the environment."
        );

    }

    const ai = new GoogleGenAI({

        apiKey: process.env.GEMINI_API_KEY

    });

    const formattedHistory =
        formatHistoryForGemini(history);

    const response =
        await ai.models.generateContent({

            model: process.env.LLM_MODEL,

            contents: [

                ...formattedHistory,

                {
                    role: "user",
                    parts: [
                        {
                            text: userMessage
                        }
                    ]
                }

            ],

            config: {

                systemInstruction

            }

        });

    const rawResponse = response.text;

    // Extract the first JSON object from the response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {

        console.error("No JSON object found:");
        console.error(rawResponse);

        throw new Error("LLM did not return a JSON object.");

    }

    const jsonString = jsonMatch[0];

    try {

        return JSON.parse(jsonString);

    }
    catch (error) {

        console.error("Failed to parse JSON:");
        console.error(jsonString);

        throw error;

    }

};

module.exports = {

    generateResponse

};