import { test, expect } from '@playwright/test';
import { redirectToPIM } from '../utils/page-helper';

test.describe('PIM Tests', () => {
    test('Search for an employee - Positive flow', async ({ page }) => {
        await redirectToPIM(page);

        // Wait for PIM search form
        const pimForm = page.locator('.oxd-table-filter-area form');
        await pimForm.waitFor({ state: 'visible' });

        // Employee Name (autocomplete)
        const employeeNameInput = pimForm.locator(
        'input[placeholder="Type for hints..."]'
        );
        await employeeNameInput.first().fill('John Doe');

        // Select matching suggestion
        await page.getByRole('option', { name: 'John Doe' }).first().click();

        // Employee ID
        // await page.getByRole('textbox').nth(2).fill('3016');
        // await pimForm.locator('input.oxd-input').nth(1).fill('3016');

        // Employment Status dropdown
        await page.getByText('Current Employees Only').first().click();
        await page.getByRole('option', { name: 'Current Employees Only' }).click();
        
        // Click Search
        await pimForm.locator('button:has-text("Search")').click();

        // Assert results table is shown
        // await expect(page.locator('.oxd-table')).toBeVisible();

        const resultsMessage = page.locator(
            '.orangehrm-horizontal-padding .oxd-text--span'
        );
        
        await expect(resultsMessage).toBeVisible();
        await expect(resultsMessage).not.toHaveText('No Records Found');
    });

    test('Search for an employee - Negative flow', async ({ page }) => {
        await redirectToPIM(page);

        // Wait for PIM search form
        const pimForm = page.locator('.oxd-table-filter-area form');
        await pimForm.waitFor({ state: 'visible' });

        // Employee ID - Use non-existent ID
        // await pimForm.locator('input.oxd-input').nth(1).fill('999999');
        await page.getByRole('textbox').nth(2).fill('999999');

        // Employment Status dropdown
        await pimForm.locator('.oxd-select-text-input').first().click();
        await page.locator('.oxd-select-dropdown .oxd-select-option')
        .filter({ hasText: 'Current Employees Only' })
        .click();

        // Click Search
        await pimForm.locator('button:has-text("Search")').click();

        // Assert no records found message
        const resultsMessage = page.locator(
            '.orangehrm-horizontal-padding .oxd-text--span'
        );
        
        await expect(resultsMessage).toBeVisible();
        await expect(resultsMessage).toHaveText('No Records Found');
    });


    test('Add a new employee - Positive flow', async ({ page }) => {
        await redirectToPIM(page);
        await page.getByRole('button', { name: 'Add' }).click();

        // Fill employee details
        await page.getByRole('textbox', { name: 'First Name' }).fill('Andrew');
        await page.getByRole('textbox', { name: 'Middle Name' }).fill('John');
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Jacobs');

        // Employee ID
        const employeeIdInput = page.getByRole('textbox').nth(4);
        await employeeIdInput.fill('12345');

        // Enable "Create Login Details"
        await page.locator('.oxd-switch-input').click();

        // Login credentials for employee
        await page.getByRole('textbox').nth(5).fill('newUserName');

        const passwordInputs = page.locator('input[type="password"]');
        await passwordInputs.first().fill('wiugefiwhbfe12');
        await passwordInputs.nth(1).fill('wiugefiwhbfe12');

        // Save employee
        await page.getByRole('button', { name: 'Save' }).click();

        // Optional: Verify navigation to personal details page
        await expect(page).toHaveURL(/viewPersonalDetails/);
    });

    test('Add a new employee - Negative flow', async ({ page }) => {
        await redirectToPIM(page);
        await page.getByRole('button', { name: 'Add' }).click();

        // Fill only First Name (missing required Last Name)
        await page.getByRole('textbox', { name: 'First Name' }).fill('TestUser');
        await page.getByRole('textbox', { name: 'Middle Name' }).fill('Middle');

        // Try to save without Last Name
        await page.getByRole('button', { name: 'Save' }).click();

        // Assert error message appears for required field
        const errorMessage = page.locator('.oxd-input-field-error-message').first();
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Required');

        // Verify we're still on the add employee page (not redirected)
        await expect(page).toHaveURL(/addEmployee/);
    });

});
