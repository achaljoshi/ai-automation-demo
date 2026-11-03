@api @example
Feature: Demo Bank API — scaffold check
  Proves the API support works: no browser, Playwright request against the QForge
  Demo Bank mock API (API_BASE_URL overrides the base URL).

  Scenario: The Demo Bank API is up
    When I send a GET request to "/health"
    Then the response status should be 200
    And the response should be JSON
    And the response field "status" should be "ok"
