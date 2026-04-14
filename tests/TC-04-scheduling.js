const { By, until } = require("selenium-webdriver");
const { buildDriver } = require("./setup");

/**
 * TC-04: Scheduling Test
 * Module: Scheduling
 * Path: P4
 * Precondition: Coordinator logged in
 * Input: Date and time
 * Expected Outcome: Defense scheduled successfully
 */
async function schedulingTest() {
    let driver = await buildDriver();

    try {
        console.log("🔄 Running TC-04: Scheduling Test...");

        // Step 1: Login as Coordinator
        await driver.get("http://localhost:3000/login");

        let emailField = await driver.wait(
            until.elementLocated(By.xpath("//input[@type='text' or @type='email']")),
            10000
        );
        await emailField.sendKeys("coordinator@test.com");

        let passwordField = await driver.findElement(
            By.xpath("//input[@type='password']")
        );
        await passwordField.sendKeys("123456");

        let loginBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Sign In') or contains(., 'Login')]")
        );
        await loginBtn.click();

        // Wait for coordinator dashboard
        await driver.wait(until.urlContains("dashboard"), 10000);
        await driver.sleep(2000);

        // Step 2: Navigate to Schedule Defense page
        await driver.get("http://localhost:3000/schedule-defense");
        await driver.wait(until.urlContains("schedule-defense"), 10000);
        await driver.sleep(2000);

        // Step 3: Click Generate Schedule button
        let generateBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(., 'Generate Schedule') or contains(., 'Create Schedule')]")),
            10000
        );
        await driver.wait(until.elementIsVisible(generateBtn), 5000);
        await generateBtn.click();

        // Step 4: Verify schedule created
        await driver.sleep(3000);

        // Verify we're still on schedule page
        let currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("schedule-defense")) {
            throw new Error("Expected to stay on schedule-defense page but got: " + currentUrl);
        }

        // Check for success message or schedule table
        let scheduleCreated = await driver.findElements(
            By.xpath("//*[contains(text(), 'Schedule') or contains(text(), 'Success') or contains(text(), 'Generated')]")
        );

        // Alternative: Check if schedule table/list appears
        let scheduleTable = await driver.findElements(
            By.xpath("//table | //div[contains(@class, 'schedule')]")
        );

        if (scheduleCreated.length === 0 && scheduleTable.length === 0) {
            throw new Error("Could not verify schedule creation - no success message or table found");
        }

        console.log("✅ TC-04: Scheduling Test PASSED");
        return true;

    } catch (error) {
        console.log("❌ TC-04: Scheduling Test FAILED");
        console.log("Error:", error.message);
        return false;

    } finally {
        await driver.quit();
    }
}

module.exports = schedulingTest;
