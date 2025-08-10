Feature: Site Navigation
  As a user visiting the markdown garden
  I want to navigate between pages
  So that I can read different documents

  Scenario: Navigate from home page to bar page
    Given the site is running with test garden content
    When I visit the home page
    Then I should see the content "Index page"
    When I click on the "bar" link
    Then I should be on the "bar" page
    And I should see the content "This is the simple bar page."
