# Environment Variables Configuration

This document explains the environment variables used in the Playwright automation project.

## Environment Variables

The project uses a `.env` file in the root directory to manage environment-specific configurations.

### Available Variables

#### 1. ORANGE_HRM_URL

- **Description**: Base URL for the OrangeHRM demo application
- **Value**: `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`
- **Usage**: Used in all UI tests that interact with the OrangeHRM application
- **Configuration**: Set as `baseURL` in `playwright.config.ts`

#### 2. FAKE_STORE_API_URL

- **Description**: Base URL for the Fake Store API
- **Value**: `https://fakestoreapi.com`
- **Usage**: Used in API tests for testing REST endpoints
- **Files**: Referenced in `session-02/utils/apiClient.ts`

## How to Use

### 1. Accessing Environment Variables in Code

```typescript
// Direct access
const orangeHrmUrl = process.env.ORANGE_HRM_URL;

// With non-null assertion (when you're sure it exists)
await page.goto(process.env.ORANGE_HRM_URL!);

// Using baseURL from playwright config (recommended)
await page.goto("/"); // Uses baseURL from config
```

### 2. Configuration in playwright.config.ts

```typescript
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  use: {
    baseURL: process.env.ORANGE_HRM_URL,
  },
});
```

### 3. Usage in Page Objects

```typescript
export class LoginPage {
  async goto() {
    // Use environment variable
    await this.page.goto(process.env.ORANGE_HRM_URL!);

    // OR use relative path (recommended if baseURL is set)
    await this.page.goto("/");
  }
}
```

### 4. Usage in Test Files

```typescript
test("should login successfully", async ({ page }) => {
  // Option 1: Use environment variable directly
  await page.goto(process.env.ORANGE_HRM_URL!);

  // Option 2: Use baseURL (recommended)
  await page.goto("/");

  // Option 3: Use relative paths
  await page.goto("/dashboard");
});
```

## Files Updated with Environment Variables

### Session 01

- ✅ `session-01/utils/page-helper.ts` - Uses `process.env.ORANGE_HRM_URL`
- ✅ `session-01/tests/login.spec.ts` - Uses `process.env.ORANGE_HRM_URL`

### Session 04

- ✅ `session-04/pages/login.page.ts` - Uses `process.env.ORANGE_HRM_URL`
- ✅ `session-04/tests/xpath.spec.ts` - Uses `process.env.ORANGE_HRM_URL`
- ✅ `session-04/tests/recorded.spec.ts` - Uses `process.env.ORANGE_HRM_URL`
- ✅ `session-04/pages/pim.page.ts` - Uses relative navigation (after login)

### Configuration

- ✅ `playwright.config.ts` - Loads dotenv and sets baseURL

## Benefits of Using Environment Variables

### 1. **Centralized Configuration**

- Single source of truth for URLs
- Easy to update across all tests
- No hardcoded values scattered in code

### 2. **Environment-Specific Settings**

```bash
# Development
ORANGE_HRM_URL=https://dev.orangehrmlive.com

# Staging
ORANGE_HRM_URL=https://staging.orangehrmlive.com

# Production
ORANGE_HRM_URL=https://opensource-demo.orangehrmlive.com
```

### 3. **Security**

- Keep sensitive data out of version control
- Add `.env` to `.gitignore`
- Use different `.env` files for different environments

### 4. **Flexibility**

- Switch between environments easily
- No code changes required
- Works with CI/CD pipelines

## CI/CD Integration

### GitHub Actions

```yaml
env:
  ORANGE_HRM_URL: ${{ secrets.ORANGE_HRM_URL }}
  FAKE_STORE_API_URL: ${{ secrets.FAKE_STORE_API_URL }}
```

### Setting Secrets

1. Go to repository Settings
2. Navigate to Secrets and Variables > Actions
3. Add secrets:
   - `ORANGE_HRM_URL`
   - `FAKE_STORE_API_URL`

## Best Practices

### 1. **Always Use Environment Variables for URLs**

```typescript
// ❌ Bad - Hardcoded
await page.goto("https://opensource-demo.orangehrmlive.com/");

// ✅ Good - Environment variable
await page.goto(process.env.ORANGE_HRM_URL!);

// ✅ Better - Using baseURL
await page.goto("/");
```

### 2. **Create .env.example for Documentation**

```bash
# .env.example
ORANGE_HRM_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
FAKE_STORE_API_URL=https://fakestoreapi.com
```

### 3. **Add .env to .gitignore**

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 4. **Validate Environment Variables**

```typescript
// In playwright.config.ts
if (!process.env.ORANGE_HRM_URL) {
  throw new Error("ORANGE_HRM_URL is not defined in .env file");
}
```

## Troubleshooting

### Issue: Environment variables not loading

**Solution**: Ensure dotenv is imported and configured in `playwright.config.ts`

```typescript
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, ".env") });
```

### Issue: TypeScript errors with process.env

**Solution**: Add non-null assertion or type checking

```typescript
// Option 1: Non-null assertion
await page.goto(process.env.ORANGE_HRM_URL!);

// Option 2: With fallback
const url = process.env.ORANGE_HRM_URL || "https://default-url.com";
await page.goto(url);

// Option 3: Type checking
if (process.env.ORANGE_HRM_URL) {
  await page.goto(process.env.ORANGE_HRM_URL);
}
```

### Issue: Variables not available in tests

**Solution**: Make sure playwright.config.ts loads before tests run

## Summary

✅ All hardcoded URLs replaced with `process.env.ORANGE_HRM_URL`  
✅ Dotenv configuration enabled in `playwright.config.ts`  
✅ BaseURL configured for relative navigation  
✅ Consistent usage across all test files  
✅ Ready for multi-environment testing  
✅ CI/CD compatible

**Next Steps:**

1. Test all updated files to ensure they work correctly
2. Create `.env.example` for documentation
3. Add `.env` to `.gitignore` if not already present
4. Configure environment-specific `.env` files as needed

---

**Last Updated**: January 29, 2026  
**Configuration Version**: 1.0
