import { Page, Locator } from '@playwright/test';

export class PIMPage {
    readonly page: Page;
    readonly pimMenuItem: Locator;
    readonly employeeNameInput: Locator;
    readonly searchButton: Locator;
    readonly resultsTable: Locator;
    readonly noRecordsMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pimMenuItem = page.getByRole('link', { name: 'PIM' });
        this.employeeNameInput = page.locator('input[placeholder="Type for hints..."]').first();
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resultsTable = page.locator('.oxd-table');
        this.noRecordsMessage = page.locator('.orangehrm-horizontal-padding .oxd-text--span');
    }

    async goto() {
        await this.pimMenuItem.click();
    }

    async searchEmployee(name: string) {
        try {
            await this.employeeNameInput.waitFor({ state: 'visible', timeout: 5000 });
            await this.employeeNameInput.fill(name);
            
            // Wait for autocomplete
            const option = this.page.getByRole('option', { name: name }).first();
            await option.waitFor({ state: 'visible', timeout: 5000 });
            await option.click();
            
            await this.searchButton.click();
            await this.page.waitForLoadState('networkidle');
        } catch (error: Error | unknown) {
            throw new Error(`Search failed for employee: ${name}. Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}