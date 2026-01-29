import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async goto() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/');
    }

    async login(username: string, password: string) {
        try {
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
            
            // Wait for navigation
            await this.page.waitForURL('**/dashboard/index', { timeout: 10000 });
        } catch (error: Error | unknown) {
            throw new Error(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
