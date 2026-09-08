import { test, expect } from '@playwright/test';

test.describe('Sauce Demo Login Tests', () => {
  
  let usernameInput;
  let passwordInput;
  let loginButton;
  let errorMessage;

  test.beforeEach(async ({ page }) => {
    // Common setup for all tests
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');
    
    // Define common locators
    usernameInput = page.locator('input[placeholder="Username"]');
    passwordInput = page.locator('input[placeholder="Password"]');
    loginButton = page.locator('input[value="Login"]');
    errorMessage = page.locator('[data-test="error"]');
  });

  test('TC-001: Successful login with standard_user', async ({ page }) => {
    // Enter valid credentials
    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    
    // Click login
    await loginButton.click();
    
    // Verify successful redirect to inventory page
    await page.waitForURL('**/inventory.html', { timeout: 5000 });
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-002: Failed login with invalid username', async ({ page }) => {
    // Enter invalid credentials
    await usernameInput.fill('invalid_user_test');
    await passwordInput.fill('secret_sauce');
    
    // Click login
    await loginButton.click();
    
    // Verify error message is displayed
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Username and password do not match/i);
  });

  test('TC-003: Failed login with empty password', async ({ page }) => {
    // Enter username only
    await usernameInput.fill('standard_user');
    
    // Click login without password
    await loginButton.click();
    
    // Verify error message
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Password is required/i);
  });

  test('TC-004: Login with problem_user', async ({ page }) => {
    // Enter problem_user credentials
    await usernameInput.fill('problem_user');
    await passwordInput.fill('secret_sauce');
    
    // Click login
    await loginButton.click();
    
    // Verify successful redirect to inventory
    await page.waitForURL('**/inventory.html', { timeout: 5000 });
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-005: Login with locked_out_user', async ({ page }) => {
    // Enter locked out user credentials
    await usernameInput.fill('locked_out_user');
    await passwordInput.fill('secret_sauce');
    
    // Click login 
    await loginButton.click();
    
    // Verify locked out error message
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Sorry, this user has been locked out/i);
  });
});
