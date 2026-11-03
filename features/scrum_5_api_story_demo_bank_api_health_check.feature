@api @jira-SCRUM-5 @regression
Feature: Demo Bank API health check
  As an API consumer, I can check that the Demo Bank API is available before running tests.

  # TODO: Specify the expected response for an unavailable or invalid health endpoint so a negative scenario can be added without assuming an undocumented contract.

  @smoke
  Scenario: The health endpoint reports a healthy service
    When I send a GET request to "/health"
    Then the response status should be 200
    And the response header "Content-Type" should contain "application/json"
    And the Demo Bank health response header "X-Mock-API" should be "QForge Demo Bank v1"
    And the response should be JSON
    And the response field "status" should be "ok"
    And the response field "service" should be "demo-bank"
    And the response field "version" should be "1.4.2"

  Scenario: A delayed health check remains healthy after the requested delay
    When I send a GET request to "/health?delay=1500"
    Then the response status should be 200
    And the response time should be at least 1500 ms
