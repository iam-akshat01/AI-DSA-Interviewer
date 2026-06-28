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

            report.understanding_score === undefined ||

            report.approach_score === undefined ||

            report.coding_review_score === undefined ||

            report.overall_score === undefined ||

            !report.overall_summary ||

            !report.problem_understanding_analysis ||

            !report.approach_analysis ||

            !report.coding_review_analysis ||

            !Array.isArray(report.recommendations)

        ) {

            throw new Error(
                "Invalid Report Response"
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Build screen_message inside backend
        |--------------------------------------------------------------------------
        */

        report.screen_message = `

Overall Performance Summary

${report.overall_summary}

--------------------------------------------------

Problem Understanding

${report.problem_understanding_analysis}

--------------------------------------------------

Approach Discussion

${report.approach_analysis}

--------------------------------------------------

Coding & Review

${report.coding_review_analysis}

--------------------------------------------------

Recommended Areas For Improvement

${report.recommendations
    .map(item => `• ${item}`)
    .join("\n")}

`.trim();

        return report;

    }

    catch (err) {

        console.error(
            "Report Agent Error:",
            err
        );

        throw err;

    }

};

module.exports =
    reportAgent;