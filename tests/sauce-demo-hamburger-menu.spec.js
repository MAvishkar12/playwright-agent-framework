import { test, expect } from '@playwright/test';

const inventoryUrl = '/inventory.html';
const loginUrl = '/';

function menu(page) {
  return page.locator('#react-burger-menu-btn');
}

function closeMenu(page) {
  return page.locator('#react-burger-cross-btn');
}

function sideMenu(page) {
  return page.locator('.bm-menu-wrap');
}

async function openMenu(page) {
  await menu(page).click();
  await expect(sideMenu(page)).toBeVisible();
}



test.describe('Sauce Demo Login and Hamburger Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(inventoryUrl);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('POS-001: Login and display all hamburger menu options', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    await openMenu(page);
    await expect(page.locator('#inventory_sidebar_link')).toHaveText('All Items');
    await expect(page.locator('#about_sidebar_link')).toHaveText('About');
    await expect(page.locator('#logout_sidebar_link')).toHaveText('Logout');
    await expect(page.locator('#reset_sidebar_link')).toHaveText('Reset App State');
  });

  test('POS-002: Use All Items to return to the inventory section', async ({ page }) => {
    await openMenu(page);
    await page.locator('#inventory_sidebar_link').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  });

  test('POS-003: Open About from the authenticated hamburger menu', async ({ page }) => {
    await openMenu(page);
    await page.locator('#about_sidebar_link').click();
    await expect(page).toHaveURL(/saucelabs\.com/);
    await expect(page.locator('body')).toContainText(/Sauce Labs/i);
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });

  test('POS-004: Log out from the hamburger menu', async ({ page }) => {
    await openMenu(page);
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL(loginUrl);
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await page.goto(inventoryUrl);
    await expect(page).toHaveURL(loginUrl);
  });

  test('NEG-004: Keep the session active when Reset App State is used with no cart data', async ({ page }) => {
    await openMenu(page);
    await page.locator('#reset_sidebar_link').click();
    await page.reload();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await openMenu(page);
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
  });

  test('EDGE-001: Reset App State after adding multiple products', async ({ page }) => {
    for (const product of ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-onesie']) {
      await page.locator(`[data-test="add-to-cart-${product}"]`).click();
      await expect(page.locator(`[data-test="remove-${product}"]`)).toBeVisible();
    }
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    await openMenu(page);
    await page.locator('#reset_sidebar_link').click();
    await page.reload();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
    for (const product of ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-onesie']) {
      await expect(page.locator(`[data-test="add-to-cart-${product}"]`)).toBeVisible();
    }
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('EDGE-002: Repeatedly open and close the hamburger menu and recover with All Items', async ({ page }) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await openMenu(page);
      await expect(sideMenu(page)).toBeVisible();
      await closeMenu(page).click();
      await expect(sideMenu(page)).toBeHidden();
    }
    await openMenu(page);
    await page.locator('#inventory_sidebar_link').click();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    await expect(menu(page)).toBeVisible();
  });
});

test.describe('Sau`ce Demo Unauthenticated Hamburger Menu Protection', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('NEG-001: Reject invalid credentials before the hamburger menu is available', async ({ page }) => {
    await page.goto(loginUrl);
    await page.locator('[data-test="username"]').fill('invalid_user_test');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).toHaveURL(loginUrl);
    await expect(menu(page)).toHaveCount(0);
  });

  test('NEG-002: Reject locked-out user and prevent menu access', async ({ page }) => {
    await page.goto(loginUrl);
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out');
    await expect(page).toHaveURL(loginUrl);
    await expect(menu(page)).toHaveCount(0);
  });

  test('NEG-003: Prevent unauthenticated direct access to inventory and menu actions', async ({ page }) => {
    await page.goto(inventoryUrl);
    await expect(page).toHaveURL(loginUrl);
    await expect(page.locator('[data-test="title"]')).toHaveCount(0);
    await expect(menu(page)).toHaveCount(0);
  });
});