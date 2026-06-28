const fs = require("fs");
const path = require("path");

const llmService =
    require("../services/llmService");

const promptPath = path.join(
    __dirname,
    "../prompts/reviewPrompt.txt"
);

const systemInstruction =
    fs.readFileSync(
        promptPath,
        "utf8"
    );

const codeReviewAgent = async (
    question,
    history,
    userResponse
) => {

    const responseContext = `
QUESTION:
${JSON.stringify(question, null, 2)}

CANDIDATE CODE:
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

        if (

            evaluation.score === undefined ||

            !evaluation.screen_message

        ) {

            throw new Error(
                "Invalid Code Review Response"
            );

        }

        return evaluation;

    }

    catch (err) {

        console.error(

            "Code Review Agent Error:",

            err

        );

        throw err;

    }

};

module.exports =
    codeReviewAgent;