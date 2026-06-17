# AI DSA Interviewer - Architecture

## Project Philosophy

This project is not a chatbot.

The goal is to simulate a real DSA interview and evaluate the entire problem-solving process.

Instead of only checking whether code is correct, the system evaluates:

* Problem Understanding
* Constraint Recognition
* Approach Design
* Complexity Analysis
* Coding Ability
* Communication Skills

---

# High Level Flow

User
↓
Interview Controller
↓
Current Stage
↓
Relevant Agent
↓
LLM Evaluation
↓
Structured Result
↓
Controller Decision
↓
State Update
↓
Next Stage / Hint / Retry

---

# Core Design Principle

The Controller is the Judge.

Agents are Evaluators.

Agents never decide whether a candidate passes a stage.

Agents only return scores and feedback.

Example:

Agent Response

{
"score": 8,
"feedback": "Good understanding"
}

Controller Decision

if(score >= 7)
{
moveToNextStage();
}

This keeps stage transitions deterministic.

---

# Interview Stages

## Stage 1: Problem Understanding

Goal:

Determine whether the candidate understands:

* Problem Statement
* Inputs
* Outputs
* Constraints
* Edge Cases

Responsible Agent:

ProblemUnderstandingAgent

Output:

{
score,
feedback,
missedConstraints
}

Pass Condition:

score >= threshold

---

## Stage 2: Approach Discussion

Goal:

Evaluate:

* Algorithm Selection
* Complexity Analysis
* Optimization Awareness

Responsible Agent:

ApproachAgent

Output:

{
score,
feedback
}

Pass Condition:

score >= threshold

Special Feature:

Hint Generation

If candidate repeatedly fails:

Attempt 1
↓
Low Score

Attempt 2
↓
Low Score

Attempt 3
↓
Generate Hint

Example:

"Can a HashMap help reduce lookup time?"

Hints should guide but never reveal the full solution.

---

## Stage 3: Coding

Goal:

Collect candidate implementation.

Responsible Agent:

CodingAgent

Responsibilities:

* Store code
* Validate submission exists

No execution in V1.

---

## Stage 4: Code Review

Goal:

Evaluate:

* Correctness likelihood
* Complexity
* Readability
* Edge Cases

Responsible Agent:

CodeReviewAgent

Output:

{
score,
feedback
}

---

## Stage 5: Final Report

Goal:

Aggregate all previous evaluations.

Responsible Agent:

ReportAgent

Output:

Problem Understanding

Approach Design

Coding Quality

Communication

Overall Score

Strengths

Weaknesses

Recommendations

---

# Why Multiple Agents?

Instead of using one giant prompt, we are separating responsibilities.

Agents:

ProblemUnderstandingAgent

ApproachAgent

CodingAgent

CodeReviewAgent

ReportAgent

Benefits:

* Easier maintenance
* Easier debugging
* Better prompt separation
* Easier future upgrades

Example:

If communication scoring is added later, it belongs inside ProblemUnderstandingAgent.

If stress testing is added later, it belongs inside CodeReviewAgent.

No other components need modification.

---

# Interview Controller

The Interview Controller is the brain of the application.

Responsibilities:

* Manage current stage
* Call correct agent
* Store interview progress
* Trigger hints
* Decide stage transitions
* Generate final interview state

The controller owns all business logic.

---

# Session Lifecycle

Interview Starts
↓
Generate Question
↓
Understanding Stage
↓
Approach Stage
↓
Coding Stage
↓
Review Stage
↓
Report Generated
↓
Interview Complete

---

# Database Design

MongoDB is preferred because interview sessions naturally fit document structures.

Example:

{
sessionId: "...",

currentStage: "APPROACH",

topic: "Trees",

difficulty: "Medium",

understandingScore: 8,

approachScore: 7,

approachAttempts: 2,

code: "...",

report: {}
}

The database is the source of truth.

---

# Scoring Philosophy

Scores determine progression.

Example:

0 - 4

Stay in current stage.

5 - 6

Give Hint.
Stay in current stage.

7 - 10

Move to next stage.

This creates predictable interview behavior.

---

# V1 Scope

Included:

* Question Generation
* Problem Understanding
* Approach Evaluation
* Hint System
* Code Review
* Final Report
* Persistent Session State

Not Included:

* Voice Interviews
* Speech To Text
* Text To Speech
* Judge0
* Code Execution
* Stress Testing
* Adaptive Difficulty
* Multi-Agent Coordination Frameworks
* RAG
* LangGraph

Focus:

Prove the interview workflow works.

---

# V2 Roadmap

Potential Features:

* Voice Interview Mode
* Speech To Text
* Text To Speech
* Follow-up Questions
* Communication Scoring
* Interview History
* Analytics Dashboard

---

# V3 Roadmap

Potential Features:

* Judge0 Integration
* Code Execution
* Edge Case Testing
* Random Test Generation
* Stress Testing
* Oracle Solution Comparison
* Counterexample Discovery

---

# Long-Term Vision

Create an AI Interviewer capable of evaluating:

* Understanding
* Reasoning
* Communication
* Problem Solving
* Coding
* Optimization

rather than only evaluating the final answer.
