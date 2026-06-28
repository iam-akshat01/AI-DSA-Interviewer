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

    // history.push({
    //     role: "user",
    //     content: userResponse
    // });

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

        // history.push({

        //     role: "assistant",

        //     content:
        //         evaluation.screen_message
        // });

        return evaluation;

    } catch (err) {

        console.error(
            "Problem Understanding Agent Error:",
            err
        );

        throw err;
    }
};

module.exports =
    problemUnderstandingAgent;