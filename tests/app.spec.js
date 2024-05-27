import { coverage } from './baseFixture';

const BASE_URL = "https://travis-kirton.github.io/pw-coverage/";

class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.welcomeMessage = page.locator('[test-id="welcome-message"]');
  }

  async goto() {
    await this.page.goto(BASE_URL);
  }
}

const test = coverage.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.welcomeMessage;
    await use(homePage);
  },
});

test("basic test", async ({ homePage }) => {
  // Wait for welcome message to appear
  await homePage.welcomeMessage;
});