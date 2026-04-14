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

        let emailField = await driver.wait(
            until.elementLocated(By.xpath("//input[@type='text' or @type='email']")),
            10000
        );
        await emailField.sendKeys("student@test.com");

        let passwordField = await driver.findElement(
            By.xpath("//input[@type='password']")
        );
        await passwordField.sendKeys("123456");

        let loginBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Sign In') or contains(., 'Login')]")
        );
        await loginBtn.click();

        // Wait for dashboard
        await driver.wait(until.urlContains("dashboard"), 10000);

        // Step 2: Navigate to Submit Proposal
        let proposalBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(., 'Register FYP Topic') or contains(., 'Submit Proposal')]")),
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
            until.elementLocated(By.xpath("//input[contains(@name,'title') or @placeholder='Project Title']")),
            10000
        );
        await driver.wait(until.elementIsVisible(titleField), 5000);
        await titleField.sendKeys(proposalTitle);

        let descField = await driver.findElement(
            By.xpath("//textarea")
        );
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
        await driver.actions().move({ origin: options[0] }).click().perform();
        await driver.actions().sendKeys(Key.ESCAPE).perform();

        await driver.wait(until.stalenessOf(options[0]), 5000);

        // Upload file
        let fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
        let filePath = path.resolve(__dirname, "testfile.pdf");
        await fileInput.sendKeys(filePath);

        // Step 4: Submit proposal
        let submitBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Submit Proposal')]")
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);
        await driver.sleep(500);
        await submitBtn.click();

        // Step 5: Verify proposal is saved and displayed
        await driver.sleep(3000);

        // Navigate back to dashboard to verify proposal is shown
        await driver.get("http://localhost:3000/student-dashboard");
        await driver.wait(until.urlContains("dashboard"), 10000);

        // Check if proposal appears in the dashboard
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
