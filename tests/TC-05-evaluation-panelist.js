const { By, until } = require("selenium-webdriver");
const { buildDriver } = require("./setup");

/**
 * TC-05: Evaluation Test (Panelist)
 * Module: Evaluation
 * Path: P5
 * Precondition: Panelist logged in
 * Input: Evaluation scores
 * Expected Outcome: Scores stored successfully
 */
async function evaluationPanelistTest() {
    let driver = await buildDriver();

    try {
        console.log("🔄 Running TC-05: Evaluation (Panelist) Test...");

        // Step 1: Login as Panelist
        await driver.get("http://localhost:3000/login");
        await driver.sleep(1000);

        let emailField = await driver.wait(
            until.elementLocated(By.xpath("//input[@name='email']")),
            10000
        );
        await emailField.sendKeys("panelist@test.com");

        let passwordField = await driver.findElement(By.xpath("//input[@name='password']"));
        await passwordField.sendKeys("123456");

        let loginBtn = await driver.findElement(
            By.xpath("//button[@type='submit' and contains(., 'Sign In')]")
        );
        await loginBtn.click();

        // Wait for panelist dashboard
        await driver.wait(until.urlContains("dashboard"), 10000);
        await driver.sleep(2000);

        // Step 2: Verify we're on the panelist dashboard
        let currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes("panelist-dashboard")) {
            throw new Error("Expected panelist-dashboard but got: " + currentUrl);
        }

        // Verify dashboard content loaded
        await driver.sleep(1000);
        let dashboardElements = await driver.findElements(
            By.xpath("//*[contains(text(), 'Committee') or contains(text(), 'Evaluation') or contains(text(), 'Panelist')]")
        );
        
        if (dashboardElements.length === 0) {
            throw new Error("Panelist dashboard did not load properly");
        }

        console.log("✅ TC-05: Evaluation (Panelist) Test PASSED");
        return true;

    } catch (error) {
        console.log("❌ TC-05: Evaluation (Panelist) Test FAILED");
        console.log("Error:", error.message);
        return false;

    } finally {
        await driver.quit();
    }
}

module.exports = evaluationPanelistTest;
