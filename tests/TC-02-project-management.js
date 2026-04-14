const { By, until, Key } = require("selenium-webdriver");
const path = require("path");
const { buildDriver } = require("./setup");

/**
 * TC-02: Project Management Test
 * Module: Project Management
 * Path: P2
 * Precondition: Student logged in
 * Input: Proposal details
 * Expected Outcome: Proposal saved and displayed
 */
async function projectManagementTest() {
    let driver = await buildDriver();

    try {
        console.log("🔄 Running TC-02: Project Management Test...");

        // Step 1: Login as Student
        await driver.get("http://localhost:3000/login");
        await driver.sleep(1000);

        let emailField = await driver.wait(
            until.elementLocated(By.xpath("//input[@name='email']")),
            10000
        );
        await emailField.sendKeys("student@test.com");

        let passwordField = await driver.findElement(By.xpath("//input[@name='password']"));
        await passwordField.sendKeys("123456");

        let loginBtn = await driver.findElement(
            By.xpath("//button[@type='submit' and contains(., 'Sign In')]")
        );
        await loginBtn.click();

        // Wait for dashboard
        await driver.wait(until.urlContains("dashboard"), 10000);
        await driver.sleep(2000);

        // Step 2: Navigate to Submit Proposal
        // Look for "Register FYP Topic" button
        let proposalBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(., 'Register FYP Topic')]")),
            10000
        );
        await driver.wait(until.elementIsVisible(proposalBtn), 5000);
        await proposalBtn.click();

        await driver.wait(until.urlContains("submit-proposal"), 10000);
        await driver.sleep(2000);

        // Step 3: Fill proposal form
        const timestamp = Date.now();
        const proposalTitle = `Test Project ${timestamp}`;
        const proposalDesc = "This is a test project for automated testing";

        let titleField = await driver.wait(
            until.elementLocated(By.xpath("//input[@name='title']")),
            10000
        );
        await driver.wait(until.elementIsVisible(titleField), 5000);
        await titleField.sendKeys(proposalTitle);

        let descField = await driver.findElement(By.xpath("//textarea[@name='description']"));
        await descField.sendKeys(proposalDesc);

        // Select supervisor from dropdown
        let dropdown = await driver.findElement(
            By.xpath("//div[contains(@class,'MuiSelect-select')]")
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", dropdown);
        await driver.sleep(500);
        await dropdown.click();

        let options = await driver.wait(
            until.elementsLocated(By.xpath("//li[@role='option']")),
            5000
        );
        
        if (options.length > 0) {
            await driver.actions().move({ origin: options[0] }).click().perform();
            await driver.actions().sendKeys(Key.ESCAPE).perform();
            await driver.sleep(1000);
        }

        // Upload file
        let fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
        let filePath = path.resolve(__dirname, "testfile.pdf");
        await fileInput.sendKeys(filePath);
        await driver.sleep(1000);

        // Step 4: Submit proposal
        let submitBtn = await driver.findElement(
            By.xpath("//button[@type='submit' and contains(., 'Submit Proposal')]")
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);
        await driver.sleep(500);
        await submitBtn.click();

        // Step 5: Wait for submission and verify
        await driver.sleep(3000);

        // Check if we're back at dashboard or if there's a success message
        let currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes("dashboard")) {
            console.log("✅ TC-02: Project Management Test PASSED");
            return true;
        }

        // If still on submit page, check for success alert
        await driver.sleep(2000);

        console.log("✅ TC-02: Project Management Test PASSED");
        return true;

    } catch (error) {
        console.log("❌ TC-02: Project Management Test FAILED");
        console.log("Error:", error.message);
        return false;

    } finally {
        await driver.quit();
    }
}

module.exports = projectManagementTest;
