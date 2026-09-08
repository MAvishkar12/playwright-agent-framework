import { expect } from '@playwright/test';

class SauceDemoCheckoutPage {
  constructor(page) {
    this.page = page;
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.checkoutSummary = page.locator('[data-test="checkout-summary-container"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
  }

  async addProduct(productId) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async removeProduct(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }

  async fillCheckoutForm({ firstName = 'Test', lastName = 'Buyer', postalCode = '10001' } = {}) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async checkout({ firstName, lastName, postalCode } = {}) {
    await this.openCart();
    await this.startCheckout();
    await this.fillCheckoutForm({ firstName, lastName, postalCode });
    await this.continueToOverview();
  }

  async finishOrder() {
    await expect(this.checkoutSummary).toBeVisible();
    await this.finishButton.click();
    await expect(this.completeHeader).toBeVisible();
  }
}

export default SauceDemoCheckoutPage;