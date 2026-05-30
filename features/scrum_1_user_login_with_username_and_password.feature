@jira-SCRUM-1 @regression
Feature: User Login with Username and Password
  As a registered user, I want to log in to the application using my username
  and password so that I can access the application.

  Background:
    Given the user is on the login page

  @jira-SCRUM-1 @smoke @regression
  Scenario: Successful login with valid username and password
    When the user enters "student" as username
    And the user enters "Password123" as password
    And the user clicks the "Submit" button
    Then the browser navigates to "/logged-in-successfully/"
    And the heading "Logged In Successfully" is visible
    And the message "Congratulations student. You successfully logged in!" is visible
    And the "Log out" link is visible

  @jira-SCRUM-1 @negative @regression
  Scenario: Login fails with invalid username
    When the user enters "invalid_user" as username
    And the user enters "Password123" as password
    And the user clicks the "Submit" button
    Then the error message "Your username is invalid!" should be displayed

  @jira-SCRUM-1 @negative @regression
  Scenario: Login fails with incorrect password
    When the user enters "student" as username
    And the user enters "wrongPassword" as password
    And the user clicks the "Submit" button
    Then the error message "Your password is invalid!" should be displayed

  @jira-SCRUM-1 @regression
  Scenario: Password field should mask input characters
    Then the "Password" field should mask the input characters