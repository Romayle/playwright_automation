import test from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { AdminPage } from "../pages/admin.page";

test.describe('Admin E2E Tests', { tag: ['@ui', '@admin'] }, () => {
    test('Search for a user - Positive flow', { tag: ['@smoke', '@positive'] }, async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        const adminPage = new AdminPage(page);
        await adminPage.goto();

        await adminPage.searchUserViaAPI({
            username: 'Admin',
            userRoleId: 1,  //Admin
            status: 1,  //Enabled
            limit: 50,
            offset: 0,
            sortField: 'u.userName',
            sortOrder: 'ASC'
        });

    });

    test('Search for a user - Negative flow', { tag: ['@regression', '@negative'] }, async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        const adminPage = new AdminPage(page);
        await adminPage.goto();
        
        await adminPage.searchUserViaAPI({
            username: 'NonExistentUser99999',
            userRoleId: undefined,
            status: undefined,
            limit: 50,
            offset: 0,
            sortField: 'u.userName',
            sortOrder: 'ASC'
        });

    });

});
