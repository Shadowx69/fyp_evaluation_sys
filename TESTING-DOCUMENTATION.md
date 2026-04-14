# Testing Documentation - FYP Evaluation System

## Overview

This document describes the comprehensive testing strategy for the FYP Evaluation System, including end-to-end tests and mutation testing for confidence-based evaluation.

## Test Suite Structure

### Test Cases

| Test ID | Module | Description | Status |
|---------|--------|-------------|--------|
| TC-01 | Authentication | User registration and login | ✅ Passing |
| TC-02 | Project Management | Proposal submission | ✅ Passing |
| TC-03 | Evaluation (Supervisor) | Supervisor evaluation access | ✅ Passing |
| TC-04 | Scheduling | Defense scheduling | ✅ Passing |
| TC-05 | Evaluation (Panelist) | Panelist evaluation access | ✅ Passing |

## Running Tests

### Prerequisites

1. **Install Dependencies:**
   ```bash
   # Server dependencies
   cd server
   npm install
   
   # Client dependencies
   cd ../client
   npm install
   
   # Test dependencies
   cd ../tests
   npm install
   
   # Mutation testing dependencies (root)
   cd ..
   npm install
   ```

2. **Seed Database:**
   ```bash
   cd server
   node seedTestData.js
   ```

### Running E2E Tests

**Start Services:**
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start

# Terminal 3 - Tests
cd tests
node runTests.js
```

**Run Individual Tests:**
```bash
cd tests
node TC-01-authentication.js
node TC-02-project-management.js
node TC-03-evaluation-supervisor.js
node TC-04-scheduling.js
node TC-05-evaluation-panelist.js
```

### Running Mutation Tests

**Install Stryker (if not installed):**
```bash
npm install
```

**Run Mutation Testing:**
```bash
npm run test:mutation
```

**View Results:**
- HTML Report: `reports/mutation/html/index.html`
- Console output shows mutation score

## Mutation Testing Explained

### What is Mutation Testing?

Mutation testing evaluates test quality by:
1. Creating "mutants" (modified versions of code)
2. Running tests against each mutant
3. Checking if tests detect the changes

### Mutation Score

```
Mutation Score = (Killed Mutants / Total Mutants) × 100%
```

**Our Target:** > 70% mutation score

### Types of Mutations Tested

1. **Arithmetic Operators**
   - `+` → `-`
   - `*` → `/`
   - `++` → `--`

2. **Relational Operators**
   - `>` → `>=`
   - `<` → `<=`
   - `==` → `!=`

3. **Logical Operators**
   - `&&` → `||`
   - `!` → (removed)

4. **Conditional Boundaries**
   - `if (x > 5)` → `if (x >= 5)`
   - `if (x < 10)` → `if (x <= 10)`

5. **Return Values**
   - `return true` → `return false`
   - `return value` → `return null`

6. **Statement Removal**
   - Remove function calls
   - Remove assignments

## Test Confidence Levels

### High Confidence Tests (80-100%)

**TC-01: Authentication**
- ✅ Validates user registration
- ✅ Checks password hashing
- ✅ Verifies JWT token generation
- ✅ Confirms role-based redirect
- ✅ Tests database persistence

**TC-02: Project Management**
- ✅ Validates form submission
- ✅ Checks file upload
- ✅ Verifies supervisor assignment
- ✅ Confirms database save
- ✅ Tests project creation workflow

### Medium Confidence Tests (60-79%)

**TC-03: Evaluation (Supervisor)**
- ✅ Validates supervisor login
- ✅ Checks project access
- ✅ Verifies navigation
- ⚠️ Limited evaluation form testing

**TC-04: Scheduling**
- ✅ Validates coordinator access
- ✅ Checks schedule generation
- ✅ Verifies button functionality
- ⚠️ Limited schedule validation

**TC-05: Evaluation (Panelist)**
- ✅ Validates panelist login
- ✅ Checks dashboard access
- ✅ Verifies interface loading
- ⚠️ Limited evaluation testing

## Mutation Testing Results

### Expected Mutation Scores

| Component | Expected Score | Confidence |
|-----------|---------------|------------|
| Authentication | 85% | High |
| Project Management | 80% | High |
| Evaluation | 70% | Medium |
| Scheduling | 75% | Medium |
| Overall | 77% | High |

### Sample Mutations Caught

**Example 1: Password Validation**
```javascript
// Original Code
if (password.length < 6) {
    return res.status(400).json({ message: 'Password too short' });
}

// Mutation 1: Change boundary
if (password.length < 4) { // MUTANT - Should be caught
    return res.status(400).json({ message: 'Password too short' });
}

// Result: TC-01 FAILS ✅ (Mutation Killed)
```

**Example 2: Project Status**
```javascript
// Original Code
project.status = 'registered';

// Mutation 2: Change value
project.status = 'approved'; // MUTANT - Should be caught

// Result: TC-02 FAILS ✅ (Mutation Killed)
```

**Example 3: Authorization Check**
```javascript
// Original Code
if (project.supervisorId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
}

// Mutation 3: Change operator
if (project.supervisorId.toString() === req.user.id) { // MUTANT
    return res.status(403).json({ message: 'Not authorized' });
}

// Result: TC-03 FAILS ✅ (Mutation Killed)
```

## CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on every push:
1. Setup Node.js environment
2. Install dependencies
3. Seed test database
4. Start backend server
5. Start frontend client
6. Run all test cases
7. Report results

**View Results:** 
https://github.com/Shadowx69/fyp_evaluation_sys/actions

## Test Maintenance

### Adding New Tests

1. Create test file: `tests/TC-XX-test-name.js`
2. Follow existing test structure
3. Add to `runTests.js`
4. Update documentation

### Updating Tests

When code changes:
1. Run tests locally
2. Fix failing tests
3. Verify mutation score
4. Commit changes

## Evaluation Criteria

### For Teacher Evaluation

**Test Quality Metrics:**
- ✅ All tests pass without mutations
- ✅ Tests fail when mutations introduced
- ✅ High mutation score (> 70%)
- ✅ Good code coverage
- ✅ Independent test cases
- ✅ Repeatable results

**Demonstration Steps:**

1. **Show Passing Tests:**
   ```bash
   npm test
   ```

2. **Introduce Manual Mutation:**
   ```javascript
   // Example: Change in authController.js
   const hashedPassword = password; // Remove hashing
   ```

3. **Show Failing Tests:**
   ```bash
   npm test
   ```

4. **Revert Mutation:**
   ```javascript
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

5. **Show Passing Tests Again:**
   ```bash
   npm test
   ```

6. **Run Automated Mutation Testing:**
   ```bash
   npm run test:mutation
   ```

## Troubleshooting

### Common Issues

**Issue 1: Tests timeout**
- Solution: Increase timeout in test files
- Check if servers are running

**Issue 2: Database connection fails**
- Solution: Verify MongoDB Atlas connection
- Check .env file configuration

**Issue 3: Mutation testing takes too long**
- Solution: Reduce mutated files in stryker.conf.js
- Increase maxConcurrentTestRunners

**Issue 4: ChromeDriver errors**
- Solution: Update chromedriver version
- Check Chrome browser version

## Conclusion

This test suite provides:
- ✅ Comprehensive E2E testing
- ✅ High confidence in code quality
- ✅ Mutation testing capability
- ✅ CI/CD integration
- ✅ Easy evaluation demonstration

**Mutation Score Target:** > 70%
**Current Test Coverage:** 5 critical user workflows
**Confidence Level:** High
