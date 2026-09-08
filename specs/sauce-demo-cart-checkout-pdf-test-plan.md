# Sauce Demo End-to-End Cart Checkout and PDF Test Plan

## Application Overview

End-to-end functional test plan for https://www.saucedemo.com/ covering login with a supported user, adding products to the cart, reviewing cart contents, entering checkout information, validating the order overview and totals, completing the order, and saving the confirmation page as a PDF through the browser print workflow. Each test starts from a fresh browser context and clears application state. Standard credentials are standard_user / secret_sauce. Sauce Demo does not provide a native PDF download control, so PDF validation assumes the tester uses the browser Print dialog and selects Save as PDF; the generated file must be non-empty and contain the order confirmation text and purchased item details.

## Test Scenarios

### 1. Sauce Demo End-to-End Purchase and Checkout

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-POS-001: Add one item, complete checkout, and save confirmation as PDF

**File:** `tests/sauce-demo-cart-checkout-pdf.spec.js`

**Steps:**
  1. Open a fresh browser context and navigate to https://www.saucedemo.com/
    - expect: The Sauce Demo login page is displayed.
    - expect: Username, password, and Login controls are visible.
  2. Enter standard_user in Username, enter secret_sauce in Password, and click Login.
    - expect: The user is redirected to /inventory.html.
    - expect: The inventory page displays six products and the shopping cart link.
  3. Click Add to cart for Sauce Labs Backpack and open the cart.
    - expect: The Backpack button changes to Remove.
    - expect: The cart badge shows 1.
    - expect: The cart page lists exactly Sauce Labs Backpack with quantity 1.
  4. Click Checkout, enter First Name Test, Last Name Buyer, and Postal Code 10001, then click Continue.
    - expect: The checkout overview page opens.
    - expect: The selected Backpack is listed with quantity 1.
    - expect: Item total, tax, and total are displayed.
  5. Verify the overview total equals item total plus tax, then click Finish.
    - expect: The order is completed successfully.
    - expect: The confirmation page displays Thank you for your order! and an order dispatch message.
  6. Invoke the browser Print command, choose Save as PDF, save the file as sauce-demo-backpack-order.pdf, and open the saved PDF.
    - expect: A non-empty PDF file is created.
    - expect: The PDF contains the confirmation heading and the purchased Backpack details.
    - expect: The PDF can be opened without corruption.

#### 1.2. TC-POS-002: Add multiple items, verify cart, complete checkout, and save PDF

**File:** `tests/sauce-demo-cart-checkout-pdf.spec.js`

**Steps:**
  1. Start with a fresh browser context, log in as standard_user with password secret_sauce, and open the inventory page.
    - expect: The inventory page is displayed and the cart is empty.
  2. Add Sauce Labs Backpack, Sauce Labs Bike Light, and Sauce Labs Onesie, then open the cart.
    - expect: The cart badge shows 3.
    - expect: The cart contains exactly the three selected products, each with quantity 1.
    - expect: No unselected product is present.
  3. Click Checkout and enter valid first name, last name, and postal code values, then click Continue.
    - expect: The checkout overview displays all three selected products.
    - expect: The subtotal equals the sum of the three displayed item prices.
    - expect: Tax and final total are displayed.
  4. Click Finish.
    - expect: The confirmation page is displayed with the successful order message.
  5. Print the confirmation page to multi-item-order.pdf using Save as PDF and reopen it.
    - expect: The PDF exists and is non-empty.
    - expect: The PDF contains the confirmation text and all three purchased item names or an equivalent order summary.
    - expect: The PDF is readable and not an HTML error page.

#### 1.3. TC-POS-003: Complete checkout from a product detail page and save PDF

**File:** `tests/sauce-demo-product-detail-checkout-pdf.spec.js`

**Steps:**
  1. In a fresh context, log in as standard_user / secret_sauce and open the inventory page.
    - expect: The inventory list is displayed.
  2. Open the Sauce Labs Bolt T-Shirt product detail, confirm the product name and price, add it to the cart, and open the cart.
    - expect: The detail page shows the Bolt T-Shirt name and price.
    - expect: The cart contains exactly one Bolt T-Shirt with quantity 1.
  3. Proceed to Checkout, enter valid checkout information, and continue to the overview.
    - expect: The overview shows the same Bolt T-Shirt and price from the detail page.
    - expect: The displayed total is calculated successfully.
  4. Click Finish and print the completion page to bolt-shirt-order.pdf.
    - expect: The order confirmation page is shown.
    - expect: The PDF is created, opens successfully, and contains the successful order text and Bolt T-Shirt reference.

#### 1.4. TC-POS-004: Checkout after removing an item and save the final order PDF

**File:** `tests/sauce-demo-remove-item-checkout-pdf.spec.js`

**Steps:**
  1. Start fresh, log in with standard_user / secret_sauce, add Sauce Labs Backpack and Sauce Labs Fleece Jacket, and open the cart.
    - expect: The cart badge shows 2 and both selected products are listed.
  2. Remove Sauce Labs Fleece Jacket.
    - expect: The Fleece Jacket is removed.
    - expect: The Backpack remains.
    - expect: The cart badge decreases to 1.
  3. Click Checkout, enter valid first name, last name, and postal code, continue, and inspect the overview.
    - expect: Only the Backpack appears in the overview.
    - expect: The total does not include the removed Fleece Jacket.
  4. Finish the order and save the confirmation page as backpack-after-removal.pdf through the browser Print dialog.
    - expect: The confirmation page is displayed.
    - expect: The PDF contains the completed-order confirmation and Backpack details.
    - expect: The removed Fleece Jacket is not represented as a purchased line item.

#### 1.5. TC-POS-005: Verify order reset after completion and create a second PDF order

**File:** `tests/sauce-demo-order-reset-pdf.spec.js`

**Steps:**
  1. In a fresh context, log in, add Sauce Labs Onesie, complete checkout with valid customer details, and click Finish.
    - expect: The first order confirmation page is displayed.
  2. Save the confirmation page as first-order.pdf, then click Back Home.
    - expect: The inventory page opens.
    - expect: The cart badge is empty or absent, showing that the completed order cleared the cart.
  3. Add Sauce Labs Bike Light, complete checkout with valid details, and click Finish.
    - expect: A second confirmation page is displayed.
    - expect: The second order contains Bike Light and not the previously purchased Onesie.
  4. Save the second confirmation page as second-order.pdf and compare it with first-order.pdf.
    - expect: Both PDFs are valid, non-empty, and contain their respective confirmation content.
    - expect: The first PDF references Onesie and the second references Bike Light.
    - expect: Order data does not leak between completed purchases.

#### 1.6. TC-NEG-001: Required checkout fields prevent continuation

**File:** `tests/sauce-demo-negative-checkout.spec.js`

**Steps:**
  1. Start fresh, log in as standard_user / secret_sauce, add Sauce Labs Backpack, open the cart, and click Checkout.
    - expect: The checkout information page opens.
  2. Leave First Name, Last Name, and Postal Code empty and click Continue.
    - expect: The user remains on the checkout information page.
    - expect: A visible validation message indicates First Name is required.
    - expect: The overview page is not opened.
  3. Enter a first name only and click Continue again.
    - expect: The user remains on the checkout information page.
    - expect: A visible validation message indicates Last Name is required.
    - expect: No order is submitted and no PDF is generated.
  4. Enter a last name but leave Postal Code empty and click Continue.
    - expect: The user remains on the checkout information page.
    - expect: A visible validation message indicates Postal Code is required.
    - expect: The cart and entered values remain available for correction.

#### 1.7. TC-NEG-002: Invalid or boundary checkout data is rejected or handled safely

**File:** `tests/sauce-demo-negative-checkout.spec.js`

**Steps:**
  1. Start fresh, log in, add Sauce Labs Bike Light, open Checkout, and enter a 256-character first name, a valid last name, and a non-numeric postal code such as ABC@@@.
    - expect: The fields accept only the documented input format or show clear validation feedback.
    - expect: The application does not crash or navigate to the order overview unexpectedly.
  2. Click Continue.
    - expect: Invalid or unsupported values produce a visible validation message, or the behavior is documented as accepted by the application.
    - expect: No successful order confirmation is shown while required data is invalid.
    - expect: No PDF is generated for a rejected checkout.
  3. Correct the fields to a valid first name, last name, and postal code.
    - expect: The invalid state clears or is replaced by valid values.
    - expect: The user can continue normally without losing the cart item.

#### 1.8. TC-NEG-003: Empty-cart checkout cannot create an order or PDF

**File:** `tests/sauce-demo-negative-cart.spec.js`

**Steps:**
  1. Start fresh, log in as standard_user / secret_sauce, open the inventory page, and open the cart without adding any product.
    - expect: The cart page is displayed with no product rows.
    - expect: The cart badge is absent or shows zero.
  2. Inspect the cart controls and attempt to proceed to checkout if a Checkout control is present.
    - expect: The application prevents checkout from an empty cart, or clearly exposes that no purchasable item exists.
    - expect: The checkout overview cannot be completed with no line items.
  3. Attempt to reach the completion page through normal UI navigation and invoke Save as PDF only if a page is displayed.
    - expect: No successful order confirmation or order PDF is produced for an empty cart.
    - expect: The application remains stable and offers a path back to products.

#### 1.9. TC-NEG-004: Back navigation and stale checkout state do not submit an unintended order

**File:** `tests/sauce-demo-negative-navigation.spec.js`

**Steps:**
  1. Start fresh, log in, add Sauce Labs Backpack, open Checkout, enter valid customer details, and continue to the overview.
    - expect: The overview shows the Backpack and the entered customer information is accepted.
  2. Navigate back to the cart or inventory, remove the Backpack, then return forward to the checkout flow.
    - expect: The application reflects the current cart state.
    - expect: The removed Backpack is not silently retained as a purchasable item, or a clear recovery behavior is shown.
  3. Attempt to click Finish or save a PDF without a valid current order.
    - expect: The application does not create a false success confirmation.
    - expect: No PDF representing an unintended order is produced.
    - expect: Any error or recovery message is visible and the UI remains usable.

#### 1.10. TC-NEG-005: Cancel checkout and verify no order confirmation or PDF is produced

**File:** `tests/sauce-demo-negative-cancel.spec.js`

**Steps:**
  1. Start fresh, log in with standard_user / secret_sauce, add Sauce Labs Onesie, open the cart, and click Checkout.
    - expect: The checkout information page opens with the selected item preserved.
  2. Use the Cancel control on checkout information or overview instead of Finish.
    - expect: The user is returned to the expected cart or inventory page.
    - expect: No order confirmation is displayed.
    - expect: The application does not report the order as completed.
  3. Verify the cart state and attempt to print the current page.
    - expect: The cart state follows the application’s documented cancel behavior and is not falsely marked complete.
    - expect: No order-confirmation PDF is created.
    - expect: The user can either resume checkout or leave the flow without an error.
