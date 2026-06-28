const mongoose = require("mongoose");
const STAGES = require("../constants/stages");

const validStages = Object.values(STAGES);

/*
|--------------------------------------------------------------------------
| Conversation History
|--------------------------------------------------------------------------
*/

const historySchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

/*
|--------------------------------------------------------------------------
| Evaluation History
|--------------------------------------------------------------------------
*/

const evaluationSchema = new mongoose.Schema(
    {
        stage: {
            type: String,
            enum: validStages,
            required: true,
        },

        score: {
            type: Number,
            min: 0,
            max: 10,
        },

        feedback: {
            type: String,
            default: "",
        },

        missedConstraints: {
            type: [String],
            default: [],
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

/*
|--------------------------------------------------------------------------
| Question Snapshot
|--------------------------------------------------------------------------
|
| We store a snapshot of the question inside the interview session.
| This ensures the interview remains consistent even if the original
| question changes later in PostgreSQL.
|
*/

const questionSchema = new mongoose.Schema(
    {
        id: String,

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        constraints: {
            type: [String],
            default: [],
        },

        examples: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },

        difficulty: {
            type: String,
            required: true,
        },

        topic: {
            type: String,
            default: "",
        },

        hints: {
            type: [String],
            default: [],
        },
    },
    { _id: false }
);

/*
|--------------------------------------------------------------------------
| Interview Session
|--------------------------------------------------------------------------
*/

const interviewSessionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        userId: {
            type: String,
            required: true
        },

        topic: {
            type: String,
            default: ""
        },

        difficulty: {
            type: String,
            default: ""
        },

        question: {
            type: questionSchema,
            required: true,
        },

        currentStage: {
            type: String,
            enum: validStages,
            default: STAGES.PROBLEM_UNDERSTANDING,
        },

        history: {
            type: [historySchema],
            default: [],
        },

        evaluationHistory: {
            type: [evaluationSchema],
            default: [],
        },

        attempts: {
            approach: {
                type: Number,
                default: 0,
            },
        },

        submittedCode: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["IN_PROGRESS", "COMPLETED", "ABANDONED"],
            default: "IN_PROGRESS",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "InterviewSession",
    interviewSessionSchema
);