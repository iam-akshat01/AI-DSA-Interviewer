const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        strengths: {
            type: [String],
            default: []
        },

        weaknesses: {
            type: [String],
            default: []
        },

        interviewHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "InterviewSession"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "UserProfile",
    userProfileSchema
);