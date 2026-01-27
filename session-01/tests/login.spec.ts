import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {

  test('Valid login', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Fill credentials
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');

    // Submit login form
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert login success (dashboard visible)
    await expect(page.locator('.oxd-topbar-header')).toBeVisible();
  });

  test('Invalid login', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Enter invalid credentials
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('wrong123');

    // Attempt login
    await page.getByRole('button', { name: 'Login' }).click();

    const errorMessage = page.locator('.oxd-alert--error .oxd-alert-content-text');

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials');
  });

});
