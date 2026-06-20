const fs = require("fs");
const path = require("path");

const llmService =
    require("../services/llmService");

const promptPath = path.join(
    __dirname,
    "../prompts/problemUnderstandingPrompt.txt"
);

const systemInstruction =
    fs.readFileSync(
        promptPath,
        "utf8"
    );

const problemUnderstandingAgent =
async (
    question,
    history,
    userResponse
) => {

    history.push({
        role: "user",
        content: userResponse
    });

    const responseContext = `
QUESTION:
${question}

CANDIDATE RESPONSE:
${userResponse}
`;

    const evaluation =
        await llmService.generateResponse({

            systemInstruction,

            history,

            userMessage:
                responseContext
        });

    history.push({

        role: "assistant",

        content:
            evaluation.screen_message
    });

    return evaluation;
};

module.exports =
    problemUnderstandingAgent;