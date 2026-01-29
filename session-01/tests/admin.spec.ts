import { test, expect } from '@playwright/test';
import { logoutUser, redirectToAdmin } from '../utils/page-helper';

test.describe('Admin Tests', { tag: ['@ui', '@admin'] }, () => {
    test('Search for a user - Positive flow', { tag: ['@smoke', '@positive'] }, async ({page}) => {
        await redirectToAdmin(page);

        // Fill Username in search form
        await page.getByRole('textbox').nth(1).fill('Admin');

        // Select User Role: Admin
        await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().click();
        await page.getByRole('option', { name: 'Admin' }).click();

        // Select Status: Enabled
        await page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
        await page.getByRole('option', { name: 'Enabled' }).click();

        // Click Search
        await page.getByRole('button', { name: 'Search' }).click();

        // Verify results are displayed
        const resultsMessage = page.locator('.orangehrm-horizontal-padding .oxd-text--span');
        await expect(resultsMessage).toBeVisible();
        await expect(resultsMessage).not.toHaveText('No Records Found');

        await logoutUser(page);
    });

    test('Search for a user - Negative flow', { tag: ['@regression', '@negative'] }, async ({page}) => {
        await redirectToAdmin(page);

        // Fill Username with non-existent user
        await page.getByRole('textbox').nth(1).fill('NonExistentUser99999');

        // Click Search
        await page.getByRole('button', { name: 'Search' }).click();

        // Verify "No Records Found" message appears
        const noRecordsMessage = page.locator('.orangehrm-horizontal-padding .oxd-text--span');
        await expect(noRecordsMessage).toBeVisible();
        await expect(noRecordsMessage).toHaveText('No Records Found');

        await logoutUser(page);
    });

});
