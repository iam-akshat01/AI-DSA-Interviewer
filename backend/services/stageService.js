const STAGES = require("../constants/stages");
const stageRules = require("../constants/stageRules");

/**
 * Returns stage configuration.
 */
const getStageRule = (stage) => {
    return stageRules[stage];
};

/**
 * Returns next stage.
 */
const getNextStage = (stage) => {
    return stageRules[stage].nextStage;
};

/**
 * Returns whether current stage supports looping.
 */
const isLoopStage = (stage) => {
    return stageRules[stage].loop;
};

/**
 * Increments attempt counter for looping stages.
 */
const incrementAttempts = (
    session,
    stage
) => {

    switch (stage) {

        case STAGES.APPROACH_DISCUSSION:
            session.attempts.approach++;
            break;

        case STAGES.CODE_REVIEW:
            session.attempts.review++;
            break;

        default:
            break;
    }

};

/**
 * Returns number of attempts made.
 */
const getAttempts = (
    session,
    stage
) => {

    switch (stage) {

        case STAGES.APPROACH_DISCUSSION:
            return session.attempts.approach;

        default:
            return 0;
    }

};

/**
 * Determines whether hint should be generated.
 */
const shouldGenerateHint = (
    session,
    stage
) => {

    const rule =
        stageRules[stage];

    if (!rule.loop) {

        return false;

    }

    return (
        getAttempts(
            session,
            stage
        ) >= 2
    );

};

/**
 * Determines whether candidate should
 * move to next stage.
 */
const shouldAdvanceStage = (
    session,
    stage,
    evaluation
) => {

    const rule = stageRules[stage];

    /*
    ---------------------------------------
    Non-loop stages always advance.
    ---------------------------------------
    */

    if (!rule.loop) {
        return true;
    }

    /*
    ---------------------------------------
    Approach Discussion
    ---------------------------------------
    */

    if (stage === STAGES.APPROACH_DISCUSSION) {

        if (evaluation.score >= rule.passScore) {
            return true;
        }

        return (
            getAttempts(
                session,
                stage
            ) >= rule.maxAttempts
        );

    }

    /*
    ---------------------------------------
    Code Review
    ---------------------------------------
    */

    if (stage === STAGES.CODE_REVIEW) {

        return evaluation.interview_done === true;

    }

};

module.exports = {

    getStageRule,

    getNextStage,

    isLoopStage,

    incrementAttempts,

    getAttempts,

    shouldGenerateHint,

    shouldAdvanceStage

};