import { test, expect } from '@playwright/test';
import { logoutUser, redirectToLeave } from '../utils/page-helper';

test.describe('Apply for leave', { tag: ['@ui', '@leave'] }, () => {
    test('Apply for leave - Positive flow', { tag: ['@smoke', '@positive'] }, async ({ page }) => {
        await redirectToLeave(page);

        // Fill Employee Name
        await page.getByRole('textbox', { name: 'Type for hints...' }).fill('John Doe');

        // Select Leave Type
        await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').click();
        await page.getByRole('option', { name: 'CAN - Vacation' }).click();

        // Select Leave Date (first day of the month)
        await page.locator('.oxd-icon.bi-calendar').first().click();
        await page.getByText('1', { exact: true }).click();

        // Assign leave
        await page.getByRole('button', { name: 'Assign' }).click();

        // Verify success - should show confirmation or navigate away
        await page.waitForTimeout(1000);
        
        await logoutUser(page);
    });

    test('Apply for leave - Negative flow', { tag: ['@regression', '@negative'] }, async ({ page }) => {
        await redirectToLeave(page);

        // Try to assign leave without filling any required fields
        await page.getByRole('button', { name: 'Assign' }).click();

        // Verify required field error messages appear
        const errorMessages = page.locator('.oxd-input-field-error-message');
        await expect(errorMessages.first()).toBeVisible();
        await expect(errorMessages.first()).toHaveText('Required');

        // Verify we're still on the assign leave page
        await expect(page).toHaveURL(/assignLeave/);

        await logoutUser(page);
    });

});
