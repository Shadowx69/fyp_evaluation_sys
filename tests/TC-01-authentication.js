const { By, until } = require("selenium-webdriver");
const { buildDriver } = require("./setup");

/**
 * TC-01: Authentication Test
 * Module: Authentication
 * Path: P1
 * Precondition: User not registered
 * Input: Valid registration & login data
 * Expected Outcome: Successful registration and dashboard redirection
 */
async function authenticationTest() {
    let driver = await buildDriver();

    try {
        console.log("🔄 Running TC-01: Authentication Test...");

        // Generate unique credentials
        const timestamp = Date.now();
        const testEmail = `testuser${timestamp}@test.com`;
        const testPassword = "Test@123";
        const testName = "Test User";
        const testBuid = `TEST${timestamp}`;

        // Step 1: Navigate to Register page
        await driver.get("http://localhost:3000/register");
        await driver.wait(until.urlContains("register"), 10000);
        await driver.sleep(1000);

        // Step 2: Fill registration form
        let nameField = await driver.wait(
            until.elementLocated(By.xpath("//input[@name='fullName']")),
            10000
        );
        await nameField.sendKeys(testName);

        let buidField = await driver.findElement(By.xpath("//input[@name='buid']"));
        await buidField.sendKeys(testBuid);

        let emailField = await driver.findElement(By.xpath("//input[@name='email']"));
        await emailField.sendKeys(testEmail);

        let passwordField = await driver.findElement(By.xpath("//input[@name='password']"));
        await passwordField.sendKeys(testPassword);

        // Role is already set to 'student' by default, no need to change

        // Step 3: Submit registration
        let registerBtn = await driver.findElement(
            By.xpath("//button[@type='submit' and contains(., 'Register')]")
        );
        await registerBtn.click();

        // Step 4: Handle the alert popup
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        await alert.accept();

        // Wait for navigation to login page
        await driver.wait(until.urlContains("login"), 10000);
        await driver.sleep(1000);

        // Step 5: Login with registered credentials
        let loginEmailField = await driver.wait(
            until.elementLocated(By.xpath("//input[@name='email']")),
            10000
        );
        await loginEmailField.sendKeys(testEmail);

        let loginPasswordField = await driver.findElement(By.xpath("//input[@name='password']"));
        await loginPasswordField.sendKeys(testPassword);

        let loginBtn = await driver.findElement(
            By.xpath("//button[@type='submit' and contains(., 'Sign In')]")
        );
        await loginBtn.click();

        // Step 6: Verify dashboard redirection
        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url.includes("dashboard");
        }, 10000);

        console.log("✅ TC-01: Authentication Test PASSED");
        return true;

    } catch (error) {
        console.log("❌ TC-01: Authentication Test FAILED");
        console.log("Error:", error.message);
        return false;

    } finally {
        await driver.quit();
    }
}

module.exports = authenticationTest;
