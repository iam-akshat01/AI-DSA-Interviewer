# AI DSA Interviewer

An AI-powered technical interview simulator that evaluates the complete problem-solving process instead of only checking code correctness.

## Vision

The goal of this project is to simulate a real DSA interview.

The system evaluates:

* Problem Understanding
* Constraint Recognition
* Approach Discussion
* Coding Ability
* Code Quality
* Communication Skills

rather than simply checking whether the final solution is correct.

---

## V1 Features

### Problem Understanding Stage

Candidate explains:

* Problem statement
* Constraints
* Edge cases

The AI evaluates understanding and provides feedback.

---

### Approach Discussion Stage

Candidate explains:

* Algorithm
* Time Complexity
* Space Complexity

The AI evaluates the reasoning process.

---

### Hint System

If the candidate repeatedly struggles with an approach, the interviewer provides hints without revealing the complete solution.

---

### Coding Stage

Candidate submits code.

---

### Code Review Stage

The AI reviews:

* Correctness likelihood
* Complexity
* Readability
* Edge cases

---

### Final Interview Report

The system generates:

* Problem Understanding Score
* Approach Score
* Coding Score
* Communication Score
* Overall Rating

---

## Architecture

The project follows a stage-based interview workflow.

Question
↓
Problem Understanding
↓
Approach Discussion
↓
Coding
↓
Code Review
↓
Final Report

Each stage is handled by a dedicated agent.

---

## Agents

### ProblemUnderstandingAgent

Evaluates:

* Understanding
* Constraints
* Edge Cases

### ApproachAgent

Evaluates:

* Algorithm Choice
* Complexity Analysis
* Optimization Awareness

### CodingAgent

Handles code submission workflow.

### CodeReviewAgent

Reviews implementation quality.

### ReportAgent

Generates final interview feedback.

---

## Controller

The Interview Controller manages:

* Current Stage
* Session State
* Stage Transitions
* Hint Generation
* Interview Progress

The controller is the judge.

Agents only evaluate.

---

## Tech Stack

Backend:

* Node.js
* Express

Database:

* MongoDB

LLM:

* Gemini API

Frontend:

* HTML
* CSS
* JavaScript

---

## Future Roadmap

### V2

* Voice Interviews
* Speech-to-Text
* Text-to-Speech
* Adaptive Difficulty
* Follow-Up Questions
* Interview Analytics

### V3

* Code Execution
* Judge0 Integration
* Stress Testing
* Counterexample Discovery
* Random Test Generation
* Oracle Solution Comparison

---

## Long-Term Goal

Create an AI interviewer capable of evaluating the complete technical interview process rather than only the final code submission.
