@jira-SCRUM-1 @regression
Feature: User login with username and password
  Registered users can access the application using valid credentials.

  Background:
    Given the user is on the login page

  @smoke
  Scenario: Login succeeds with valid credentials
    When the user enters username "student"
    And the user enters password "Password123"
    And the user submits the login form
    Then the page URL should contain "/logged-in-successfully"
    And the user should see the "Logged In Successfully" heading
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the "Log out" link should be visible

  @negative
  Scenario: Login fails with an invalid username
    When the user enters username "notstudent"
    And the user enters password "Password123"
    And the user submits the login form
    Then the error message "Your username is invalid!" should be displayed

  @negative
  Scenario: Login fails with a wrong password
    When the user enters username "student"
    And the user enters password "WrongPassword123"
    And the user submits the login form
    Then the error message "Your password is invalid!" should be displayed

  Scenario: Password entry is masked
    Then the password field should have the type "password"
