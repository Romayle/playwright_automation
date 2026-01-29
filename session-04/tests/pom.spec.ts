import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { PIMPage } from '../pages/pim.page';

test('Search employee using POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const pimPage = new PIMPage(page);

    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    
    await pimPage.goto();
    await pimPage.searchEmployee('John Doe');
    
    await expect(pimPage.resultsTable).toBeVisible();
});