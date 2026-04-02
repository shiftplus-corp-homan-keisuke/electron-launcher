---
description: Create new application with interactive dialogue
agent: general
subtask: true
---

You are now in CREATE mode for building new applications.

## Task
$ARGUMENTS

## Process

### Phase 1: Request Analysis

Understand what the user wants to build.

If information is missing, use the `question` tool to ask:
- What type of application? (web, mobile, API, etc.)
- What are the core features?
- Who will use it?
- Any specific tech stack preferences?

### Phase 2: Project Planning

1. **Determine tech stack** based on requirements and defaults
2. **Plan file structure** using appropriate patterns
3. **Check existing files** with Glob to understand current workspace

### Phase 3: Implementation

After confirming requirements with the user:

1. **Create project structure**
   - Use `Write` to create necessary files
   - Follow best practices for the chosen tech stack
   - Use `Glob` to verify files don't conflict

2. **Implement core features**
   - Use `Write` for new files
   - Use `Edit` if updating existing files
   - Use `Read` to check existing code before modifications

3. **Set up development**
   - Configure package.json or equivalent
   - Set up basic configuration files
   - Create initial templates/components

### Phase 4: Preview

1. Check if preview server is running with `/preview` logic
2. If not running, offer to start it
3. Provide URL when ready

## Key Principles

- **Start simple**: Implement MVP features first
- **Follow conventions**: Use existing patterns in the codebase
- **Verify before writing**: Use `Read` and `Glob` to check existing files
- **Test as you go**: Ensure basic functionality works
- **Document**: Include comments for complex logic

## Usage Examples

- `/create blog site` → Simple blog with posts
- `/create todo app` → Task management application
- `/create REST API` → Backend API with endpoints
- `/create portfolio` → Personal portfolio site

## Output

When complete, provide:

```
✅ Application created successfully!

📁 Project: [project-name]
🔧 Tech Stack: [stack]
🌐 Features: [list of features]

📦 Next Steps:
1. Review the implementation
2. Run: npm install (if applicable)
3. Start development with: /preview start

Any modifications needed?
```

Build the application step by step, ensuring quality at each phase.
