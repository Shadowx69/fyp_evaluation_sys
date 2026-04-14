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

        // Generate unique email for registration
        const timestamp = Date.now();
        const testEmail = `testuser${timestamp}@test.com`;
        const testPassword = "Test@123";
        const testName = "Test User";

        // Step 1: Navigate to Register page
        await driver.get("http://localhost:3000/register");
        await driver.wait(until.urlContains("register"), 10000);

        // Step 2: Fill registration form
        let nameField = await driver.wait(
            until.elementLocated(By.xpath("//input[@name='name' or @placeholder='Full Name']")),
            10000
        );
        await nameField.sendKeys(testName);

        let emailField = await driver.findElement(
            By.xpath("//input[@type='email' or @name='email']")
        );
        await emailField.sendKeys(testEmail);

        let passwordField = await driver.findElement(
            By.xpath("//input[@type='password' and (@name='password' or @placeholder='Password')]")
        );
        await passwordField.sendKeys(testPassword);

        // Select role (Student)
        let roleDropdown = await driver.findElement(
            By.xpath("//div[contains(@class,'MuiSelect-select')]")
        );
        await roleDropdown.click();

        await driver.sleep(500);

        let studentOption = await driver.wait(
            until.elementLocated(By.xpath("//li[@role='option' and contains(., 'Student')]")),
            5000
        );
        await studentOption.click();

        // Step 3: Submit registration
        let registerBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Register') or contains(., 'Sign Up')]")
        );
        await registerBtn.click();

        // Wait for registration success (redirect to login or dashboard)
        await driver.sleep(2000);

        // Step 4: Login with registered credentials
        let currentUrl = await driver.getCurrentUrl();
        
        if (!currentUrl.includes("login")) {
            await driver.get("http://localhost:3000/login");
        }

        await driver.wait(until.urlContains("login"), 10000);

        let loginEmailField = await driver.wait(
            until.elementLocated(By.xpath("//input[@type='text' or @type='email']")),
            10000
        );
        await loginEmailField.sendKeys(testEmail);

        let loginPasswordField = await driver.findElement(
            By.xpath("//input[@type='password']")
        );
        await loginPasswordField.sendKeys(testPassword);

        let loginBtn = await driver.findElement(
            By.xpath("//button[contains(., 'Sign In') or contains(., 'Login')]")
        );
        await loginBtn.click();

        // Step 5: Verify dashboard redirection
        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return (
                url.includes("student-dashboard") ||
                url.includes("coordinator-dashboard") ||
                url.includes("supervisor-dashboard") ||
                url.includes("panelist-dashboard") ||
                url.includes("dashboard")
            );
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
