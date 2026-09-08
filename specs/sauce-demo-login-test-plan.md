# Sauce Demo Login Page Test Plan

## Application Overview

Sauce Demo (https://www.saucedemo.com/) is a training application provided by Sauce Labs for learning test automation. The login page is the entry point that validates user credentials. This test plan covers critical scenarios including happy path, validation errors, locked accounts, and special user types.

## Test Scenarios

### 1. Sauce Demo Login Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. Test Case 1: Successful Login with Standard User

**File:** `tests/login/standard-user-login.spec.ts`

**Steps:**
  1. Open browser and navigate to https://www.saucedemo.com/
    - expect: Page loads successfully
    - expect: Login page is displayed
    - expect: Page title shows 'Swag Labs'
  2. Locate and verify the presence of Username textbox
    - expect: Username input field is visible
    - expect: Username field has placeholder or label 'Username'
  3. Locate and verify the presence of Password textbox
    - expect: Password input field is visible
    - expect: Password field has placeholder or label 'Password'
  4. Click on the Username textbox and enter 'standard_user'
    - expect: Username textbox is focused
    - expect: Text 'standard_user' is entered in the username field
  5. Click on the Password textbox and enter 'secret_sauce'
    - expect: Password textbox is focused
    - expect: Password characters are masked/hidden for security
  6. Click the 'Login' button
    - expect: Login button is clicked
    - expect: Page navigates to products/inventory page
    - expect: User is successfully authenticated
  7. Verify redirection and page content
    - expect: URL changes to inventory page URL
    - expect: Products/items are displayed
    - expect: Shopping cart icon is visible

#### 1.2. Test Case 2: Failed Login with Invalid Username

**File:** `tests/login/invalid-username-login.spec.ts`

**Steps:**
  1. Open browser and navigate to https://www.saucedemo.com/
    - expect: Page loads successfully
    - expect: Login page is displayed with empty username and password fields
  2. Enter an invalid username 'invalid_user_test' in the Username textbox
    - expect: Text is entered in the username field
  3. Enter a valid password 'secret_sauce' in the Password textbox
    - expect: Password is entered and masked
    - expect: Username field still contains 'invalid_user_test'
  4. Click the 'Login' button
    - expect: Login button is clicked
    - expect: Page remains on login page
    - expect: User is NOT redirected to inventory page
  5. Verify error message is displayed
    - expect: Error message appears on the page
    - expect: Error message contains text indicating invalid username or credentials
    - expect: Username and password fields remain populated
  6. Verify error message is visible and readable
    - expect: Error message is in a visible location
    - expect: Error message is clearly visible with distinct styling (e.g., red color, icon)

#### 1.3. Test Case 3: Failed Login with Empty Password Field

**File:** `tests/login/empty-password-login.spec.ts`

**Steps:**
  1. Open browser and navigate to https://www.saucedemo.com/
    - expect: Page loads successfully
    - expect: Login page is displayed with both fields empty
  2. Enter a valid username 'standard_user' in the Username textbox
    - expect: Username 'standard_user' is entered in the username field
  3. Leave the Password textbox empty (do not enter any value)
    - expect: Password field remains empty
    - expect: Username field contains 'standard_user'
  4. Click the 'Login' button
    - expect: Login button is clicked
    - expect: Page remains on the login page
    - expect: User is NOT authenticated
  5. Verify error message is displayed for missing password
    - expect: Error message appears on the page
    - expect: Error message indicates that password is required or missing
    - expect: Error message is in a prominent location
  6. Verify the page state after error
    - expect: Username field still contains 'standard_user'
    - expect: Password field is still empty
    - expect: Login button is still clickable

#### 1.4. Test Case 4: Login with Problem User (Visual Issues Expected)

**File:** `tests/login/problem-user-login.spec.ts`

**Steps:**
  1. Open browser and navigate to https://www.saucedemo.com/
    - expect: Page loads successfully
    - expect: Login page is displayed
    - expect: Login form elements are present
  2. Enter 'problem_user' in the Username textbox
    - expect: Username field contains 'problem_user'
  3. Enter 'secret_sauce' in the Password textbox
    - expect: Password field is filled and masked
  4. Click the 'Login' button
    - expect: Login button is clicked
    - expect: User is authenticated and redirected
  5. Verify user is logged in (page navigates to inventory)
    - expect: Page URL changes to inventory page
    - expect: User can see products or inventory items
  6. Inspect the page for visual issues or glitches
    - expect: Page may display with visual bugs/glitches (this is intentional for problem_user)
    - expect: Despite visual issues, core functionality works
    - expect: User session is established

#### 1.5. Test Case 5: Login with Locked Out User

**File:** `tests/login/locked-out-user-login.spec.ts`

**Steps:**
  1. Open browser and navigate to https://www.saucedemo.com/
    - expect: Page loads successfully
    - expect: Login page is displayed
    - expect: Form is ready for input
  2. Enter 'locked_out_user' in the Username textbox
    - expect: Username field contains 'locked_out_user'
  3. Enter 'secret_sauce' (correct password) in the Password textbox
    - expect: Password field is filled with masked characters
  4. Click the 'Login' button
    - expect: Login button is clicked
    - expect: Page remains on login page
    - expect: User is NOT redirected to inventory
  5. Verify specific locked-out error message is displayed
    - expect: Error message appears on the page
    - expect: Error message contains text indicating the user is locked out or account is not available
    - expect: Error message is specific to account lockout, not generic authentication failure
  6. Verify all form elements remain intact after error
    - expect: Username field still contains 'locked_out_user'
    - expect: Password field contains the entered password
    - expect: Login button is still clickable
    - expect: Page is stable and responsive
