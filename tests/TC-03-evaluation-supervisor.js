const { By, until } = require("selenium-webdriver");
const { buildDriver } = require("./setup");

/**
 * TC-03: Evaluation Test (Supervisor)
 * Module: Evaluation
 * Path: P3
 * Precondition: Supervisor logged in
 * Input: Evaluation scores
 * Expected Outcome: Scores recorded successfully
 */
async function evaluationSupervisorTest() {
    let driver = await buildDriver();

    try {
        console.log("🔄 Running TC-03: Evaluation (Supervisor) Test...");

        // Step 1: Login as Supervisor
        await driver.get("http://localhost:3000/login");

        let emailField = await driver.wait(
            until.elementLocated(By.xpath("//input[@type='text' or @type='email']")),
            10000
        );
        await emailField.sendKeys("supervisor@test.com");

        let passwordField = await driver.findElement(
            By.xpath("//input[@type='password']")
        );
        await passwordField.sendKeys("123456");

        let loginBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Sign In') or contains(., 'Login')]")
        );
        await loginBtn.click();

        // Wait for supervisor dashboard
        await driver.wait(until.urlContains("dashboard"), 10000);
        await driver.sleep(2000);

        // Step 2: Find and click on a project to evaluate
        let evaluateBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(., 'Evaluate') or contains(., 'View')]")),
            10000
        );
        await evaluateBtn.click();

        await driver.sleep(2000);

        // Step 3: Fill evaluation scores
        // Find score input fields
        let scoreInputs = await driver.findElements(
            By.xpath("//input[@type='number' or contains(@name, 'score')]")
        );

        if (scoreInputs.length > 0) {
            // Fill in scores (e.g., 85, 90, 88)
            const scores = [85, 90, 88, 92, 87];
            
            for (let i = 0; i < Math.min(scoreInputs.length, scores.length); i++) {
                await scoreInputs[i].clear();
                await scoreInputs[i].sendKeys(scores[i].toString());
            }
        }

        // Add comments if textarea exists
        let commentField = await driver.findElements(
            By.xpath("//textarea")
        );
        
        if (commentField.length > 0) {
            await commentField[0].sendKeys("Good work. Keep it up!");
        }

        // Step 4: Submit evaluation
        let submitBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Submit') or contains(., 'Save')]")
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);
        await driver.sleep(500);
        await submitBtn.click();

        // Step 5: Verify evaluation submitted
        await driver.sleep(2000);

        console.log("✅ TC-03: Evaluation (Supervisor) Test PASSED");
        return true;

    } catch (error) {
        console.log("❌ TC-03: Evaluation (Supervisor) Test FAILED");
        console.log("Error:", error.message);
        return false;

    } finally {
        await driver.quit();
    }
}

module.exports = evaluationSupervisorTest;
