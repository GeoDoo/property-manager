# Cypress Test Suite for Property Manager

This directory contains E2E and integration tests for the Property Manager application using Cypress.

## Test Structure

The test suite is organized into the following categories:

- **Basic Tests** (`cypress/e2e/basic.cy.ts`): Simple tests to verify that Cypress is working correctly
- **API Tests** (`cypress/e2e/api/`):
  - `mock-api.cy.ts`: Tests that use fixtures to mock API responses
  - `api-integration.cy.ts`: Tests that verify API integration
- **Authentication Tests** (`cypress/e2e/auth/`): 
  - `login.cy.ts`: Tests for the login functionality
- **Properties Tests** (`cypress/e2e/properties/`):
  - `property-list-advanced.cy.ts`: Advanced tests for property listing functionality
  - `property-details.cy.ts`: Tests for property details page
  - `property-management-po.cy.ts`: Tests for property management with Page Object pattern
- **Visual Tests** (`cypress/e2e/visual/`):
  - `layout.cy.ts`: Tests for visual layout consistency

## Fixtures

- `properties.json`: Sample property data for testing
- `users.json`: Sample user data for testing

## Page Objects

Page objects are located in `cypress/support/pages/` and provide abstraction for UI interactions.

## Custom Commands

Custom Cypress commands are defined in `cypress/support/commands.ts`.

## Running Tests

You can run tests using npm scripts:

```bash
# Open Cypress Test Runner
npm run cy:open

# Run all tests
npm run cy:run:all

# Run specific test groups
npm run cy:run:basic
npm run cy:run:api
npm run cy:run:visual

# Run a specific test file
npx cypress run --spec "cypress/e2e/basic.cy.ts"
```

## Troubleshooting

If tests are failing:

1. Ensure the application is running at http://localhost:5173
2. Check that fixtures are properly formatted
3. Verify that selectors match actual elements in the application
4. Try running tests in Cypress open mode to debug visually

## Test Results

Current test status:

- **Basic tests**: ✅ All passing (3/3)
- **API tests**: 
  - ✅ `api-integration.cy.ts`: 2 passing, 2 skipped
  - ✅ `mock-api.cy.ts`: All passing (4/4)
- **Authentication tests**: 
  - ⚠️ `login.cy.ts`: 2 passing, 4 failing
- **Properties tests**:
  - ⚠️ `property-details.cy.ts`: 1 passing, 1 failing, 3 skipped
  - ⚠️ `property-list-advanced.cy.ts`: 3 passing, 5 failing
  - ❌ `property-list-po.cy.ts`: 0 passing, 3 failing
  - ⚠️ `property-list.cy.ts`: 1 passing, 3 failing
  - ❌ `property-management-po.cy.ts`: 0 passing, 1 failing, 2 skipped
  - ❌ `property-management.cy.ts`: 0 passing, 1 failing, 2 skipped
- **Visual tests**:
  - ⚠️ `layout.cy.ts`: 3 passing, 1 failing

### Test Development Status

The test suite currently includes comprehensive coverage of application features, but some tests fail because:

1. The application UI doesn't match the selectors used in tests
2. Certain features being tested may not be implemented yet
3. Authentication flow doesn't currently work as expected in tests

## Next Steps

To improve the test suite:

1. **Update selectors**: As you develop the UI, update the data-testid attributes to match the ones used in the tests
2. **Implement missing features**: Add the features tests are expecting, such as filters and pagination
3. **Fix authentication flow**: Ensure the login/logout functionality works as expected in tests

For quick tests during development, use:
```bash
npm run cy:run:basic
``` 