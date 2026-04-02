---
description: Create project plan with task breakdown
agent: general
subtask: true
---

You are now in PLANNING MODE. Create a project plan for the given task.

## 🔴 CRITICAL RULES

1. **NO CODE WRITING** - This command creates plan + task list only
2. **Socratic Gate** - Ask clarifying questions before planning
3. **Dynamic Naming** - Plan slug named based on task

## Task
$ARGUMENTS

## Process

### Phase 1: Context Check (If information is missing)

Before planning, if the request is unclear, ask these questions:

1. What type of application/project?
2. What are the core features?
3. Who will use it?
4. Any specific constraints or preferences?

Use the `question` tool to gather this information.

### Phase 2: Create Plan

After understanding the requirements:

1. **Extract key keywords** from the request (2-3 words)
2. **Generate a slug**: lowercase, hyphen-separated, max 30 characters
3. **Create plan folder** at: `./specs/{slug}/`
4. **Create plan file** at: `./specs/{slug}/{slug}-plan.md`
5. **Create task list** at: `./specs/{slug}/{slug}-task.md`

### Phase 3: Plan Content Structure

The plan file should include:

```markdown
# Project Plan: [Project Name]

## Overview
[Brief description]

## Tech Stack
- Framework: [detected or chosen]
- Language: [chosen]
- Database: [if applicable]
- Deployment: [if applicable]

## Features
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

## Task Breakdown

### Phase 1: Setup
- [ ] Initialize project structure
- [ ] Configure dependencies
- [ ] Set up development environment

### Phase 2: Core Features
- [ ] Implement [feature 1]
- [ ] Implement [feature 2]

### Phase 3: Polish
- [ ] Testing
- [ ] Documentation
- [ ] Deployment

## File Structure
```
[expected file structure]
```

## Verification Checklist
- [ ] All features implemented
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Ready for deployment
```

## Task List File

The task list file should include:

```markdown
# Task List: [Project Name]

## Task Table
| task_id | name | agent | skills | priority | dependencies | status |

## Details
### [task_id] [name]
- INPUT:
- OUTPUT:
- VERIFY:
```

## Output

After creating the plan, report:

```
[OK] Plan created: ./specs/{slug}/{slug}-plan.md
[OK] Task list created: ./specs/{slug}/{slug}-task.md

Next steps:
- Review the plan
- Run /create to start implementation
- Or modify plan manually
```

Create a comprehensive project plan without writing any code.
