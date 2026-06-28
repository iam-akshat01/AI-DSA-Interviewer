const interviewService = require("../services/interviewService");

/**
 * Start a new interview
 */
const startInterview = async (req, res) => {

    try {

        const {
            userId,
            topic,
            difficulty
        } = req.body;

        /*
        Temporary question until PostgreSQL
        integration is completed.
        */

        const question = {

            id: "Q001",

            title: "Two Sum",

            description:
                "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",

            constraints: [

                "Exactly one valid answer exists.",

                "Do not use the same element twice."

            ],

            examples: [

                {

                    input:
                        "nums = [2,7,11,15], target = 9",

                    output:
                        "[0,1]"

                }

            ],

            difficulty

        };

        const interview =
            await interviewService.createInterview({

                userId,

                topic,

                difficulty,

                question

            });

        return res.status(201).json({

            success: true,

            interview

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Submit response for the current stage.
 */
const submitResponse = async (req, res) => {

    try {

        const {

            sessionId,

            response

        } = req.body;

        const result =
            await interviewService.submitResponse({

                sessionId,

                userResponse: response

            });

        return res.json({

            success: true,

            ...result

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/**
 * Get interview session.
 */
const getInterview = async (req, res) => {

    try {

        const { sessionId } =
            req.params;

        const interview =
            await interviewService.getInterview(
                sessionId
            );

        return res.json({

            success: true,

            interview

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    startInterview,

    submitResponse,

    getInterview

};