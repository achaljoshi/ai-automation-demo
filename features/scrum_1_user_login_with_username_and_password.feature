@jira-SCRUM-1 @regression
Feature: User Login with Username and Password
  As a registered user, I want to log in to the application using my username and password
  so that I can access the application.

  Background:
    Given the user is on the login page

  @jira-SCRUM-1 @smoke @regression
  Scenario: Successful login with valid credentials
    When the user enters username "student"
    And the user enters password "Password123"
    And the user clicks the "Submit" button
    Then the page URL should contain "/logged-in-successfully"
    And the user should see the heading "Logged In Successfully"
    And the user should see the message "Congratulations student. You successfully logged in!"
    And the user should see the "Log out" link

  @jira-SCRUM-1 @negative @regression
  Scenario: Login fails with invalid username
    When the user enters username "fake_user"
    And the user enters password "Password123"
    And the user clicks the "Submit" button
    Then the error message "Your username is invalid!" should be displayed

  @jira-SCRUM-1 @negative @regression
  Scenario: Login fails with valid username but wrong password
    When the user enters username "student"
    And the user enters password "wrong_password"
    And the user clicks the "Submit" button
    Then the error message "Your password is invalid!" should be displayed

  @jira-SCRUM-1 @regression
  Scenario: Password field masks input characters
    Then the "Password" field should be of type "password"