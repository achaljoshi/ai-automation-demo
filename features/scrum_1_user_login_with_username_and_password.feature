@jira-SCRUM-1 @regression
Feature: User Login with Username and Password
  As a registered user, I want to log in to the application using my username
  and password so that I can access the application.

  Background:
    Given the user is on the login page

  @smoke @regression
  Scenario: Successful login with valid credentials
    When the user enters "student" as the username
    And the user enters "Password123" as the password
    And the user clicks the "Submit" button
    Then the page URL should contain "/logged-in-successfully"
    And the user should see the heading "Logged In Successfully"
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the "Log out" link should be visible

  @regression @negative
  Scenario: Login fails with invalid username
    When the user enters "invalidUser" as the username
    And the user enters "Password123" as the password
    And the user clicks the "Submit" button
    Then the error message "Your username is invalid!" should be displayed

  @regression @negative
  Scenario: Login fails with valid username and incorrect password
    When the user enters "student" as the username
    And the user enters "WrongPassword" as the password
    And the user clicks the "Submit" button
    Then the error message "Your password is invalid!" should be displayed

  @regression
  Scenario: Password field masks input characters
    Then the password field should have the type "password"