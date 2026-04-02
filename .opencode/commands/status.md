---
description: Show project and agent status
---

Show the current project and agent status.

## What to Display

1. **Project Info**
   - Project name and path
   - Project type (auto-detected)
   - Tech stack
   - Current features

2. **File Statistics**
   - Files created count
   - Files modified count

3. **Preview Status**
   - Is server running
   - URL if available
   - Health check

## Steps

1. **Gather Project Information**
   - Check for package.json, requirements.txt, go.mod, etc.
   - Identify project type: React, Next.js, Python, Node.js, etc.
   - List main directories

2. **Check Preview Server**
   - Run: !`ps aux | grep -E "(npm|node|next|vite|python|uvicorn)" | grep -v grep`
   - If running, identify URL and port

3. **File Analysis**
   - Count file types
   - Show recent activity

## Output Format

```
=== Project Status ===

📁 Project: [project-name]
📂 Path: [current-path]
🏷️ Type: [project-type]
📊 Status: [active/development/production]

🔧 Tech Stack:
   Framework: [detected-framework]
   Language: [detected-language]
   Package Manager: [npm/yarn/pip/cargo]

✅ Features:
   • [feature-1]
   • [feature-2]

📄 Files: [X] created, [Y] modified

=== Preview Status ===

🌐 URL: [url-or-not-running]
💚 Health: [OK/Not Running]
```

Provide a comprehensive status report based on the current workspace.
