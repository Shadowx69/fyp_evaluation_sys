const authenticationTest = require("./TC-01-authentication");
const projectManagementTest = require("./TC-02-project-management");
const evaluationSupervisorTest = require("./TC-03-evaluation-supervisor");
const schedulingTest = require("./TC-04-scheduling");
const evaluationPanelistTest = require("./TC-05-evaluation-panelist");

async function runAllTests() {

    console.log("🚀 Running Selenium Test Suite...\n");
    console.log("=".repeat(60));

    let results = [];

    // TC-01: Authentication
    results.push({ 
        id: "TC-01", 
        name: "Authentication", 
        result: await authenticationTest() 
    });

    console.log("=".repeat(60));

    // TC-02: Project Management
    results.push({ 
        id: "TC-02", 
        name: "Project Management", 
        result: await projectManagementTest() 
    });

    console.log("=".repeat(60));

    // TC-03: Evaluation (Supervisor)
    results.push({ 
        id: "TC-03", 
        name: "Evaluation (Supervisor)", 
        result: await evaluationSupervisorTest() 
    });

    console.log("=".repeat(60));

    // TC-04: Scheduling
    results.push({ 
        id: "TC-04", 
        name: "Scheduling", 
        result: await schedulingTest() 
    });

    console.log("=".repeat(60));

    // TC-05: Evaluation (Panelist)
    results.push({ 
        id: "TC-05", 
        name: "Evaluation (Panelist)", 
        result: await evaluationPanelistTest() 
    });

    console.log("=".repeat(60));
    console.log("\n📊 Test Summary:");
    console.log("=".repeat(60));

    let passed = 0;

    results.forEach(test => {
        console.log(`${test.id} - ${test.name}: ${test.result ? "PASSED ✅" : "FAILED ❌"}`);
        if (test.result) passed++;
    });

    console.log("=".repeat(60));
    console.log(`\nTotal: ${passed}/${results.length} tests passed`);
    console.log("=".repeat(60));
}

runAllTests();
