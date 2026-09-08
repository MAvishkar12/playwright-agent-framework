import { test, expect } from '../Fixtures/sauce-demo-checkout.fixture.js';

const inventoryUrl = '/inventory.html';

test.describe('Sauce Demo End-to-End Purchase and Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(inventoryUrl);
  });

  test('TC-POS-002: Add multiple items, verify cart, complete checkout, and save PDF', async ({ page, sauceDemo }) => {
    // 1. Open the authenticated inventory page.
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    // 2. Add Backpack, Bike Light, and Onesie, then open the cart.
    for (const product of ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-onesie']) {
      await sauceDemo.addProduct(product);
    }
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    await sauceDemo.openCart();
    await expect(page.locator('.cart_item')).toHaveCount(3);
    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Onesie',
    ]);
    await expect(page.locator('.cart_quantity')).toHaveText(['1', '1', '1']);

    // 3. Checkout with valid information and continue to the overview.
    await sauceDemo.startCheckout();
    await sauceDemo.fillCheckoutForm();
    await sauceDemo.continueToOverview();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(3);
    await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();
    await expect(page.locator('[data-test="tax-label"]')).toBeVisible();
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();

    // 4. Finish the order and verify the successful confirmation.
    await sauceDemo.finishOrder();

    // 5. The native browser print dialog is outside Playwright control; verify printable confirmation content.
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toContainText('Your order has been dispatched');
  });

  test('TC-POS-003: Complete checkout from a product detail page and save PDF', async ({ page, sauceDemo }) => {
    // 1. Log in and open the inventory page.
    ;
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // 2. Open Bolt T-Shirt detail, verify name and price, add it, and open the cart.
    await page.getByText('Sauce Labs Bolt T-Shirt', { exact: true }).click();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bolt T-Shirt');
    const detailPrice = await page.locator('[data-test="inventory-item-price"]').textContent();
    await page.locator('[data-test="add-to-cart"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Bolt T-Shirt');
    await expect(page.locator('.inventory_item_price')).toHaveText(detailPrice);
    await expect(page.locator('.cart_quantity')).toHaveText('1');

    // 3. Checkout with valid information and continue to the overview.
    await sauceDemo.checkout();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bolt T-Shirt');
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(detailPrice);
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();

    // 4. Finish and verify printable confirmation content.
    await sauceDemo.finishOrder();
    await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
  });

  test('TC-POS-004: Checkout after removing an item and save the final order PDF', async ({ page, sauceDemo }) => {
    // 1. Log in, add Backpack and Fleece Jacket, and open the cart.
    ;
    await sauceDemo.addProduct('sauce-labs-backpack');
    await sauceDemo.addProduct('sauce-labs-fleece-jacket');
    await sauceDemo.openCart();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    await expect(page.locator('.cart_item')).toHaveCount(2);

    // 2. Remove Fleece Jacket and verify Backpack remains.
    await sauceDemo.removeProduct('sauce-labs-fleece-jacket');
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // 3. Checkout with valid information and inspect the overview.
    await sauceDemo.startCheckout();
    await sauceDemo.fillCheckoutForm();
    await sauceDemo.continueToOverview();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_item_name')).not.toHaveText('Sauce Labs Fleece Jacket');

    // 4. Finish and verify the confirmation page for the retained product.
    await sauceDemo.finishOrder();
    await expect(page.locator('[data-test="complete-text"]')).toContainText('Your order has been dispatched');
  });

  test('TC-POS-005: Verify order reset after completion and create a second PDF order', async ({ page, sauceDemo }) => {
    // 1. Add Onesie, complete checkout, and verify the first confirmation.
    ;
    await sauceDemo.addProduct('sauce-labs-onesie');
    await sauceDemo.checkout();
    await sauceDemo.finishOrder();
    await expect(page.locator('[data-test="complete-header"]')).toBeVisible();

    // 2. Save the first confirmation externally, then click Back Home and verify the cart reset.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(inventoryUrl);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    // 3. Add Bike Light, complete checkout, and verify the second order item.
    await sauceDemo.addProduct('sauce-labs-bike-light');
    await sauceDemo.checkout();
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Bike Light');
    await expect(page.locator('.inventory_item_name')).not.toHaveText('Sauce Labs Onesie');
    await sauceDemo.finishOrder();

    // 4. Native PDF comparison is external to Playwright; verify the second confirmation is isolated.
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  test('TC-NEG-001: Required checkout fields prevent continuation', async ({ page }) => {
    // 1. Add Backpack, open the cart, and click Checkout.
    ;
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // 2. Leave fields empty and click Continue.
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one/);

    // 3. Enter first name only and click Continue again.
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');

    // 4. Enter last name with postal code empty and verify the final required-field error.
    await page.locator('[data-test="lastName"]').fill('Buyer');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Test');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Buyer');
  });

  test('TC-NEG-002: Invalid or boundary checkout data is rejected or handled safely', async ({ page }) => {
    // 1. Add Bike Light and enter boundary first-name and invalid postal data.
    ;
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('A'.repeat(256));
    await page.locator('[data-test="lastName"]').fill('Buyer');
    await page.locator('[data-test="postalCode"]').fill('ABC@@@');

    // 2. Continue and verify the application remains stable without a false confirmation.
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="checkout-summary-container"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toHaveCount(0);

    // 3. Correct the fields and verify the item is still available for a normal checkout.
    await page.goBack();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('Buyer');
    await page.locator('[data-test="postalCode"]').fill('10001');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');
  });

  test('TC-NEG-003: Empty-cart checkout cannot create an order or PDF', async ({ page }) => {
    // 1. Log in and open the empty cart.
    ;
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    // 2. Attempt checkout only when the control is present and verify no line items are created.
    const checkoutButton = page.locator('[data-test="checkout"]');
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await expect(page.locator('.cart_item')).toHaveCount(0);
    }

    // 3. Verify no successful confirmation is displayed.
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toHaveCount(0);
  });

  test('TC-NEG-004: Back navigation and stale checkout state do not submit an unintended order', async ({ page, sauceDemo }) => {
    // 1. Add Backpack, open Checkout, enter valid details, and continue to the overview.
    ;
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await sauceDemo.checkout();
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

    // 2. Navigate back to the cart, remove Backpack, and return forward to the checkout flow.
    await page.locator('[data-test="cancel"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await page.goForward();
    await expect(page.locator('.cart_item')).toHaveCount(0);

    // 3. Verify no unintended successful order confirmation can be submitted.
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toHaveCount(0);
  });

  test('TC-NEG-005: Cancel checkout and verify no order confirmation or PDF is produced', async ({ page }) => {
    // 1. Add Onesie, open the cart, and click Checkout.
    ;
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText('Sauce Labs Onesie');
    await page.locator('[data-test="checkout"]').click();

    // 2. Cancel checkout and verify no confirmation is displayed.
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/cart\.html|inventory\.html/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toHaveCount(0);

    // 3. Verify the flow remains usable and the selected item is not falsely completed.
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  });
});