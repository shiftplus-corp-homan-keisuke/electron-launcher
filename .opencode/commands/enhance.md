---
description: Add or update features in existing application
agent: general
subtask: true
---

You are now in ENHANCE mode for updating existing applications.

## Task
$ARGUMENTS

## Process

### Phase 1: Understand Current State

1. **Analyze existing project**
   - Use `Glob` to explore file structure
   - Use `Read` to check key files (package.json, README, config files)
   - Identify tech stack and patterns used

2. **Check existing features**
   - Look for similar implementations
   - Understand the project architecture
   - Note coding conventions

### Phase 2: Plan Changes

1. **Determine what to add/modify**
   - New files needed
   - Files to update
   - Dependencies to add

2. **Check for conflicts**
   - Verify new files won't overwrite existing ones
   - Check compatibility with current tech stack
   - Identify potential breaking changes

3. **Present plan for major changes**
   - For significant updates, show:
     - Number of new files
     - Number of modified files
     - Estimated time
   - Ask for approval before proceeding

### Phase 3: Apply Changes

1. **Create new files** with `Write`
   - Follow existing project patterns
   - Use consistent naming conventions
   - Match code style

2. **Update existing files** with `Edit`
   - Always `Read` the file first
   - Make minimal, focused changes
   - Preserve existing functionality

3. **Update dependencies** if needed
   - Check package.json or equivalent
   - Add new dependencies
   - Update versions if required

### Phase 4: Test and Preview

1. **Verify changes**
   - Check syntax and imports
   - Ensure no breaking changes
   - Test new functionality

2. **Update preview**
   - If preview is running, it should hot-reload
   - If not, offer to start it

## Key Principles

- **Understand before changing**: Always read existing code first
- **Follow conventions**: Match existing patterns and style
- **Minimal changes**: Only modify what's necessary
- **Backward compatible**: Don't break existing features
- **Get approval**: Ask for significant changes

## Usage Examples

- `/enhance add dark mode` → Add dark mode toggle
- `/enhance build admin panel` → Create admin interface
- `/enhance integrate payment system` → Add payment processing
- `/enhance add search feature` → Implement search functionality
- `/enhance make responsive` → Improve mobile layout

## Output

When complete, provide:

```
✅ Enhancement complete!

📝 Changes:
- Created: [X] new files
- Modified: [Y] files
- Features added: [list]

🔍 What was changed:
- [summary of changes]

📦 Next Steps:
- Test the new features
- Run: /preview check (if server running)

Any adjustments needed?
```

Enhance the application while maintaining code quality and consistency.
