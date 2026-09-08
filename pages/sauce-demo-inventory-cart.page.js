class SauceDemoInventoryCartPage {
  constructor(page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.productSort = page.locator('[data-test="product-sort-container"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  inventoryCard(product) {
    return this.inventoryItems.filter({ hasText: product.name });
  }

  cartRow(product) {
    return this.cartItems.filter({ hasText: product.name });
  }

  addButton(product) {
    return this.page.locator(`[data-test="add-to-cart-${product.id}"]`);
  }

  removeButton(product) {
    return this.page.locator(`[data-test="remove-${product.id}"]`);
  }

  async addProduct(product) {
    await this.addButton(product).click();
  }

  async removeProduct(product) {
    await this.removeButton(product).click();
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async sortProducts(sortOption) {
    await this.productSort.selectOption(sortOption);
  }

  async openProductDetails(product) {
    await this.inventoryCard(product).locator('.inventory_item_name').click();
  }

  async returnToProducts() {
    await this.backToProductsButton.click();
  }
}

export default SauceDemoInventoryCartPage;