@jira-SCRUM-1 @regression
Feature: User Login with Username and Password
  As a registered user, I want to log in to the application using my username
  and password so that I can access the application.

  Background:
    Given the user is on the login page

  @jira-SCRUM-1 @smoke
  Scenario: Successful login
    Given the user enters "student" as the username
    And the user enters "Password123" as the password
    When the user submits the login form
    Then the user should see the heading "Logged In Successfully"
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the page URL should contain "/logged-in-successfully"
    And the "Log out" link should be visible

  @jira-SCRUM-1 @negative
  Scenario Outline: Invalid login attempt
    Given the user enters "<username>" as the username
    And the user enters "<password>" as the password
    When the user submits the login form
    Then the error message "<error_message>" should be displayed

    Examples:
      | username   | password     | error_message               |
      | invalid    | Password123 | Your username is invalid!   |
      | student    | wrongPass   | Your password is invalid!   |

  @jira-SCRUM-1 @regression
  Scenario: Password masking
    Given the user focuses on the password field
    Then the password field should mask the input characters (type="password")