import { test, expect } from '@playwright/test';
import SauceDemoInventoryCartPage from '../pages/sauce-demo-inventory-cart.page.js';

const inventoryUrl = '/inventory.html';

const products = {
  backpack: { name: 'Sauce Labs Backpack', id: 'sauce-labs-backpack' },
  bikeLight: { name: 'Sauce Labs Bike Light', id: 'sauce-labs-bike-light' },
  boltShirt: { name: 'Sauce Labs Bolt T-Shirt', id: 'sauce-labs-bolt-t-shirt' },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', id: 'sauce-labs-fleece-jacket' },
  onesie: { name: 'Sauce Labs Onesie', id: 'sauce-labs-onesie' },
};

test.describe('Sauce Demo Inventory, Cart, Product Details, and Sorting', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto(inventoryUrl);
    page.inventoryCart = new SauceDemoInventoryCartPage(page);
  });

  test('TC-001: Add one product and validate cart count', async ({ page }) => {
    await page.inventoryCart.addProduct(products.backpack);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await page.inventoryCart.openCart();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.inventoryCart.cartRow(products.backpack).locator('.inventory_item_name')).toHaveText(products.backpack.name);
  });

  test('TC-002: Add multiple products and validate the cart count', async ({ page }) => {
    for (const product of [products.backpack, products.bikeLight, products.onesie]) {
      await page.inventoryCart.addProduct(product);
    }
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    await page.inventoryCart.openCart();
    await expect(page.locator('.cart_item')).toHaveCount(3);
    for (const product of [products.backpack, products.bikeLight, products.onesie]) {
      await expect(page.inventoryCart.cartRow(product)).toHaveCount(1);
    }
  });

  test('TC-003: Verify cart details match selected inventory products', async ({ page }) => {
    const selectedProducts = [products.backpack, products.boltShirt];
    const expectedDetails = [];
    for (const product of selectedProducts) {
      const card = page.inventoryCart.inventoryCard(product);
      expectedDetails.push({
        name: await card.locator('.inventory_item_name').textContent(),
        description: await card.locator('.inventory_item_desc').textContent(),
        price: await card.locator('.inventory_item_price').textContent(),
      });
      await page.inventoryCart.addProduct(product);
    }
    await page.inventoryCart.openCart();
    for (const details of expectedDetails) {
      const row = page.inventoryCart.cartRow({ name: details.name });
      await expect(row.locator('.inventory_item_name')).toHaveText(details.name);
      await expect(row.locator('.inventory_item_desc')).toHaveText(details.description);
      await expect(row.locator('.inventory_item_price')).toHaveText(details.price);
      await expect(row.locator('.cart_quantity')).toHaveText('1');
    }
  });

  test('TC-004: Remove one product and validate the updated cart count', async ({ page }) => {
    await page.inventoryCart.addProduct(products.backpack);
    await page.inventoryCart.addProduct(products.bikeLight);
    await page.inventoryCart.openCart();
    await page.inventoryCart.removeProduct(products.backpack);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await expect(page.inventoryCart.cartRow(products.backpack)).toHaveCount(0);
    await expect(page.inventoryCart.cartRow(products.bikeLight)).toHaveCount(1);
    await page.inventoryCart.continueShopping();
    await expect(page.inventoryCart.addButton(products.backpack)).toBeVisible();
    await expect(page.inventoryCart.removeButton(products.bikeLight)).toBeVisible();
  });

  test('TC-005: Remove all products and verify the empty cart state', async ({ page }) => {
    await page.inventoryCart.addProduct(products.backpack);
    await page.inventoryCart.addProduct(products.onesie);
    await page.inventoryCart.openCart();
    await page.inventoryCart.removeProduct(products.backpack);
    await page.inventoryCart.removeProduct(products.onesie);
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('TC-006: Verify product detail matches the selected inventory card', async ({ page }) => {
    const card = page.inventoryCart.inventoryCard(products.backpack);
    const name = await card.locator('.inventory_item_name').textContent();
    const description = await card.locator('.inventory_item_desc').textContent();
    const price = await card.locator('.inventory_item_price').textContent();
    const imageAlt = await card.locator('img').getAttribute('alt');
    await page.inventoryCart.openProductDetails(products.backpack);
    await expect(page.locator('.inventory_details_name')).toHaveText(name);
    await expect(page.locator('.inventory_details_desc')).toHaveText(description);
    await expect(page.locator('.inventory_details_price')).toHaveText(price);
    await expect(page.locator('.inventory_details_img')).toHaveAttribute('alt', imageAlt);
    await page.inventoryCart.returnToProducts();
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-007: Sort products by Name (A to Z)', async ({ page }) => {
    await page.inventoryCart.sortProducts('az');
    expect(await page.inventoryCart.inventoryItemNames.allTextContents()).toEqual([
      'Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket', 'Sauce Labs Onesie', 'Test.allTheThings() T-Shirt (Red)',
    ]);
  });

  test('TC-008: Sort products by Name (Z to A)', async ({ page }) => {
    await page.inventoryCart.sortProducts('za');
    expect(await page.inventoryCart.inventoryItemNames.allTextContents()).toEqual([
      'Test.allTheThings() T-Shirt (Red)', 'Sauce Labs Onesie', 'Sauce Labs Fleece Jacket',
      'Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light', 'Sauce Labs Backpack',
    ]);
  });

  test('TC-009: Sort products by Price (low to high)', async ({ page }) => {
    await page.inventoryCart.sortProducts('lohi');
    await expect(page.inventoryCart.inventoryItemNames.first()).toHaveText(products.onesie.name);
    await expect(page.inventoryCart.inventoryItemPrices.first()).toHaveText('$7.99');
    await expect(page.inventoryCart.inventoryItemNames.last()).toHaveText(products.fleeceJacket.name);
    await expect(page.inventoryCart.inventoryItemPrices.last()).toHaveText('$49.99');
  });

  test('TC-010: Sort products by Price (high to low)', async ({ page }) => {
    await page.inventoryCart.sortProducts('hilo');
    await expect(page.inventoryCart.inventoryItemNames.first()).toHaveText(products.fleeceJacket.name);
    await expect(page.inventoryCart.inventoryItemPrices.first()).toHaveText('$49.99');
    await expect(page.inventoryCart.inventoryItemNames.last()).toHaveText(products.onesie.name);
    await expect(page.inventoryCart.inventoryItemPrices.last()).toHaveText('$7.99');
  });
});
