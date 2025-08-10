import { Given, When, Then, After, setWorldConstructor } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { chromium, Browser, Page, BrowserContext } from "playwright";

class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
}

setWorldConstructor(CustomWorld);

Given("the site is running with test garden content", async function () {
  this.browser = await chromium.launch({
    headless: process.env.HEADED !== "true",
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

When("I visit the home page", async function () {
  await this.page.goto("http://localhost:3000");
});

Then(
  "I should see the content {string}",
  async function (expectedContent: string) {
    await expect(this.page.getByText(expectedContent)).toBeVisible();
  },
);

When("I click on the {string} link", async function (linkText: string) {
  await this.page.getByRole("link", { name: linkText }).click();
});

Then("I should be on the {string} page", async function (pageName: string) {
  if (pageName.toLowerCase() === 'readme') {
    await expect(this.page).toHaveURL('http://localhost:3000/');
  } else {
    await expect(this.page).toHaveURL(`http://localhost:3000/${pageName}`);
  }
});

After(async function () {
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
  if (this.browser) {
    await this.browser.close();
  }
});
