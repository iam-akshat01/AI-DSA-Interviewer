const { v4: uuidv4 } = require("uuid");

const InterviewSession = require("../models/InterviewSession");

const STAGES = require("../constants/stages");

/**
 * Creates a new interview session.
 */
const createSession = async ({
    userId,
    topic,
    difficulty,
    question
}) => {

    const session = new InterviewSession({

        sessionId: uuidv4(),

        userId,

        topic,

        difficulty,

        question,

        currentStage:
            STAGES.PROBLEM_UNDERSTANDING,

        history: [
            {
                role: "assistant",
                content:
                    "Welcome to the AI DSA Interview! Let's begin with the Problem Understanding stage. Please explain the problem in your own words."
            }
        ],

        evaluationHistory: [],

        attempts: {
            approach: 0,
            review: 0
        },

        submittedCode: "",

        status: "IN_PROGRESS"

    });

    await session.save();

    return session;

};

/**
 * Returns interview session.
 */
const getSession = async (
    sessionId
) => {

    const session =
        await InterviewSession.findOne({
            sessionId
        });

    if (!session) {

        throw new Error(
            "Interview session not found."
        );

    }

    return session;

};

/**
 * Adds message to conversation history.
 */
const appendConversation = (
    session,
    role,
    content
) => {

    session.history.push({

        role,

        content

    });

};

/**
 * Stores latest submitted code.
 */
const saveSubmittedCode = (
    session,
    code
) => {

    session.submittedCode =
        code;

};

/**
 * Updates interview stage.
 */
const updateStage = (
    session,
    stage
) => {

    session.currentStage =
        stage;

};

/**
 * Marks interview completed.
 */
const completeInterview = (
    session
) => {

    session.status =
        "COMPLETED";

};

/**
 * Saves Mongo document.
 */
const saveSession = async (
    session
) => {

    await session.save();

};

module.exports = {

    createSession,

    getSession,

    appendConversation,

    saveSubmittedCode,

    updateStage,

    completeInterview,

    saveSession

};