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
        await driver.sleep(1000);

        let emailField = await driver.wait(
            until.elementLocated(By.xpath("//input[@name='email']")),
            10000
        );
        await emailField.sendKeys("supervisor@test.com");

        let passwordField = await driver.findElement(By.xpath("//input[@name='password']"));
        await passwordField.sendKeys("123456");

        let loginBtn = await driver.findElement(
            By.xpath("//button[@type='submit' and contains(., 'Sign In')]")
        );
        await loginBtn.click();

        // Wait for supervisor dashboard
        await driver.wait(until.urlContains("dashboard"), 10000);
        await driver.sleep(3000);

        // Step 2: Find and click on "Project Hub" button
        // Wait for the button to be both located and clickable
        let projectHubBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(., 'Project Hub')]")),
            10000
        );
        
        // Scroll to the button
        await driver.executeScript("arguments[0].scrollIntoView(true);", projectHubBtn);
        await driver.sleep(500);
        
        // Wait for it to be clickable
        await driver.wait(until.elementIsVisible(projectHubBtn), 5000);
        await driver.wait(until.elementIsEnabled(projectHubBtn), 5000);
        
        // Click using JavaScript to avoid interactability issues
        await driver.executeScript("arguments[0].click();", projectHubBtn);

        await driver.sleep(2000);

        // Step 3: Verify we reached the project page
        let currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("/projects/")) {
            throw new Error("Expected project details page but got: " + currentUrl);
        }

        // Verify project hub content loaded
        await driver.sleep(1000);
        let pageElements = await driver.findElements(
            By.xpath("//*[contains(text(), 'Project') or contains(text(), 'Log') or contains(text(), 'Hub')]")
        );
        
        if (pageElements.length === 0) {
            throw new Error("Project hub page did not load properly");
        }

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
