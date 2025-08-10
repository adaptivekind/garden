Feature: Search functionality
  As a user viewing a garden with a graph file
  I want to search through page names
  So that I can quickly navigate to specific content

  Background:
    Given I have a garden with a graph file
    And I am on the home page

  Scenario: Search field appears when graph file exists
    Then I should see a search input field
    And the search field should have placeholder text "Search pages..."

  Scenario: Search shows results after typing more than 2 characters
    When I type "foo" in the search field
    Then I should see search results
    And I should see "foo" in the search results

  Scenario: Search filters results based on query
    When I type "kitchen" in the search field
    Then I should see search results containing "kitchen-sink"
    But I should not see "foo" in the search results

  Scenario: Search results are limited to 10 items
    When I type "kitchen-sink#" in the search field
    Then I should see search results
    And I should see at most 10 search results

  Scenario: Clicking search result navigates to page
    When I type "foo" in the search field
    And I click on "foo" in the search results
    Then I should be on the "foo" page
    And the search field should be cleared

  Scenario: Keyboard navigation in search results
    When I type "kitchen" in the search field
    And I press the down arrow key
    Then the first search result should be highlighted
    When I press Enter
    Then I should navigate to the highlighted page

  Scenario: Search hides with less than 3 characters
    When I type "fo" in the search field
    Then I should not see search results
    When I type "foo" in the search field
    Then I should see search results

  Scenario: Escape key closes search results
    When I type "foo" in the search field
    And I press the Escape key
    Then I should not see search results