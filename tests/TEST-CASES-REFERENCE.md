# Test Cases Reference

## Overview
This document describes the 5 automated test cases for the FYP Management System.

## Test Cases

### TC-01: Authentication Test
- **Module**: Authentication
- **Path**: P1
- **Precondition**: User not registered
- **Input**: Valid registration & login data
- **Expected Outcome**: Successful registration and dashboard redirection
- **File**: `TC-01-authentication.js`

**Test Steps**:
1. Navigate to registration page
2. Fill registration form with unique credentials
3. Submit registration
4. Login with registered credentials
5. Verify dashboard redirection

---

### TC-02: Project Management Test
- **Module**: Project Management
- **Path**: P2
- **Precondition**: Student logged in
- **Input**: Proposal details
- **Expected Outcome**: Proposal saved and displayed
- **File**: `TC-02-project-management.js`

**Test Steps**:
1. Login as student
2. Navigate to submit proposal page
3. Fill proposal form (title, description, supervisor, file)
4. Submit proposal
5. Verify proposal is saved and displayed

---

### TC-03: Evaluation Test (Supervisor)
- **Module**: Evaluation
- **Path**: P3
- **Precondition**: Supervisor logged in
- **Input**: Evaluation scores
- **Expected Outcome**: Scores recorded successfully
- **File**: `TC-03-evaluation-supervisor.js`

**Test Steps**:
1. Login as supervisor
2. Navigate to project evaluation
3. Fill evaluation scores
4. Add comments
5. Submit evaluation

---

### TC-04: Scheduling Test
- **Module**: Scheduling
- **Path**: P4
- **Precondition**: Coordinator logged in
- **Input**: Date and time
- **Expected Outcome**: Defense scheduled successfully
- **File**: `TC-04-scheduling.js`

**Test Steps**:
1. Login as coordinator
2. Navigate to schedule defense page
3. Click generate schedule button
4. Verify schedule created

---

### TC-05: Evaluation Test (Panelist)
- **Module**: Evaluation
- **Path**: P5
- **Precondition**: Panelist logged in
- **Input**: Evaluation scores
- **Expected Outcome**: Scores stored successfully
- **File**: `TC-05-evaluation-panelist.js`

**Test Steps**:
1. Login as panelist
2. Navigate to project evaluation
3. Fill evaluation scores
4. Add comments
5. Submit evaluation

---

## Running Tests

### Run All Tests
```bash
cd tests
node runTests.js
```

### Run Individual Test
```bash
cd tests
node TC-01-authentication.js
node TC-02-project-management.js
node TC-03-evaluation-supervisor.js
node TC-04-scheduling.js
node TC-05-evaluation-panelist.js
```

## Test Credentials

### Student
- Email: `student@test.com`
- Password: `123456`

### Supervisor
- Email: `supervisor@test.com`
- Password: `123456`

### Coordinator
- Email: `coordinator@test.com`
- Password: `123456`

### Panelist
- Email: `panelist@test.com`
- Password: `123456`

## Prerequisites

1. Server must be running on `http://localhost:5000`
2. Client must be running on `http://localhost:3000`
3. MongoDB must be connected
4. Test users must exist in database

## Notes

- All tests run in headless Chrome mode
- Tests use Selenium WebDriver 4.41.0
- ChromeDriver version 146.0.6
- Each test is independent and can run separately
