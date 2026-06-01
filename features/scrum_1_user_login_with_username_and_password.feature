@jira-SCRUM-1 @regression
Feature: User Login with Username and Password
  Users can log in using valid credentials and see error messages for invalid credentials

  Background:
    Given the user is on the login page

  @smoke @regression
  Scenario: Login succeeds with valid credentials
    When the user enters the username "student"
    And the user enters the password "Password123"
    And the user clicks the "Submit" button
    Then the page URL should contain "/logged-in-successfully"
    And the user should see the heading "Logged In Successfully"
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the "Log out" link should be visible

  @regression @negative
  Scenario: Login fails with invalid username
    When the user enters the username "invalidUser"
    And the user enters the password "Password123"
    And the user clicks the "Submit" button
    Then the error message "Your username is invalid!" should be displayed

  @regression @negative
  Scenario: Login fails with valid username but invalid password
    When the user enters the username "student"
    And the user enters the password "wrongPassword"
    And the user clicks the "Submit" button
    Then the error message "Your password is invalid!" should be displayed

  @regression
  Scenario: The password field masks input characters
    Then the password field should have the type "password"