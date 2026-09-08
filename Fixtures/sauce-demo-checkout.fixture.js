import { test as base, expect } from '@playwright/test';
import SauceDemoCheckoutPage from '../pages/sauce-demo-checkout.page.js';

export const test = base.extend({
  sauceDemo: async ({ page }, use) => {
    await use(new SauceDemoCheckoutPage(page));
  },
});

export { expect };
