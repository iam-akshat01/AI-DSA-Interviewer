const fs = require("fs");
const path = require("path");

const llmService =
    require("../services/llmService");

const promptPath = path.join(
    __dirname,
    "../prompts/approachPrompt.txt"
);

const systemInstruction =
    fs.readFileSync(
        promptPath,
        "utf8"
    );

const approachAgent =
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
${JSON.stringify(question, null, 2)}

CANDIDATE RESPONSE:
${userResponse}
`;

    try {

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

        if (
            evaluation.score === undefined ||
            !evaluation.approach_status
        ) {
            throw new Error(
                "Invalid Approach Evaluation"
            );
        }

        return evaluation;

    } catch (err) {

        console.error(
            "Approach Agent Error:",
            err
        );

        throw err;
    }
};

module.exports =
    approachAgent;