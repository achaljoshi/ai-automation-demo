@api @jira-SCRUM-5 @regression
Feature: Demo Bank API health check
  As an API consumer, I want to check that the Demo Bank API is available before running tests.

  @smoke
  Scenario: Health check reports that the service is available
    When I send a GET request to "/health"
    Then the response status should be 200
    And the response header "Content-Type" should contain "application/json"
    And the response header "X-Mock-API" should contain "QForge Demo Bank v1"
    And the response field "status" should be "ok"
    And the response field "service" should be "demo-bank"
    And the response field "version" should be "1.4.2"

  @negative
  Scenario: A delayed health check does not respond prematurely
    When I send a GET request to "/health?delay=1500"
    Then the response status should be 200
    And the response time should be at least 1500 ms
