module.exports = {
  default: {
    // Where to find feature files
    paths: ["features/**/*.feature"],

    // Load step definitions and support files
    require: [
      "support/**/*.ts",
      "step_definitions/**/*.ts"
    ],
    requireModule: ["ts-node/register"],

    // Reporters
    format: [
      "progress-bar",
      "@cucumber/pretty-formatter",
      "junit:test-results/cucumber-junit.xml"
    ],

    // Parallel execution (set to 1 for debugging)
    parallel: 2,

    // Retry failed tests once
    retry: 1,
  },
};
