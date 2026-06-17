const mongoose = require('mongoose');
const STAGES = require('../constants/stages');

const validStages = Object.values(STAGES);

const interviewSessionSchema = new mongoose.Schema(
{
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    topic: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        required: true
    },

    question: {
        type: String,
        required: true
    },

    currentStage: {
        type: String,
        enum: validStages,
        default: STAGES.PROBLEM_UNDERSTANDING
    },

    understandingScore: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },

    approachScore: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },

    codingScore: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },

    attempts: {
        understanding: {
            type: Number,
            default: 0
        },

        approach: {
            type: Number,
            default: 0
        },

        coding: {
            type: Number,
            default: 0
        }
    },

    feedbackHistory: [
        {
            stage: String,
            score: Number,
            feedback: String,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],

    status: {
        type: String,
        enum: [
            'IN_PROGRESS',
            'COMPLETED',
            'ABANDONED'
        ],
        default: 'IN_PROGRESS'
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model(
    'InterviewSession',
    interviewSessionSchema
);