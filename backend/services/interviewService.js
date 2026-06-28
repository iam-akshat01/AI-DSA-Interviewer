const sessionService = require("./sessionService");
const evaluationService = require("./evaluationService");
const stageService = require("./stageService");

const STAGES = require("../constants/stages");

const problemUnderstandingAgent = require("../agents/problemUnderstandingAgent");
const approachAgent = require("../agents/approachAgent");
const codingAgent = require("../agents/codingAgent");
const codeReviewAgent = require("../agents/codeReviewAgent");
const reportAgent = require("../agents/reportAgent");

/*
|--------------------------------------------------------------------------
| Stage → Agent Mapping
|--------------------------------------------------------------------------
*/

const stageAgents = {
    [STAGES.PROBLEM_UNDERSTANDING]: problemUnderstandingAgent,
    [STAGES.APPROACH_DISCUSSION]: approachAgent,
    [STAGES.CODING]: codingAgent,
    [STAGES.CODE_REVIEW]: codeReviewAgent
};

/*
|--------------------------------------------------------------------------
| Create Interview
|--------------------------------------------------------------------------
*/

const createInterview = async ({
    userId,
    topic,
    difficulty,
    question
}) => {
    return sessionService.createSession({
        userId,
        topic,
        difficulty,
        question
    });
};

/*
|--------------------------------------------------------------------------
| Get Interview
|--------------------------------------------------------------------------
*/

const getInterview = async (sessionId) => {
    return sessionService.getSession(sessionId);
};

/*
|--------------------------------------------------------------------------
| Submit Response
|--------------------------------------------------------------------------
*/

const submitResponse = async ({
    sessionId,
    userResponse
}) => {

    /*
    ---------------------------------------
    Load Interview Session
    ---------------------------------------
    */

    const session =
        await sessionService.getSession(sessionId);

    if (session.status === "COMPLETED") {

        throw new Error(
            "Interview has already been completed."
        );

    }

    /*
    ---------------------------------------
    Save Candidate Response
    ---------------------------------------
    */

    sessionService.appendConversation(
        session,
        "user",
        userResponse
    );

    /*
    ---------------------------------------
    Current Stage
    ---------------------------------------
    */

    const currentStage =
        session.currentStage;

    const agent =
        stageAgents[currentStage];

    if (!agent) {

        throw new Error(
            `No agent registered for stage ${currentStage}`
        );

    }

    /*
    ---------------------------------------
    Hint Generation
    ---------------------------------------
    */

    const hintNeeded =
        stageService.shouldGenerateHint(
            session,
            currentStage
        );

    /*
    ---------------------------------------
    Execute Agent
    ---------------------------------------
    */

    let evaluation;

    if (
        currentStage ===
        STAGES.APPROACH_DISCUSSION
    ) {

        evaluation = await agent(
            session.question,
            session.history,
            userResponse,
            hintNeeded
        );

    }

    else {

        evaluation = await agent(
            session.question,
            session.history,
            userResponse
        );

    }

    /*
    ---------------------------------------
    Save AI Response
    ---------------------------------------
    */

    sessionService.appendConversation(
        session,
        "assistant",
        evaluation.screen_message
    );

    /*
    ---------------------------------------
    Save Evaluation
    ---------------------------------------
    */

    evaluationService.appendEvaluation(
        session,
        currentStage,
        evaluation
    );

    /*
    ---------------------------------------
    Save Submitted Code
    ---------------------------------------
    */

    if (
        currentStage === STAGES.CODING &&
        evaluation.code_given
    ) {

        sessionService.saveSubmittedCode(
            session,
            userResponse
        );

    }

    /*
    ---------------------------------------
    Increment Attempts
    ---------------------------------------
    */

    if (currentStage === STAGES.APPROACH_DISCUSSION) {

        stageService.incrementAttempts(
            session,
            currentStage
        );

    }

    /*
    ---------------------------------------
    Decide Stage Progression
    ---------------------------------------
    */

    const shouldAdvance =
        stageService.shouldAdvanceStage(
            session,
            currentStage,
            evaluation
        );

    if (shouldAdvance) {

        const nextStage =
            stageService.getNextStage(
                currentStage
            );

        /*
        ---------------------------------------
        Final Report
        ---------------------------------------
        */

        if (
            nextStage ===
            STAGES.FINAL_REPORT
        ) {

            sessionService.updateStage(
                session,
                STAGES.FINAL_REPORT
            );

            const report =
                await reportAgent(
                    session.history
                );

            sessionService.appendConversation(
                session,
                "assistant",
                report.screen_message
            );

            evaluationService.appendEvaluation(
                session,
                STAGES.FINAL_REPORT,
                report
            );

            sessionService.completeInterview(
                session
            );

            await sessionService.saveSession(
                session
            );

            return {

                success: true,

                sessionId:
                    session.sessionId,

                currentStage:
                    STAGES.FINAL_REPORT,

                report,

                status:
                    session.status

            };

        }

        /*
        ---------------------------------------
        Normal Stage Progression
        ---------------------------------------
        */

        if (nextStage) {

            sessionService.updateStage(
                session,
                nextStage
            );

        }

        else {

            sessionService.completeInterview(
                session
            );

        }

    }

    /*
    ---------------------------------------
    Save Session
    ---------------------------------------
    */

    await sessionService.saveSession(
        session
    );

    /*
    ---------------------------------------
    Response
    ---------------------------------------
    */

    return {

        success: true,

        sessionId:
            session.sessionId,

        currentStage:
            session.currentStage,

        evaluation,

        status:
            session.status

    };

};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
    createInterview,
    getInterview,
    submitResponse
};