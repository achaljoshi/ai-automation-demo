@jira-SCRUM-1 @regression
Feature: User login with username and password
  As a registered user, I want to log in with my username and password
  so that I can access the application.

  Background:
    Given the user is on the login page

  @smoke
  Scenario: Log in successfully with valid credentials
    When the user enters username "student"
    And the user enters password "Password123"
    And the user submits the login form
    Then the page URL should contain "/logged-in-successfully/"
    And the user should see the "Logged In Successfully" heading
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the "Log out" link should be visible

  @negative
  Scenario Outline: Reject invalid login credentials with the appropriate error
    When the user enters username "<username>"
    And the user enters password "<password>"
    And the user submits the login form
    Then the error message "<error>" should be displayed

    Examples:
      | username | password    | error                     |
      | invalid  | Password123 | Your username is invalid! |
      | student  | wrong       | Your password is invalid! |

  Scenario: Mask the password while it is entered
    When the user enters password "Password123"
    Then the password field should have the type "password"
