const { v4: uuidv4 } = require("uuid");
const interviewService = require("../services/interviewService");

const startInterview = async (req, res) => {
    try {

        const {
            userId,
            topic,
            difficulty
        } = req.body;

        // temporary question until PostgreSQL is ready
        const question = {
            id: "Q001",
            title: "Two Sum"
        };

        const interview =
            await interviewService.createInterview({
                sessionId: uuidv4(),
                userId,
                topic,
                difficulty,
                questionId: question.id
            });

        res.status(201).json({
            success: true,
            interview
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const problemUnderstandingAgent =
    require("../agents/problemUnderstandingAgent");

const submitUnderstanding =
    async (req, res) => {

        try {

            const {
                sessionId,
                response
            } = req.body;

            const interview =
                await interviewService
                    .getInterviewBySessionId(
                        sessionId
                    );

            const evaluation =
                await problemUnderstandingAgent(
                    interview.questionId,
                    [],
                    response
                );

            await interviewService.saveEvaluation(
                sessionId,
                STAGES.PROBLEM_UNDERSTANDING,
                evaluation.score,
                evaluation.screen_message
            );

            if (
                evaluation.score >= 7
            ) {

                await interviewService
                    .updateStage(
                        sessionId,
                        STAGES.APPROACH_DISCUSSION
                    );
            }

            res.json({
                success: true,
                evaluation
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    };

module.exports = {
    startInterview,
    submitUnderstanding
};