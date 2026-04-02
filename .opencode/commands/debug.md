---
description: Systematic problem investigation and debugging
---

You are now in DEBUG mode for systematic problem investigation.

## Task
$ARGUMENTS

## Process

### Phase 1: Gather Information

1. **Understand the symptom**
   - What error message?
   - What was the user doing?
   - What was expected vs actual behavior?

2. **Check recent changes**
   - Run: !`git log --oneline -10`
   - Run: !`git diff HEAD~1`
   - Identify what changed recently

3. **Examine the code**
   - Use `Grep` to search for error messages
   - Use `Read` to examine relevant files
   - Check for common issues

### Phase 2: Form Hypotheses

List possible causes in order of likelihood:

1. **Most likely cause** - [explanation]
2. **Second possibility** - [explanation]
3. **Less likely cause** - [explanation]

### Phase 3: Investigate Systematically

Test each hypothesis:

1. **Check logs**
   - Run: !`tail -f logs/*.log 2>/dev/null || echo "No logs found"`
   - Run: !`journalctl -u service-name -n 50 2>/dev/null || echo "No journal logs"`

2. **Validate data flow**
   - Trace the code path
   - Check input/output at each step
   - Use `Read` to examine intermediate states

3. **Test fixes locally**
   - Use `Edit` to apply potential fixes
   - Test each fix independently
   - Use elimination method

### Phase 4: Fix and Prevent

1. **Apply the correct fix**
   - Use `Edit` to fix the issue
   - Verify the fix works
   - Check for side effects

2. **Explain root cause**
   - Why did this happen?
   - What was the actual problem?

3. **Add prevention measures**
   - Add validation
   - Write tests
   - Update documentation
   - Suggest code improvements

## Output Format

```markdown
## 🔍 Debug: [Issue]

### 1. Symptom
[What's happening]

### 2. Information Gathered
- Error: `[error message]`
- File: `[filepath]`
- Line: [line number]
- Recent changes: [summary]

### 3. Hypotheses
1. ❓ [Most likely cause]
2. ❓ [Second possibility]
3. ❓ [Less likely cause]

### 4. Investigation

**Testing hypothesis 1:**
[What I checked] → [Result]

**Testing hypothesis 2:**
[What I checked] → [Result]

### 5. Root Cause
🎯 **[Explanation of why this happened]**

### 6. Fix
[Code changes made]

### 7. Prevention
🛡️ [How to prevent this in the future]
```

## Key Principles

- **Ask before assuming** - get full error context
- **Test hypotheses** - don't guess randomly
- **Explain why** - not just what to fix
- **Prevent recurrence** - add tests, validation
- **Document** - leave clear comments

## Usage Examples

- `/debug login not working`
- `/debug API returns 500 error`
- `/debug form doesn't submit`
- `/debug data not saving to database`

Investigate systematically and provide lasting solutions.
