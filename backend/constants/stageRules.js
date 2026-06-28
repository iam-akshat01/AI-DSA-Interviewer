const STAGES = require("./stages");

module.exports = {

    [STAGES.PROBLEM_UNDERSTANDING]: {

        nextStage:
            STAGES.APPROACH_DISCUSSION,

        loop: false

    },

    [STAGES.APPROACH_DISCUSSION]: {

        nextStage:
            STAGES.CODING,

        passScore: 7,

        maxAttempts: 3,

        loop: true

    },

    [STAGES.CODING]: {

        nextStage:
            STAGES.CODE_REVIEW,

        loop: false

    },

    [STAGES.CODE_REVIEW]: {

        nextStage:
            STAGES.FINAL_REPORT,

        loop: true

    },

    [STAGES.FINAL_REPORT]: {

        nextStage: null,

        loop: false

    }

};