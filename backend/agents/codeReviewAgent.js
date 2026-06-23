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



const codeReviewAgent = 
async(
    question,
    history,
    userResponse)
    =>{
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


    }
