# Sauce Demo Login and Hamburger Menu Test Plan

## Application Overview

Sauce Demo (https://www.saucedemo.com/) is a training shopping application. This plan covers login and the authenticated hamburger side menu. It contains exactly 4 positive scenarios, 4 negative scenarios, and 2 edge-case scenarios. Every scenario starts from a blank, fresh browser state and uses standard_user / secret_sauce when authentication is required. After login, the menu is opened with the hamburger button and its All Items, About, Logout, and Reset App State options are validated. Tests should be independent and should not rely on state left by another scenario.

## Test Scenarios

### 1. Sauce Demo Login and Hamburger Menu

**Seed:** `tests/seed.spec.ts`

#### 1.1. POS-001: Login and display all hamburger menu options

**File:** `tests/sauce-demo-hamburger-menu.spec.js`

**Steps:**
  1. Open https://www.saucedemo.com/.
    - expect: The Sauce Demo login page is displayed.
    - expect: The page title is Swag Labs.
    - expect: Username, password, and Login controls are visible.
  2. Enter standard_user in the Username field and secret_sauce in the Password field, then click Login.
    - expect: The user is authenticated.
    - expect: The browser navigates to the inventory/products page.
    - expect: The Products heading, product list, cart icon, and hamburger menu button are visible.
  3. Click the hamburger menu button.
    - expect: The left navigation side window opens.
    - expect: The menu contains All Items, About, Logout, and Reset App State options.
    - expect: The menu is visible without overlapping or obscuring the menu labels.

#### 1.2. POS-002: Use All Items to return to the inventory section

**File:** `tests/sauce-demo-hamburger-menu.spec.js`

**Steps:**
  1. Log in with standard_user / secret_sauce.
    - expect: The inventory/products page is displayed with the hamburger menu button available.
  2. Open the hamburger side window and click All Items.
    - expect: The side window closes or navigates back to the inventory view.
    - expect: The browser is on the inventory/products page.
    - expect: The Products heading and all six product cards are visible.
    - expect: The shopping cart control remains available.

#### 1.3. POS-003: Open About from the authenticated hamburger menu

**File:** `tests/sauce-demo-hamburger-menu.spec.js`

**Steps:**
  1. Log in with standard_user / secret_sauce and open the hamburger side window.
    - expect: The authenticated side menu is visible and includes About.
  2. Click About.
    - expect: The browser navigates to the Sauce Labs About page or the About destination configured by the application.
    - expect: The destination loads successfully and presents Sauce Labs content.
    - expect: No application error message is displayed.

#### 1.4. POS-004: Log out from the hamburger menu

**File:** `tests/sauce-demo-hamburger-menu.spec.js`

**Steps:**
  1. Log in with standard_user / secret_sauce and open the hamburger side window.
    - expect: The authenticated side menu is visible and includes Logout.
  2. Click Logout.
    - expect: The authenticated session ends.
    - expect: The browser returns to the Sauce Demo login page.
    - expect: The username and password fields and Login button are visible.
  3. Navigate directly to https://www.saucedemo.com/inventory.html.
    - expect: The protected inventory page is not accessible without authentication.
    - expect: The user is redirected to the login page or shown the application’s unauthenticated access behavior.

#### 1.5. NEG-001: Reject invalid credentials before the hamburger menu is available

**File:** `tests/sauce-demo-hamburger-menu-negative.spec.js`

**Steps:**
  1. Open https://www.saucedemo.com/ and enter invalid_user_test with secret_sauce.
    - expect: The credentials are entered into the login form.
  2. Click Login.
    - expect: Authentication fails.
    - expect: The user remains on the login page.
    - expect: A visible error indicates that the username and password do not match.
    - expect: The inventory page and hamburger menu are not displayed.

#### 1.6. NEG-002: Reject locked-out user and prevent menu access

**File:** `tests/sauce-demo-hamburger-menu-negative.spec.js`

**Steps:**
  1. Open the login page and enter locked_out_user with secret_sauce.
    - expect: The login form accepts the entered values.
  2. Click Login.
    - expect: Authentication fails.
    - expect: The user remains on the login page.
    - expect: A visible error indicates that the user has been locked out.
    - expect: The authenticated hamburger side window cannot be opened.

#### 1.7. NEG-003: Prevent unauthenticated direct access to inventory and menu actions

**File:** `tests/sauce-demo-hamburger-menu-negative.spec.js`

**Steps:**
  1. Start with a fresh browser context and navigate directly to https://www.saucedemo.com/inventory.html without logging in.
    - expect: The application does not expose the authenticated inventory content to the unauthenticated user.
    - expect: The user is redirected to the login page or shown the application’s access-denied behavior.
  2. Attempt to locate or activate the hamburger menu and its All Items, About, Logout, and Reset App State options.
    - expect: Authenticated menu actions are unavailable until login succeeds.
    - expect: No protected menu action is executed.

#### 1.8. NEG-004: Keep the session active when Reset App State is used with no cart data

**File:** `tests/sauce-demo-hamburger-menu-negative.spec.js`

**Steps:**
  1. Log in with standard_user / secret_sauce, open the hamburger side window, and click Reset App State before adding any product.
    - expect: The action completes without an application error.
    - expect: The user remains authenticated on the inventory/products page.
    - expect: The user is not redirected to the login page.
  2. Open the hamburger side window again.
    - expect: The side window can be reopened.
    - expect: All Items, About, Logout, and Reset App State remain available.
    - expect: Reset App State does not behave as Logout.

#### 1.9. EDGE-001: Reset App State after adding multiple products

**File:** `tests/sauce-demo-hamburger-menu-edge.spec.js`

**Steps:**
  1. Log in with standard_user / secret_sauce and add Sauce Labs Backpack, Sauce Labs Bike Light, and Sauce Labs Onesie to the cart.
    - expect: Each selected product changes to its Remove state.
    - expect: The cart badge shows 3.
  2. Open the hamburger side window and click Reset App State.
    - expect: The application remains on the authenticated inventory/products page.
    - expect: The cart badge is removed or reset to 0.
    - expect: All previously selected products return to Add to cart state.
    - expect: No stale cart rows remain when the cart is opened.
    - expect: The user remains able to open the hamburger menu.

#### 1.10. EDGE-002: Repeatedly open and close the hamburger menu and recover with All Items

**File:** `tests/sauce-demo-hamburger-menu-edge.spec.js`

**Steps:**
  1. Log in with standard_user / secret_sauce.
    - expect: The inventory/products page and hamburger button are available.
  2. Open the hamburger side window, close it, and repeat the open/close sequence at least three times.
    - expect: Each open action displays one usable side window.
    - expect: Each close action hides the side window.
    - expect: The page layout remains stable and no duplicate menu is created.
  3. Open the side window and click All Items.
    - expect: The menu closes or returns to the inventory view.
    - expect: The Products heading and six product cards remain visible.
    - expect: The cart control and hamburger button remain usable after repeated menu interaction.
