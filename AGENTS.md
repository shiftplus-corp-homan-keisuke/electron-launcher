# OpenCode Workspace Configuration

## Overview

This workspace uses OpenCode's native agent, skill, and command system.

---

## 📁 Directory Structure

```
.opencode/
├── agents/              # 20 specialist agents
│   ├── orchestrator.md (primary)
│   ├── project-planner.md (primary)
│   └── [18 subagents]
├── skills/              # 47 domain-specific skills
│   ├── nextjs-react-expert/
│   ├── clean-code/
│   └── [45 more]
├── commands/            # 11 custom commands
│   ├── create.md
│   ├── debug.md
│   └── [9 more]
├── scripts/             # Utility scripts
│   ├── auto_preview.py
│   ├── checklist.py
│   ├── verify_all.py
│   └── session_manager.py
└── README.md            # Command documentation
```

---

## 🤖 Agent & Skill Protocol

### Skill Loading (OpenCode Native)

OpenCode automatically discovers skills from `.opencode/skills/*/SKILL.md`. Agents use the `skill` tool to load relevant skills on-demand.

**Loading a skill**:
```
Use the skill tool to load nextjs-react-expert
```

**Automatic discovery**: Skills are listed in the `skill` tool description. Agents can see available skills and load them when relevant.

### Agent Selection

**Primary Agents** (use **Tab** key to cycle):
- `@orchestrator` - Multi-agent coordination for complex tasks
- `@project-planner` - Task breakdown and planning

**Subagents** (mention with `@`):
- `@frontend-specialist` - React/Next.js/UI development
- `@backend-specialist` - Node.js/Python/API development
- `@database-architect` - Database schema design
- `@security-auditor` - Security review
- `@test-engineer` - Testing strategy
- `@devops-engineer` - Deployment/CI/CD
- `@debugger` - Systematic debugging
- `@performance-optimizer` - Performance optimization
- [Full list in `.opencode/agents/`]

**Note**: OpenCode uses `@mentions` for explicit agent selection. The system will auto-suggest agents based on your request context.

---

## 📥 Request Classification

| Type | Triggers | Action |
|------|----------|--------|
| **Question** | "what is", "how does", "explain" | Direct answer |
| **Survey** | "analyze", "list files", "overview" | Use `@explore` or `@explorer-agent` |
| **Simple Code** | "fix", "add" (single file) | Direct edit |
| **Complex Code** | "build", "create", "implement" | Use `/orchestrate` command or `@project-planner` |
| **Design** | "design", "UI", "dashboard" | Use `/ui-ux-pro-max` command |
| **Debug** | "bug", "error", "not working" | Use `/debug` command |
| **Test** | "test", "coverage" | Use `/test` command |
| **Deploy** | "deploy", "production" | Use `/deploy` command |

---

## 🎯 Universal Rules (Always Active)

### Language Handling

When user's prompt is NOT in English:
1. Internally translate for better comprehension
2. Respond in user's language - match their communication
3. Code comments/variables remain in English

**Japanese Language Settings**:
When user's prompt is in Japanese:
- **Responses**: Output in Japanese
- **Thought process**: Think and reason in Japanese
- **Plans and tasks**: Create all artifacts (plans, todo lists, documentation) in Japanese
- **Code comments/variables**: Remain in English

### Clean Code (Global Mandatory)

**ALL code MUST follow `clean-code` skill rules.** Load it with:
```
skill({ name: "clean-code" })
```

**Core principles**:
- **Code**: Concise, direct, no over-engineering. Self-documenting.
- **Testing**: Mandatory. Pyramid (Unit > Int > E2E) + AAA Pattern.
- **Performance**: Measure first. Adhere to 2025 standards (Core Web Vitals).
- **Safety**: Verify secrets security before deployment.

### Read → Understand → Apply

```
❌ WRONG: Read agent file → Start coding
✅ CORRECT: Read → Understand WHY → Apply PRINCIPLES → Code
```

**Before coding, answer**:
1. What is the GOAL of this agent/skill?
2. What PRINCIPLES must I apply?
3. How does this DIFFER from generic output?

---

## 🔧 Available Commands

Type `/` in OpenCode TUI to access custom commands:

| Command | Description |
|---------|-------------|
| `/status` | Show project and agent status |
| `/preview [start|stop|restart]` | Manage preview server |
| `/brainstorm [topic]` | Structured idea exploration |
| `/plan [task]` | Create project plan |
| `/create [app]` | Build new application |
| `/enhance [feature]` | Add features to existing app |
| `/debug [issue]` | Debug problems |
| `/test [file|coverage]` | Generate/run tests |
| `/deploy [check|preview|prod]` | Deploy to production |
| `/orchestrate [task]` | Coordinate multiple agents |
| `/ui-ux-pro-max [query]` | Design system recommendations |

---

## 🎨 Available Skills (Key Skills)

### Frontend
- `nextjs-react-expert` - React/Next.js optimization (57 rules)
- `tailwind-patterns` - Tailwind CSS utilities
- `web-design-guidelines` - UI/UX audit (100+ rules)
- `frontend-design` - Design systems and components

### Backend
- `api-patterns` - REST/GraphQL/tRPC patterns
- `database-design` - Schema optimization
- `python-patterns` - Python standards
- `nodejs-best-practices` - Node.js best practices

### Testing & Quality
- `testing-patterns` - Jest/Vitest/pytest strategies
- `systematic-debugging` - 4-phase debugging methodology
- `vulnerability-scanner` - Security auditing
- `clean-code` - Pragmatic coding standards

### Development Workflow
- `brainstorming` - Socratic questioning protocol
- `plan-writing` - Task planning and breakdown
- `tdd-workflow` - Test-driven development

**Full list**: See `.opencode/skills/` directory (48 skills)

---

## 🚀 Quick Start Examples

### Start a New Project
```
/plan e-commerce site with cart
# Review plan, then:
/create todo app
```

### Debug an Issue
```
/debug API returns 500 error
```

### Add a Feature
```
/enhance add dark mode
```

### Design UI
```
/ui-ux-pro-max fintech dashboard modern
```

### Multi-Agent Coordination
```
/orchestrate build full-stack app with authentication, database, and testing
```

---

## 🛠️ Utility Scripts

Located in `.opencode/scripts/`:

- **auto_preview.py** - Preview server management
- **checklist.py** - Core validation checks
- **verify_all.py** - Comprehensive verification
- **session_manager.py** - Session management

**Usage from commands**:
```bash
python3 .opencode/scripts/auto_preview.py start
python3 .opencode/scripts/checklist.py .
```

---

## 🔗 References

- **OpenCode Docs**: https://opencode.ai/docs/
- **Commands Reference**: `.opencode/README.md`
- **Agent Files**: `.opencode/agents/*.md`
- **Skill Files**: `.opencode/skills/*/SKILL.md`

---

**End of AGENTS.md**
