const express = require("express");

const router = express.Router();

const {
    startInterview,
    submitResponse,
    getInterview
} = require("../controllers/interviewController");

/*
|--------------------------------------------------------------------------
| Interview Routes
|--------------------------------------------------------------------------
*/

/**
 * Start a new interview
 */
router.post(
    "/start",
    startInterview
);

/**
 * Submit response for the current stage
 */
router.post(
    "/submit",
    submitResponse
);

/**
 * Get interview session
 */
router.get(
    "/:sessionId",
    getInterview
);

module.exports = router;