/**
 * Normalizes evaluation returned by different agents
 * into a common structure before storing.
 */
const normalizeEvaluation = (
    stage,
    evaluation
) => {

    return {

        stage,

        score:
            evaluation.score ?? null,

        feedback:
            evaluation.screen_message ?? "",

        missedConstraints:
            evaluation.missed_constraints ?? [],

        metadata: {
            ...evaluation
        },

        timestamp:
            new Date()

    };

};

/**
 * Appends evaluation to evaluation history.
 */
const appendEvaluation = (
    session,
    stage,
    evaluation
) => {

    const normalizedEvaluation =
        normalizeEvaluation(
            stage,
            evaluation
        );

    session.evaluationHistory.push(
        normalizedEvaluation
    );

};

/**
 * Returns all evaluations.
 */
const getEvaluationHistory = (
    session
) => {

    return session.evaluationHistory;

};

module.exports = {

    appendEvaluation,

    getEvaluationHistory

};