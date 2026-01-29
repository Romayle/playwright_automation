import { Page, Locator } from '@playwright/test';

export class AdminPage {
    readonly page: Page;
    readonly adminMenuItem: Locator;
    readonly addButton: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly deleteButton: Locator;
    readonly saveButton: Locator;
    
    // Search/Filter elements
    readonly usernameSearchInput: Locator;
    readonly userRoleDropdown: Locator;
    readonly employeeNameInput: Locator;
    readonly statusDropdown: Locator;
    
    // Add/Edit User Form elements
    readonly userRoleFormDropdown: Locator;
    readonly employeeNameFormInput: Locator;
    readonly statusFormDropdown: Locator;
    readonly usernameFormInput: Locator;
    readonly passwordFormInput: Locator;
    readonly confirmPasswordFormInput: Locator;
    
    // Results and messages
    readonly resultsTable: Locator;
    readonly noRecordsMessage: Locator;
    readonly recordsFoundText: Locator;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;
    
    // Navigation tabs
    readonly userManagementTab: Locator;
    readonly jobTab: Locator;
    readonly organizationTab: Locator;
    readonly qualificationsTab: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Main navigation
        this.adminMenuItem = page.getByRole('link', { name: 'Admin' });
        
        // Action buttons
        this.addButton = page.getByRole('button', { name: ' Add' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.deleteButton = page.getByRole('button', { name: ' Delete' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        
        // Search/Filter elements
        this.usernameSearchInput = page.locator('.oxd-input').nth(1);
        this.userRoleDropdown = page.locator('.oxd-select-text-input').first();
        this.employeeNameInput = page.locator('input[placeholder="Type for hints..."]');
        this.statusDropdown = page.locator('.oxd-select-text-input').last();
        
        // Add/Edit Form elements
        this.userRoleFormDropdown = page.locator('.oxd-select-text-input').first();
        this.employeeNameFormInput = page.locator('input[placeholder="Type for hints..."]');
        this.statusFormDropdown = page.locator('.oxd-select-text-input').nth(1);
        this.usernameFormInput = page.locator('.oxd-input').filter({ hasText: 'Username' });
        this.passwordFormInput = page.locator('input[type="password"]').first();
        this.confirmPasswordFormInput = page.locator('input[type="password"]').last();
        
        // Results and messages
        this.resultsTable = page.locator('.oxd-table');
        this.noRecordsMessage = page.locator('.oxd-text--span').filter({ hasText: 'No Records Found' });
        this.recordsFoundText = page.locator('.oxd-text--span').filter({ hasText: /Records Found/ });
        this.successMessage = page.locator('.oxd-toast-content-text');
        this.errorMessage = page.locator('.oxd-input-field-error-message');
        
        // Navigation tabs
        this.userManagementTab = page.getByRole('link', { name: 'User Management' });
        this.jobTab = page.getByRole('link', { name: 'Job' });
        this.organizationTab = page.getByRole('link', { name: 'Organization' });
        this.qualificationsTab = page.getByRole('link', { name: 'Qualifications' });
    }

    async goto() {
        await this.adminMenuItem.click();
        await this.page.waitForURL('**/admin/**', { timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
    }

    async searchUser(username?: string, userRole?: string, employeeName?: string, status?: string) {
        try {
            if (username) {
                await this.usernameSearchInput.fill(username);
            }

            if (userRole) {
                await this.userRoleDropdown.click();
                const option = this.page.getByRole('option', { name: userRole });
                await option.click();
            }

            if (employeeName) {
                await this.employeeNameInput.fill(employeeName);
                await this.page.waitForTimeout(1000);
                
                const option = this.page.getByRole('option', { name: employeeName }).first();
                const optionVisible = await option.isVisible().catch(() => false);
                
                if (optionVisible) {
                    await option.click();
                }
            }

            if (status) {
                await this.statusDropdown.click();
                const option = this.page.getByRole('option', { name: status });
                await option.click();
            }

            await this.searchButton.click();
            await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        } catch (error: Error | unknown) {
            throw new Error(`User search failed. Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async addUser(userRole: string, employeeName: string, status: string, username: string, password: string) {
        try {
            await this.addButton.click();
            await this.page.waitForURL('**/admin/saveSystemUser', { timeout: 10000 });
            
            // Select user role
            await this.userRoleFormDropdown.click();
            await this.page.getByRole('option', { name: userRole }).click();
            
            // Enter employee name and select from dropdown
            await this.employeeNameFormInput.fill(employeeName);
            await this.page.waitForTimeout(1000);
            
            const empOption = this.page.getByRole('option', { name: employeeName }).first();
            await empOption.waitFor({ state: 'visible', timeout: 5000 });
            await empOption.click();
            
            // Select status
            await this.statusFormDropdown.click();
            await this.page.getByRole('option', { name: status }).click();
            
            // Enter username
            await this.usernameFormInput.fill(username);
            
            // Enter passwords
            await this.passwordFormInput.fill(password);
            await this.confirmPasswordFormInput.fill(password);
            
            // Save
            await this.saveButton.click();
            await this.page.waitForLoadState('networkidle');
        } catch (error: Error | unknown) {
            throw new Error(`Failed to add user. Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async deleteUser(username: string) {
        try {
            // Search for the user first
            await this.searchUser(username);
            
            // Wait for results
            await this.page.waitForTimeout(2000);
            
            // Click delete button for the first result
            const deleteIcon = this.page.locator('.oxd-icon.bi-trash').first();
            await deleteIcon.click();
            
            // Confirm deletion
            const confirmButton = this.page.getByRole('button', { name: ' Yes, Delete' });
            await confirmButton.click();
            
            await this.page.waitForLoadState('networkidle');
        } catch (error: Error | unknown) {
            throw new Error(`Failed to delete user. Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async resetSearch() {
        await this.resetButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getSearchResultsCount(): Promise<number> {
        try {
            const recordsText = await this.recordsFoundText.textContent({ timeout: 3000 });
            const match = recordsText?.match(/\((\d+)\)/);
            return match ? parseInt(match[1]) : 0;
        } catch {
            const noRecords = await this.noRecordsMessage.isVisible().catch(() => false);
            return noRecords ? 0 : -1;
        }
    }

    async isNoRecordsDisplayed(): Promise<boolean> {
        return await this.noRecordsMessage.isVisible().catch(() => false);
    }

    async getSuccessMessage(): Promise<string> {
        try {
            await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
            return await this.successMessage.textContent() || '';
        } catch {
            return '';
        }
    }

    async getErrorMessages(): Promise<string[]> {
        try {
            const errorElements = await this.errorMessage.all();
            const messages: string[] = [];
            for (const element of errorElements) {
                const text = await element.textContent();
                if (text) messages.push(text);
            }
            return messages;
        } catch {
            return [];
        }
    }

    async navigateToUserManagement() {
        await this.userManagementTab.click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToJob() {
        await this.jobTab.click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToOrganization() {
        await this.organizationTab.click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToQualifications() {
        await this.qualificationsTab.click();
        await this.page.waitForLoadState('networkidle');
    }

    async searchUserViaAPI(params: {
        username?: string;
        userRoleId?: number;
        status?: number;
        limit?: number;
        offset?: number;
        sortField?: string;
        sortOrder?: 'ASC' | 'DESC';
    } = {}) {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            
            // Set default values
            queryParams.append('limit', (params.limit || 50).toString());
            queryParams.append('offset', (params.offset || 0).toString());
            
            // Add optional parameters
            if (params.username) {
                queryParams.append('username', params.username);
            }
            
            if (params.userRoleId !== undefined) {
                queryParams.append('userRoleId', params.userRoleId.toString());
            }
            
            if (params.status !== undefined) {
                queryParams.append('status', params.status.toString());
            }
            
            if (params.sortField) {
                queryParams.append('sortField', params.sortField);
            }
            
            if (params.sortOrder) {
                queryParams.append('sortOrder', params.sortOrder);
            }
            
            // Construct API URL
            const apiUrl = `${process.env.ORANGE_HRM_URL?.replace('/auth/login', '')}/api/v2/admin/users?${queryParams.toString()}`;
            
            // Make API request using page context (includes authentication cookies)
            const response = await this.page.request.get(apiUrl);
            
            // Return response data
            return {
                status: response.status(),
                ok: response.ok(),
                data: response.ok() ? await response.json() : null,
                headers: response.headers()
            };
        } catch (error: Error | unknown) {
            throw new Error(`API user search failed. Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
