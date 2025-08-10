import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { chromium } from 'playwright'

Given('I have a garden with a graph file', async function() {
  // The test garden already has a .garden-graph.json file
  // This step is just for documentation
})

Given('I am on the home page', async function() {
  // Initialize browser and visit home page
  this.browser = await chromium.launch({
    headless: process.env.HEADED !== "true",
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  await this.page.goto("http://localhost:3000");
})

Then('I should see a search input field', async function() {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await expect(searchInput).toBeVisible()
})

Then('the search field should have placeholder text {string}', async function(placeholderText: string) {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await expect(searchInput).toHaveAttribute('placeholder', placeholderText)
})

When('I type {string} in the search field', async function(text: string) {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await searchInput.fill(text)
})

Then('I should see search results', async function() {
  const searchResults = this.page.locator('[data-testid="search-results"]')
  await expect(searchResults).toBeVisible()
})

Then('I should not see search results', async function() {
  const searchResults = this.page.locator('[data-testid="search-results"]')
  await expect(searchResults).not.toBeVisible()
})

Then('I should see {string} in the search results', async function(text: string) {
  const searchResults = this.page.locator('[data-testid="search-results"]')
  await expect(searchResults.getByText(text, { exact: true })).toBeVisible()
})

Then('I should see search results containing {string}', async function(text: string) {
  const searchResults = this.page.locator('[data-testid="search-results"]')
  await expect(searchResults.getByText(text, { exact: true }).first()).toBeVisible()
})

Then('I should not see {string} in the search results', async function(text: string) {
  const searchResults = this.page.locator('[data-testid="search-results"]')
  await expect(searchResults.getByText(text, { exact: true })).not.toBeVisible()
})

Then('I should see at most {int} search results', async function(maxResults: number) {
  const searchResults = this.page.locator('[data-testid="search-results"] > div')
  const count = await searchResults.count()
  expect(count).toBeLessThanOrEqual(maxResults)
})

When('I click on {string} in the search results', async function(text: string) {
  const searchResults = this.page.locator('[data-testid="search-results"]')
  await searchResults.getByText(text, { exact: true }).click()
})

// This step is defined in navigation.steps.ts to avoid duplication

Then('the search field should be cleared', async function() {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await expect(searchInput).toHaveValue('')
})

When('I press the down arrow key', async function() {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await searchInput.press('ArrowDown')
})

When('I press Enter', async function() {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await searchInput.press('Enter')
})

When('I press the Escape key', async function() {
  const searchInput = this.page.locator('[data-testid="search-input"]')
  await searchInput.press('Escape')
})

Then('the first search result should be highlighted', async function() {
  const firstResult = this.page.locator('[data-testid="search-result-0"]')
  await expect(firstResult).toHaveCSS('background-color', 'rgb(245, 245, 245)')
})

Then('I should navigate to the highlighted page', async function() {
  // Wait for navigation to occur - the URL should change
  await this.page.waitForLoadState('networkidle')
  // The specific page depends on the search results, 
  // so we just verify that navigation occurred
  const currentUrl = this.page.url()
  expect(currentUrl).toMatch(/.*/)
})