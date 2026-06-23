const fs = require("fs");
const path = require("path");

const llmService =
    require("../services/llmService");

const promptPath = path.join(
    __dirname,
    "../prompts/hintPrompt.txt"
);

const systemInstruction =
    fs.readFileSync(
        promptPath,
        "utf8"
    );

const hintAgent = async (
    question,
    history,
    userResponse
) => {

    const responseContext = `
QUESTION:
${JSON.stringify(question, null, 2)}

CANDIDATE RESPONSE:
${userResponse}
`;

    try {

        const hint =
            await llmService.generateResponse({

                systemInstruction,

                history,

                userMessage:
                    responseContext
            });

        if (!hint.hint) {

            throw new Error(
                "Invalid Hint Response"
            );
        }

        return hint.hint;

    } catch (err) {

        console.error(
            "Hint Agent Error:",
            err
        );

        throw err;
    }
};

module.exports =
    hintAgent;