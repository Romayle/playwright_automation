import { test, expect } from '@playwright/test';
import { loginUser } from '../utils/page-helper';

test.describe('Login Tests', () => {

  test('Valid login', async ({ page }) => {
    await loginUser(page);
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
