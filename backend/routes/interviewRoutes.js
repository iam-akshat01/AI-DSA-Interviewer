const express = require("express");

const router = express.Router();

const {
    startInterview,
    submitUnderstanding
} = require(
    "../controllers/interviewController"
);

router.post(
    "/start", startInterview
);

router.post(
    "/submit-understanding",
    submitUnderstanding
);

module.exports = router;