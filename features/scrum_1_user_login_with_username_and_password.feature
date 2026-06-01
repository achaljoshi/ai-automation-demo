@jira-SCRUM-1 @regression
Feature: User Login with Username and Password
  As a registered user,
  I want to log in to the application using my username and password,
  so that I can access the application.

  Background:
    Given the user is on the login page

  @smoke @jira-SCRUM-1 @regression
  Scenario: Successful login with valid credentials
    When the user fills in "Username" with "student"
    And the user fills in "Password" with "Password123"
    And the user clicks the "Submit" button
    Then the page URL should contain "/logged-in-successfully"
    And the user should see the heading "Logged In Successfully"
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the "Log out" link should be visible

  @jira-SCRUM-1 @regression @negative
  Scenario: Invalid username
    When the user fills in "Username" with "invalid"
    And the user fills in "Password" with "Password123"
    And the user clicks the "Submit" button
    Then the error message "Your username is invalid!" should be displayed

  @jira-SCRUM-1 @regression @negative
  Scenario: Invalid password
    When the user fills in "Username" with "student"
    And the user fills in "Password" with "wrongpassword"
    And the user clicks the "Submit" button
    Then the error message "Your password is invalid!" should be displayed

  @jira-SCRUM-1 @regression
  Scenario: Password field should mask input characters
    Then the password field should have the type "password"