# Sauce Demo Inventory, Cart, Product Details, and Sorting Test Plan

## Application Overview

Sauce Demo (https://www.saucedemo.com/) is a training shopping application. This plan covers the authenticated inventory workflow at /inventory.html: adding products to the cart, validating the cart badge and contents, removing products, opening product details and comparing them with the selected inventory card, and sorting products by all supported conditions. Suite setup: in the describe block, perform login once with standard_user / secret_sauce in a beforeAll setup and reuse the authenticated browser state for every test. Each test starts from a fresh application state by resetting the app state and navigating to /inventory.html; tests must be independently runnable and must not depend on data left by another test.

## Test Scenarios

### 1. Inventory, Cart, Product Details, and Sorting

**Seed:** `tests/sauce-demo-login.spec.js`

#### 1.1. TC-001: Add one product and validate cart count

**File:** `tests/sauce-demo-inventory-cart.spec.js`

**Steps:**
  1. Start with the shared authenticated session, reset the application state, and open https://www.saucedemo.com/inventory.html.
    - expect: The inventory page is displayed with six product cards.
    - expect: The cart badge is not displayed or has a count of 0.
  2. Click Add to cart for Sauce Labs Backpack.
    - expect: The Backpack button changes to Remove.
    - expect: The cart badge appears with count 1.
  3. Open the shopping cart.
    - expect: The cart page opens at /cart.html.
    - expect: Exactly one cart row is displayed for Sauce Labs Backpack with quantity 1.

#### 1.2. TC-002: Add multiple products and validate the cart count

**File:** `tests/sauce-demo-inventory-cart.spec.js`

**Steps:**
  1. Reset the application state and open the inventory page in the shared authenticated session.
    - expect: Six product cards are displayed and the cart is empty.
  2. Add Sauce Labs Backpack, Sauce Labs Bike Light, and Sauce Labs Onesie.
    - expect: Each selected product changes from Add to cart to Remove.
    - expect: The cart badge displays 3.
  3. Open the shopping cart and inspect the listed products.
    - expect: The cart contains exactly the three selected products.
    - expect: Each listed product has quantity 1 and no unselected product is present.

#### 1.3. TC-003: Verify cart details match selected inventory products

**File:** `tests/sauce-demo-inventory-cart.spec.js`

**Steps:**
  1. Reset the application state, open inventory, and add Sauce Labs Backpack and Sauce Labs Bolt T-Shirt.
    - expect: The cart badge displays 2.
  2. Open the cart and compare each cart row with its source inventory card.
    - expect: Each selected product name, description, displayed price, and quantity 1 match the corresponding inventory card.
    - expect: The cart contains only the two selected products.

#### 1.4. TC-004: Remove one product and validate the updated cart count

**File:** `tests/sauce-demo-inventory-cart.spec.js`

**Steps:**
  1. Reset the application state, add Sauce Labs Backpack and Sauce Labs Bike Light, and open the cart.
    - expect: The cart badge displays 2 and both products are listed.
  2. Click Remove for Sauce Labs Backpack.
    - expect: Sauce Labs Backpack is removed from the cart.
    - expect: Sauce Labs Bike Light remains in the cart.
    - expect: The cart badge decreases to 1.
  3. Navigate back to inventory.
    - expect: The Backpack card shows Add to cart again.
    - expect: The Bike Light card still shows Remove.

#### 1.5. TC-005: Remove all products and verify the empty cart state

**File:** `tests/sauce-demo-inventory-cart.spec.js`

**Steps:**
  1. Reset the application state, add Sauce Labs Backpack and Sauce Labs Onesie, and open the cart.
    - expect: The cart badge displays 2 and both selected products are listed.
  2. Remove Sauce Labs Backpack and then remove Sauce Labs Onesie.
    - expect: Both cart rows are removed.
    - expect: The cart badge is no longer displayed or returns to 0.
  3. Verify the cart page after all removals.
    - expect: The cart page shows no product rows.
    - expect: Continue Shopping remains available and Checkout is not available for an empty cart.

#### 1.6. TC-006: Verify product detail matches the selected inventory card

**File:** `tests/sauce-demo-inventory-details.spec.js`

**Steps:**
  1. Reset the application state and open the inventory page.
    - expect: The Sauce Labs Backpack inventory card is visible with its name, description, price, and product image.
  2. Click the Sauce Labs Backpack product name or image.
    - expect: The page navigates to /inventory-item.html?id=4.
    - expect: The detail page displays Sauce Labs Backpack, the same description, the same $29.99 price, and the matching product image.
  3. Use Back to products to return to inventory.
    - expect: The inventory page is displayed again.
    - expect: The product list is available without changing the selected product data.

#### 1.7. TC-007: Sort products by Name (A to Z)

**File:** `tests/sauce-demo-inventory-sorting.spec.js`

**Steps:**
  1. Reset the application state and open the inventory page.
    - expect: The inventory page is displayed with the product sort dropdown available.
  2. Select Name (A to Z).
    - expect: The dropdown shows Name (A to Z).
    - expect: The six product cards are ordered alphabetically ascending: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red).

#### 1.8. TC-008: Sort products by Name (Z to A)

**File:** `tests/sauce-demo-inventory-sorting.spec.js`

**Steps:**
  1. Reset the application state and open the inventory page.
    - expect: The product list is displayed.
  2. Select Name (Z to A).
    - expect: The dropdown shows Name (Z to A).
    - expect: The six product cards are ordered alphabetically descending: Test.allTheThings() T-Shirt (Red), Sauce Labs Onesie, Sauce Labs Fleece Jacket, Sauce Labs Bolt T-Shirt, Sauce Labs Bike Light, Sauce Labs Backpack.

#### 1.9. TC-009: Sort products by Price (low to high)

**File:** `tests/sauce-demo-inventory-sorting.spec.js`

**Steps:**
  1. Reset the application state and open the inventory page.
    - expect: The product list is displayed with all six prices available for comparison.
  2. Select Price (low to high).
    - expect: The dropdown shows Price (low to high).
    - expect: The product prices are in non-decreasing order.
    - expect: Sauce Labs Onesie at $7.99 is first and Sauce Labs Fleece Jacket at $49.99 is last.

#### 1.10. TC-010: Sort products by Price (high to low)

**File:** `tests/sauce-demo-inventory-sorting.spec.js`

**Steps:**
  1. Reset the application state and open the inventory page.
    - expect: The product list is displayed.
  2. Select Price (high to low).
    - expect: The dropdown shows Price (high to low).
    - expect: The product prices are in non-increasing order.
    - expect: Sauce Labs Fleece Jacket at $49.99 is first and Sauce Labs Onesie at $7.99 is last.
