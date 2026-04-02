---
description: Coordinate multiple agents for complex tasks
agent: general
subtask: true
---

You are now in **ORCHESTRATION MODE**. Your task: coordinate specialized agents to solve this complex problem.

## Task to Orchestrate
$ARGUMENTS

---

## 🔴 CRITICAL: Minimum Agent Requirement

> ⚠️ **ORCHESTRATION = MINIMUM 3 DIFFERENT AGENTS**
>
> If you use fewer than 3 agents, you are NOT orchestrating - you're just delegating.
>
> **Validation before completion:**
> - Count invoked agents
> - If `agent_count < 3` → STOP and invoke more agents
> - Single agent = FAILURE of orchestration

### Agent Selection Matrix

| Task Type | REQUIRED Agents (minimum) |
|-----------|---------------------------|
| **Web App** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design** | frontend-specialist, seo-specialist, performance-optimizer |
| **Database** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | debugger, explorer-agent, test-engineer |
| **Security** | security-auditor, penetration-tester, devops-engineer |

---

## 🔴 STRICT 2-PHASE ORCHESTRATION

### PHASE 1: PLANNING (Sequential - NO parallel agents)

**Step 1:** Analyze the task
- Identify domains involved
- Determine complexity
- Check if plan exists

**Step 2:** Create plan if needed
- Use the `task` tool with `project-planner` agent
- Create comprehensive plan
- Document approach

**Step 3:** Get user approval
```
✅ Plan created

Approve to proceed with implementation? (Y/N)
- Y: Implementation starts
- N: Plan will be revised
```

> 🔴 **DO NOT proceed to Phase 2 without explicit user approval!**

### PHASE 2: IMPLEMENTATION (Parallel agents after approval)

**Invoke multiple agents in parallel using the `task` tool:**

For Web App:
```
Use the frontend-specialist agent to [frontend task]
Use the backend-specialist agent to [backend task]
Use the test-engineer agent to [testing task]
```

For API:
```
Use the backend-specialist agent to [api task]
Use the security-auditor agent to [security review]
Use the test-engineer agent to [test coverage]
```

> ✅ After user approval, invoke multiple agents in PARALLEL.

---

## Available Agent Types

When using the `task` tool, you can specify:

| Agent Type | Domain | Use For |
|------------|--------|---------|
| `general` | General-purpose | Multi-step tasks, research |
| `explore` | Codebase exploration | Finding files, understanding structure |

**Note:** OpenCode has a simpler agent system. Adapt the orchestration to use:
1. `general` agent for most tasks
2. `explore` agent for codebase discovery
3. Multiple `task` calls in parallel for different aspects

---

## Orchestration Protocol

### Step 1: Analyze Task Domains

Identify ALL domains this task touches:

```
□ Security     → Security focus
□ Backend/API  → API development
□ Frontend/UI  → UI implementation
□ Database     → Data layer
□ Testing      → Quality assurance
□ DevOps       → Deployment
□ Mobile       → Mobile support
□ Performance  → Optimization
□ SEO          → Search optimization
□ Planning     → Task breakdown
```

### Step 2: Phase Detection

| If Plan Exists | Action |
|----------------|--------|
| NO plan | → Go to PHASE 1 (create plan) |
| Plan exists + not approved | → Get approval |
| Plan exists + approved | → Go to PHASE 2 (implement) |

### Step 3: Execute Based on Phase

**PHASE 1 (Planning):**
```
Use the task tool with general agent to:
1. Analyze requirements
2. Create detailed plan
3. Identify file structure
4. List dependencies
→ STOP after plan is created
→ ASK user for approval
```

**PHASE 2 (Implementation - after approval):**

Invoke MULTIPLE task calls in PARALLEL:

```
Use the general agent to [aspect 1 of implementation]
Use the general agent to [aspect 2 of implementation]
Use the general agent to [aspect 3 of implementation]
```

**🔴 CRITICAL: Context Passing (MANDATORY)**

Each task invocation MUST include:
1. **Original User Request:** Full text of what user asked
2. **Decisions Made:** All user answers to questions
3. **Previous Work:** Summary of what was done before
4. **Current Plan State:** Relevant context

### Step 4: Verification

After all agents complete:

1. **Check file structure** with `Glob`
2. **Read key files** to verify implementation
3. **Run tests** if applicable
4. **Synthesize results**

### Step 5: Synthesize Results

Combine all agent outputs into unified report.

---

## Output Format

```markdown
## 🎼 Orchestration Report

### Task
[Original task summary]

### Phase
[Planning OR Implementation]

### Agents/Tasks Invoked (MINIMUM 3)
| # | Task/Agent | Focus Area | Status |
|---|------------|------------|--------|
| 1 | [task 1] | [area] | ✅ |
| 2 | [task 2] | [area] | ✅ |
| 3 | [task 3] | [area] | ✅ |

### Key Findings
1. **[Task 1]**: Finding
2. **[Task 2]**: Finding
3. **[Task 3]**: Finding

### Deliverables
- [ ] Plan created
- [ ] Code implemented
- [ ] Tests passing
- [ ] Verified

### Summary
[One paragraph synthesis of all work]
```

---

## 🔴 EXIT GATE

Before completing orchestration, verify:

1. ✅ **Agent Count:** `invoked_tasks >= 3`
2. ✅ **All Tasks Complete:** No pending work
3. ✅ **Report Generated:** Orchestration Report complete

> **If any check fails → DO NOT mark orchestration complete.**

---

**Begin orchestration now. Select 3+ tasks, execute strategically, synthesize results.**
