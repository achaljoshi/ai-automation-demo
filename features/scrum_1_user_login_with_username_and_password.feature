@jira-SCRUM-1 @regression
Feature: User login with username and password
  As a registered user, I want to log in to access the application.

  Background:
    Given the user is on the login page

  @smoke
  Scenario: Login succeeds with valid credentials
    When the user enters username "student"
    And the user enters password "Password123"
    And the user submits the login form
    Then the page URL should contain "/logged-in-successfully/"
    And the heading "Logged In Successfully" should be visible
    And the message "Congratulations student. You successfully logged in!" should be visible
    And the "Log out" link should be visible

  @negative
  Scenario: Login rejects an invalid username
    When the user enters username "not-student"
    And the user enters password "Password123"
    And the user submits the login form
    Then the error message "Your username is invalid!" should be displayed

  @negative
  Scenario: Login rejects an incorrect password for a valid username
    When the user enters username "student"
    And the user enters password "wrong-password"
    And the user submits the login form
    Then the error message "Your password is invalid!" should be displayed

  Scenario: Password entry remains masked
    When the user enters password "Password123"
    Then the password field should have the type "password"
