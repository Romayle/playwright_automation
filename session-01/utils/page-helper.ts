import { expect } from '@playwright/test';

export async function loginUser(page: any) {
    // Navigate to login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Fill credentials
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');

    // Submit login form
    await page.getByRole('button', { name: 'Login' }).click();

    // Assert login success (dashboard visible)
    await expect(page.locator('.oxd-topbar-header')).toBeVisible();
}

export async function redirectToAdmin(page: any) {
    await loginUser(page);

    // Go to Admin section
    await page.getByRole('link', { name: 'Admin' }).click();
}

export async function redirectToLeave(page: any) {
    await loginUser(page);

    // Go to Admin section
    await page.getByRole('link', { name: 'Leave' }).click();
    await page.getByRole('listitem', { hasText: 'Assign Leave' }).click();

}
