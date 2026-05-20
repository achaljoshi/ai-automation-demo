@smoke @example
Feature: Example — Verify Pipeline Setup
  A simple smoke test to confirm the automation repo is wired up correctly.

  Scenario: Pipeline health check
    Given the automation pipeline is configured
    Then the test suite should be ready to run
