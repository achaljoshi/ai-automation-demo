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
      "junit:test-results/cucumber-junit.xml",
      "html:test-results/cucumber-report.html"
    ],

    // Run sequentially — prevents race conditions when all scenarios hit the
    // same external site and avoids interleaved output in the pretty-formatter.
    parallel: 1,

    // Retry failed tests once
    retry: 1,
  },
};
