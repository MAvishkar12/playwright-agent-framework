// @ts-check
import { defineConfig, devices } from "@playwright/test";
import dotenv from 'dotenv';

dotenv.config();
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"],["allure-playwright"]],  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.js/,
    },
    {
      name: "inventory-Chrome",
      testMatch: /.*\.spec\.js/,
      testIgnore: /.*sauce-demo-login\.spec\.js/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
    },
    {
      name: "Login-Chrome",
      testMatch: /sauce-demo-login\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },

     {
      name: "inventory-Firefox",
      testMatch: /.*\.spec\.js/,
      testIgnore: /.*sauce-demo-login\.spec\.js/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/user.json",
      },
    },
    {
      name: "Login-Firefox",
      testMatch: /sauce-demo-login\.spec\.js/,
      use: {
        ...devices["Desktop Firefox"],
      },
    },

  ],


});
