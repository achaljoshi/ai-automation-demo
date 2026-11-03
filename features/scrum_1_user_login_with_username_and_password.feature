@jira-SCRUM-1 @regression
Feature: User login with username and password
  As a registered user, I want to log in so that I can access the application.

  Background:
    Given the user is on the login page

  @smoke
  Scenario: Log in with valid credentials
    When the user enters username "student"
    And the user enters password "Password123"
    And the user submits the login form
    Then the page URL should contain "/logged-in-successfully"
    And the heading "Logged In Successfully" should be visible
    And the message "Congratulations student. You successfully logged in!" should be visible
    And the "Log out" link should be visible

  @negative
  Scenario Outline: Reject invalid login credentials
    When the user enters username "<username>"
    And the user enters password "<password>"
    And the user submits the login form
    Then the login error "<error>" should be displayed

    Examples:
      | username | password    | error                     |
      | stranger | Password123 | Your username is invalid! |
      | student  | wrongPass   | Your password is invalid! |

  Scenario: Mask password input
    When the user enters password "Password123"
    Then the password field should have the type "password"
