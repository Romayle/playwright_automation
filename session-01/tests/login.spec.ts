import { test, expect } from '@playwright/test';
import { loginUser, logoutUser } from '../utils/page-helper';

test.describe('Login Tests', { tag: ['@ui', '@login'] }, () => {

  test('Valid login', { tag: ['@smoke', '@positive', '@critical'] }, async ({ page }) => {
    await loginUser(page);
    
    await logoutUser(page);
  });

  test('Invalid login', { tag: ['@regression', '@negative'] }, async ({ page }) => {
    // Navigate to login page
    await page.goto(process.env.ORANGE_HRM_URL!);

    // Enter invalid credentials
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('wrong123');

    // Attempt login
    await page.getByRole('button', { name: 'Login' }).click();

    const errorMessage = page.locator('.oxd-alert--error .oxd-alert-content-text');
    await errorMessage.waitFor({ state: 'visible' });

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials');
    
  });

});
