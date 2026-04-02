---
description: Generate and manage project documentation automatically
agent: general
subtask: true
---

You are now in DOCS mode for automatic documentation generation.

## Task
$ARGUMENTS

## Process

### Phase 1: Command Analysis

Parse the user's request to determine the action:

**Available subcommands:**
- `generate` - Generate all documentation
- `generate --type [api|components|architecture]` - Generate specific type
- `update` - Update only changed files
- `serve` - Start documentation preview server
- `config init` - Create configuration file

**Examples:**
- `/docs generate` → Generate all documentation
- `/docs generate --type api` → Generate API docs only
- `/docs update` → Update changed files
- `/docs serve` → Start preview server
- `/docs config init` → Create .docsrc.json

### Phase 2: Configuration Check

1. **Check for `.docsrc.json`** configuration file
   - If missing and command is `generate` or `update`: Ask user to run `/docs config init` first
   - If `config init`: Create the configuration file

2. **Load configuration** if exists:
   ```json
   {
     "outputDir": "docs",
     "include": ["src/**/*.{ts,tsx}"],
     "exclude": ["**/*.test.{ts,tsx}", "**/node_modules/**"],
     "generators": {
       "api": { "enabled": true, "format": ["markdown", "openapi"], "output": "docs/api" },
       "components": { "enabled": true, "format": ["markdown", "storybook"], "output": "docs/components" },
       "architecture": { "enabled": true, "format": ["mermaid"], "output": "docs/architecture" }
     }
   }
   ```

### Phase 3: Documentation Generation

#### For `generate` command:

1. **Call the docs generator script:**
   ```bash
   python3 .opencode/scripts/docs_generator.py generate
   ```

2. **Verify output** was created in the configured directory

3. **Report results** to the user

#### For `update` command:

1. **Check for recent changes** using git:
   ```bash
   git diff --name-only HEAD~1
   ```

2. **Run incremental generation:**
   ```bash
   python3 .opencode/scripts/docs_generator.py update --files [changed files]
   ```

#### For `serve` command:

1. **Start preview server:**
   - Check if docs directory exists
   - Start a simple HTTP server or use existing preview system
   - Display URL to user

#### For `config init` command:

1. **Create `.docsrc.json`** in project root
2. **Detect project type** (Next.js, React, FastAPI, etc.)
3. **Generate appropriate default configuration**
4. **Create output directories** if they don't exist

### Phase 4: Quality Check

After generation:

1. **Verify all output files exist**
2. **Check for errors or warnings** in the generator output
3. **Run documentation validation** if available
4. **Report summary** to user

## Key Principles

- **Configuration first**: Always check for `.docsrc.json` before generating
- **Incremental updates**: Only regenerate what's necessary
- **Clear feedback**: Report what was generated, what failed, and why
- **Type safety**: Parse TypeScript types accurately
- **Standards compliance**: Generate OpenAPI 3.0, Mermaid, etc.

## Output Format

Provide clear, structured feedback:

```
✅ Documentation generated successfully!

📁 Output Directory: docs/

📝 Generated Files:
   - docs/api/endpoints.md (12 endpoints)
   - docs/api/openapi.json
   - docs/components/Button.md
   - docs/architecture/file-tree.md

⏱️  Generation Time: 2.3s

💡 Next Steps:
   - Run: /docs serve to preview
   - Review: docs/ directory
```

For errors:

```
❌ Documentation generation failed

🔴 Error: [error message]

💡 Solution: [suggested fix]
```

## Integration with Other Commands

- **After `/create`**: Offer to generate initial documentation
- **After `/enhance`**: Suggest running `/docs update`
- **Before `/deploy`**: Check if docs are up to date

## Technical Notes

- The generator uses Python scripts in `.opencode/scripts/`
- Templates are stored in `.opencode/templates/docs/`
- Supports TypeScript, JSDoc, and comment-based documentation
- Outputs Markdown, OpenAPI JSON/YAML, and Mermaid diagrams
