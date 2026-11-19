@jira-SCRUM-1 @regression
Feature: User login with username and password
  Registered users can access the application with their credentials.

  Background:
    Given the user is on the login page

  @smoke
  Scenario: Log in with valid credentials
    When the user enters username "student"
    And the user enters password "Password123"
    And the user submits the login form
    Then the page URL should contain "/logged-in-successfully/"
    And the user should see the heading "Logged In Successfully"
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the "Log out" link should be visible

  @negative
  Scenario: Reject an invalid username
    When the user enters username "invalid-user"
    And the user enters password "Password123"
    And the user submits the login form
    Then the error message "Your username is invalid!" should be displayed

  @negative
  Scenario: Reject an incorrect password for a valid username
    When the user enters username "student"
    And the user enters password "wrong-password"
    And the user submits the login form
    Then the error message "Your password is invalid!" should be displayed

  Scenario: Mask password input
    When the user enters password "Password123"
    Then the password field should have the type "password"
