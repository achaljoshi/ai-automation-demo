@jira-SCRUM-1 @regression
Feature: User Login with Username and Password
  As a registered user,
  I want to log in to the application using my username and password,
  So that I can access the application.

  Background:
    Given the user is on the login page

  @jira-SCRUM-1 @smoke @regression
  Scenario: Successful login with valid credentials
    When the user enters the username "student" and the password "Password123"
    And the user clicks on the "Submit" button
    Then the page URL should contain "/logged-in-successfully"
    And the user should see the heading "Logged In Successfully"
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the user should see the "Log out" link

  @jira-SCRUM-1 @regression @negative
  Scenario: Invalid username
    When the user enters the username "invaliduser" and the password "Password123"
    And the user clicks on the "Submit" button
    Then the error message "Your username is invalid!" should be displayed

  @jira-SCRUM-1 @regression @negative
  Scenario: Valid username with invalid password
    When the user enters the username "student" and the password "WrongPassword"
    And the user clicks on the "Submit" button
    Then the error message "Your password is invalid!" should be displayed

  @jira-SCRUM-1 @regression
  Scenario: Password field masking
    Then the password field should have the type "password"