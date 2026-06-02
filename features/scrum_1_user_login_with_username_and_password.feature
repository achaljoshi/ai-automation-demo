@jira-SCRUM-1 @regression
Feature: User Login with Username and Password
  As a registered user,
  I want to log in to the application using my username and password,
  So that I can access the restricted areas of the application.

  Background:
    Given the user is on the login page

  @smoke @jira-SCRUM-1 @regression
  Scenario: Login with valid credentials
    When the user enters "student" as the username
    And the user enters "Password123" as the password
    And the user clicks the "Submit" button
    Then the page URL should contain "/logged-in-successfully"
    And the user should see the heading "Logged In Successfully"
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the log out link should be visible

  @negative @jira-SCRUM-1 @regression
  Scenario: Login fails with invalid username
    When the user enters "invaliduser" as the username
    And the user enters "Password123" as the password
    And the user clicks the "Submit" button
    Then the error message "Your username is invalid!" should be displayed

  @negative @jira-SCRUM-1 @regression
  Scenario: Login fails with wrong password
    When the user enters "student" as the username
    And the user enters "wrongpassword" as the password
    And the user clicks the "Submit" button
    Then the error message "Your password is invalid!" should be displayed

  @jira-SCRUM-1 @regression
  Scenario: Password field masks the input
    Then the password field should have the type "password"