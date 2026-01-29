import { test, expect } from '@playwright/test';

test('XPath examples', async ({ page }) => {
    await page.goto(process.env.ORANGE_HRM_URL!);

    // 1. Relative XPath with contains()
    const usernameInput = page.locator('//input[contains(@name, "username")]');
    await usernameInput.fill('Admin');

    // 2. XPath with text()
    const loginButton = page.locator('//button[contains(text(), "Login")]');
    
    // 3. XPath with attribute and contains
    const passwordField = page.locator('//input[contains(@placeholder, "Password")]');
    await passwordField.fill('admin123');

    // 4. XPath with multiple conditions
    const submitBtn = page.locator('//button[@type="submit" and contains(@class, "oxd-button")]');
    await submitBtn.click();

    // 5. XPath with following-sibling
    const errorMessage = page.locator('//label[text()="Username"]/following-sibling::span');
    
    // 6. XPath with parent
    const inputParent = page.locator('//input[@name="username"]/parent::div');
    
    // 7. XPath with ancestor
    const formContainer = page.locator('//input[@name="username"]/ancestor::form');
    
    // 8. XPath with starts-with()
    const menuItem = page.locator('//a[starts-with(@class, "oxd-main-menu")]');
});
