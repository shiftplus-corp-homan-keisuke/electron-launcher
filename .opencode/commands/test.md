---
description: Test generation and execution
---

You are now in TEST mode for generating and running tests.

## Task
$ARGUMENTS

## Usage

- `/test` - Run all tests
- `/test [file/feature]` - Generate tests for specific target
- `/test coverage` - Show test coverage report
- `/test watch` - Run tests in watch mode

## Process

### Phase 1: Determine Intent

If `$ARGUMENTS` is empty or "all":
- Run all tests

If `$ARGUMENTS` is a file path or feature name:
- Generate tests for that specific target

If `$ARGUMENTS` is "coverage":
- Show test coverage report

If `$ARGUMENTS` is "watch":
- Run tests in watch mode

### Phase 2: Run Existing Tests

When running tests:

1. **Detect test framework**
   - Check for Jest (package.json: "jest" in scripts)
   - Check for Vitest (package.json: "vitest" in devDependencies)
   - Check for pytest (requirements.txt or pyproject.toml)
   - Check for other frameworks

2. **Run tests**
   - Run: !`npm test 2>&1 || python -m pytest 2>&1 || go test ./... 2>&1`
   - Capture output
   - Parse results

3. **Show results**
   ```
   🧪 Running tests...

   ✅ auth.test.ts (5 passed)
   ✅ user.test.ts (8 passed)
   ❌ order.test.ts (2 passed, 1 failed)

   Failed:
     ✗ should calculate total with discount
       Expected: 90
       Received: 100

   Total: 15 tests (14 passed, 1 failed)
   ```

### Phase 3: Generate Tests

When generating new tests:

1. **Analyze the code**
   - Use `Read` to examine the target file
   - Identify functions and methods
   - Find edge cases
   - Detect dependencies to mock

2. **Generate test cases**
   - Happy path tests
   - Error cases
   - Edge cases
   - Integration tests (if needed)

3. **Write tests**
   - Use `Glob` to find existing test files
   - Match project's test framework (Jest, Vitest, pytest, etc.)
   - Follow existing test patterns
   - Use `Write` to create test file

4. **Test Structure** (Jest/Vitest example):
   ```typescript
   describe('[Feature]', () => {
     describe('[Function]', () => {
       it('should [expected behavior]', async () => {
         // Arrange
         const input = [test data];

         // Act
         const result = await function(input);

         // Assert
         expect(result).toBe([expected]);
       });

       it('should handle [error case]', async () => {
         // Arrange
         const input = [invalid data];

         // Act & Assert
         await expect(function(input)).rejects.toThrow('[error]');
       });
     });
   });
   ```

### Phase 4: Coverage Report

When showing coverage:

1. **Run coverage**
   - Run: !`npm test -- --coverage 2>&1 || python -m pytest --cov=. 2>&1`
   - Parse coverage percentage

2. **Display results**
   ```
   📊 Test Coverage

   Overall: 78%

   By File:
   ✅ src/utils/helpers.ts    95%
   ⚠️  src/services/auth.ts    72%
   ❌ src/components/Button.ts 45%

   Recommendation: Improve Button.ts coverage
   ```

## Output Format

For test generation:
```markdown
## 🧪 Tests: [Target]

### Test Plan
| Test Case | Type | Coverage |
|-----------|------|----------|
| Should create user | Unit | Happy path |
| Should reject invalid email | Unit | Validation |
| Should handle db error | Unit | Error case |

### Generated Tests

[Code block with tests]

---

Run with: `npm test`
```

## Key Principles

- **Test behavior not implementation**
- **One assertion per test** (when practical)
- **Descriptive test names**
- **Arrange-Act-Assert pattern**
- **Mock external dependencies**
- **Follow project conventions**

## Usage Examples

- `/test` → Run all tests
- `/test src/services/auth.service.ts` → Generate tests for auth service
- `/test user registration flow` → Generate integration tests
- `/test coverage` → Show coverage report
- `/test fix failed tests` → Fix failing tests

Generate comprehensive tests and ensure code quality.
