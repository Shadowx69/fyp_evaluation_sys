module.exports = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "command",
  commandRunner: {
    command: "cd tests && node runTests.js"
  },
  mutate: [
    "server/controllers/authController.js",
    "server/controllers/projectController.js",
    "server/controllers/scheduleController.js",
    "server/controllers/evaluationController.js",
    "server/models/User.js",
    "server/models/Project.js"
  ],
  coverageAnalysis: "off",
  timeoutMS: 120000,
  maxConcurrentTestRunners: 2,
  thresholds: {
    high: 80,
    low: 60,
    break: 50
  }
};
