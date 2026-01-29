# Test Tags Reference

## Available Tags

### By Test Type

- `@ui` - All UI tests
- `@api` - API tests (if any)

### By Priority

- `@smoke` - Critical tests to run first
- `@regression` - Full test suite
- `@critical` - Must-pass tests

### By Test Result

- `@positive` - Happy path scenarios
- `@negative` - Error/edge case scenarios

### By Feature

- `@login` - Login functionality
- `@admin` - Admin module
- `@pim` - PIM (Employee management)
- `@leave` - Leave management

---

## How to Run Tests by Tag

### Run Smoke Tests Only

```powershell
npx playwright test --grep @smoke
```

### Run All UI Tests

```powershell
npx playwright test --grep @ui
```

### Run Positive Flow Tests

```powershell
npx playwright test --grep @positive
```

### Run Negative Flow Tests

```powershell
npx playwright test --grep @negative
```

### Run Critical Tests

```powershell
npx playwright test --grep @critical
```

### Run Specific Module Tests

```powershell
# PIM tests only
npx playwright test --grep @pim

# Admin tests only
npx playwright test --grep @admin

# Leave tests only
npx playwright test --grep @leave

# Login tests only
npx playwright test --grep @login
```

### Run Regression Tests (exclude smoke)

```powershell
npx playwright test --grep @regression
```

### Exclude Negative Tests

```powershell
npx playwright test --grep-invert @negative
```

### Combine Multiple Tags (AND logic)

```powershell
# Run smoke tests that are positive
npx playwright test --grep "(?=.*@smoke)(?=.*@positive)"

# Run PIM smoke tests
npx playwright test --grep "(?=.*@pim)(?=.*@smoke)"
```

### Combine Multiple Tags (OR logic)

```powershell
# Run smoke OR critical tests
npx playwright test --grep "@smoke|@critical"

# Run PIM OR admin tests
npx playwright test --grep "@pim|@admin"
```

---

## Tag Summary by Test

### Login Tests

- ✅ Valid login: `@ui`, `@login`, `@smoke`, `@positive`, `@critical`
- ❌ Invalid login: `@ui`, `@login`, `@regression`, `@negative`

### Admin Tests

- ✅ Search user (positive): `@ui`, `@admin`, `@smoke`, `@positive`
- ❌ Search user (negative): `@ui`, `@admin`, `@regression`, `@negative`

### PIM Tests

- ✅ Search employee (positive): `@ui`, `@pim`, `@smoke`, `@positive`
- ❌ Search employee (negative): `@ui`, `@pim`, `@regression`, `@negative`
- ✅ Add employee (positive): `@ui`, `@pim`, `@smoke`, `@positive`, `@critical`
- ❌ Add employee (negative): `@ui`, `@pim`, `@regression`, `@negative`

### Leave Tests

- ✅ Apply leave (positive): `@ui`, `@leave`, `@smoke`, `@positive`
- ❌ Apply leave (negative): `@ui`, `@leave`, `@regression`, `@negative`

---

## CI/CD Integration

Update your `.github/workflows/playwright.yml`:

```yaml
- name: Run Smoke Tests
  run: npx playwright test --grep @smoke

- name: Run Full Regression
  run: npx playwright test --grep @regression
  if: github.event_name == 'pull_request'
```
