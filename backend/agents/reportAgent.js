const fs = require("fs");
const path = require("path");

const llmService =
    require("../services/llmService");

const promptPath = path.join(
    __dirname,
    "../prompts/reportPrompt.txt"
);

const systemInstruction =
    fs.readFileSync(
        promptPath,
        "utf8"
    );

const reportAgent = async (
    history
) => {

    try {

        const report =
            await llmService.generateResponse({

                systemInstruction,

                history,

                userMessage:
                    "Generate the final interview report based on the complete interview history."
            });

        if (

            report.understanding_score ===
                undefined ||

            report.approach_score ===
                undefined ||

            report.coding_review_score ===
                undefined ||

            report.overall_score ===
                undefined ||

            !report.screen_message

        ) {

            throw new Error(
                "Invalid Report Response"
            );
        }

        history.push({

            role: "assistant",

            content:
                report.screen_message
        });

        return report;

    } catch (err) {

        console.error(
            "Report Agent Error:",
            err
        );

        throw err;
    }
};

module.exports =
    reportAgent;