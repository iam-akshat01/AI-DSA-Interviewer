const fs = require("fs");
const path = require("path");

const llmService =
    require("../services/llmService");

const promptPath = path.join(
    __dirname,
    "../prompts/codingPrompt.txt"
);

const systemInstruction =
    fs.readFileSync(
        promptPath,
        "utf8"
    );

const codingAgent = async (
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

        if (
            evaluation.score === undefined ||
            evaluation.code_given === undefined ||
            evaluation.language_selected === undefined ||
            evaluation.interview_complete === undefined
        ) {

            throw new Error(
                "Invalid Coding Evaluation"
            );
        }

        // history.push({

        //     role: "assistant",

        //     content:
        //         evaluation.screen_message
        // });

        return evaluation;

    } catch (err) {

        console.error(
            "Coding Agent Error:",
            err
        );

        throw err;
    }
};

module.exports =
    codingAgent;