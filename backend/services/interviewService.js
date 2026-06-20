const InterviewSession = require("../models/InterviewSession");
const STAGES = require("../constants/stages");

//create a new interview session
const createInterview = async ({
    sessionId,
    userId,
    topic,
    difficulty,
    questionId
}) => {

    return await InterviewSession.create({
        sessionId,
        userId,
        topic,
        difficulty,
        questionId,
        currentStage:
            STAGES.PROBLEM_UNDERSTANDING
    });

};

const getInterviewBySessionId = async (
    sessionId
) => {
    return await InterviewSession.findOne({
        sessionId
    });
};

//update the current stage of the interview session
const updateStage = async (
    sessionId,
    stage
) => {
    return await InterviewSession.findOneAndUpdate(
        { sessionId },
        {
            currentStage: stage
        },
        {
            new: true
        }
    );
};

//increment interview attempts
const incrementAttempts = async (
    sessionId,
    attemptType
) => {
    const interview =
        await InterviewSession.findOne({
            sessionId
        });

    if (!interview) {
        throw new Error(
            "Interview session not found"
        );
    }

    interview.attempts[attemptType] += 1;

    await interview.save();

    return interview;
}

//evaluate the interview session and save the score and feedback
const saveEvaluation = async (
    sessionId,
    stage,
    score,
    feedback
) => {

    const interview =
        await InterviewSession.findOne({
            sessionId
        });

    if (!interview) {
        throw new Error(
            "Interview session not found"
        );
    }

    switch (stage) {

        case STAGES.PROBLEM_UNDERSTANDING:
            interview.understandingScore =
                score;
            break;

        case STAGES.APPROACH_DISCUSSION:
            interview.approachScore =
                score;
            break;

        case STAGES.CODING:
            interview.codingScore =
                score;
            break;

        default:
            throw new Error(
                "Invalid stage"
            );
    }

    interview.feedbackHistory.push({
        stage,
        score,
        feedback
    });

    await interview.save();

    return interview;
};

//complete the interview session
const completeInterview = async (
    sessionId
) => {

    const interview =
        await InterviewSession.findOne({
            sessionId
        });

    if (!interview) {
        throw new Error(
            "Interview session not found"
        );
    }

    interview.status =
        "COMPLETED";

    await interview.save();

    return interview;
};

module.exports = {
    createInterview,
    getInterviewBySessionId,
    updateStage,
    incrementAttempts,
    saveEvaluation,
    completeInterview
};