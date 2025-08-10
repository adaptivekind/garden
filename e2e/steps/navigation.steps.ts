import { Given, When, Then, After } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { chromium, Browser, Page, BrowserContext } from "playwright";

let browser: Browser;
let context: BrowserContext;
let page: Page;

Given("the site is running with test garden content", async function () {
  browser = await chromium.launch({
    headless: process.env.HEADED !== "true",
  });
  context = await browser.newContext();
  page = await context.newPage();
});

When("I visit the home page", async function () {
  await page.goto("http://localhost:3000");
});

Then(
  "I should see the content {string}",
  async function (expectedContent: string) {
    await expect(page.getByText(expectedContent)).toBeVisible();
  },
);

When("I click on the {string} link", async function (linkText: string) {
  await page.getByRole("link", { name: linkText }).click();
});

Then("I should be on the {string} page", async function (pageName: string) {
  await expect(page).toHaveURL(`http://localhost:3000/${pageName}`);
});

After(async function () {
  if (page) {
    await page.close();
  }
  if (context) {
    await context.close();
  }
  if (browser) {
    await browser.close();
  }
});
