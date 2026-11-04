@api @jira-SCRUM-5 @regression
Feature: Check Demo Bank API health
  As an API consumer, I want to confirm the Demo Bank API is available before running tests.

  # TODO: The story does not specify an error contract for invalid delay values or unsupported methods; agree on one before adding a negative-response scenario.

  @smoke
  Scenario: The health endpoint reports the Demo Bank API is available
    When I send a GET request to "/health"
    Then the response status should be 200
    And the response header "Content-Type" should contain "application/json"
    And the Demo Bank health response header "X-Mock-API" should be exactly "QForge Demo Bank v1"
    And the response field "status" should be "ok"
    And the response field "service" should be "demo-bank"
    And the response field "version" should be "1.4.2"

  Scenario: The health endpoint remains available when a delay is requested
    When I send a GET request to "/health?delay=1500"
    Then the response status should be 200
    And the response time should be at least 1500 ms
