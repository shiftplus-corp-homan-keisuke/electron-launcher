---
description: Production deployment with pre-flight checks
---

You are now in DEPLOY mode for production deployment.

## Task
$ARGUMENTS

## Usage

- `/deploy` - Interactive deployment wizard
- `/deploy check` - Run pre-deployment checks only
- `/deploy preview` - Deploy to preview/staging
- `/deploy production` - Deploy to production
- `/deploy rollback` - Rollback to previous version

## Process

### Phase 1: Pre-Flight Checklist

Before any deployment, run these checks:

#### Code Quality
```bash
# TypeScript check
!`npx tsc --noEmit 2>&1 || echo "No TypeScript"`

# Linting
!`npm run lint 2>&1 || echo "No lint script"`

# Tests
!`npm test 2>&1 || echo "No test script"`
```

#### Security
```bash
# Check for secrets
!`grep -r "password\|secret\|api_key\|token" --include="*.js" --include="*.ts" --include="*.json" . 2>/dev/null | grep -v node_modules | head -5 || echo "No secrets found"`

# Dependency audit
!`npm audit 2>&1 || echo "No audit script"`
```

#### Build
```bash
# Build project
!`npm run build 2>&1 || echo "No build script"`
```

Display checklist:
```markdown
## 🚀 Pre-Deploy Checklist

### Code Quality
- [ ] No TypeScript errors
- [ ] ESLint passing
- [ ] All tests passing

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Dependencies audited

### Performance
- [ ] Bundle size acceptable
- [ ] No console.log statements
- [ ] Images optimized

### Documentation
- [ ] README updated
- [ ] CHANGELOG updated

### Ready to deploy? (y/n)
```

### Phase 2: Deployment Flow

If user confirms and checks pass:

1. **Build application**
   - Already done in pre-flight
   - Verify build output exists

2. **Detect deployment platform**
   - Check for Vercel (vercel.json, .vercel)
   - Check for Railway (railway.json)
   - Check for Fly.io (fly.toml)
   - Check for Docker (Dockerfile, docker-compose.yml)
   - Check for custom (nginx, apache)

3. **Deploy to platform**
   - Vercel: !`vercel --prod 2>&1 || echo "Vercel CLI not installed"`
   - Railway: !`railway up 2>&1 || echo "Railway CLI not installed"`
   - Fly.io: !`fly deploy 2>&1 || echo "Fly CLI not installed"`
   - Docker: !`docker compose up -d --build 2>&1 || echo "Docker not available"`

4. **Health check**
   - Monitor deployment logs
   - Verify application responds
   - Check for errors

### Phase 3: Verification

After deployment:

1. **Check deployment status**
   ```bash
   # Vercel
   !`vercel ls 2>&1 || echo "Not using Vercel"`

   # Generic health check
   !`curl -s -o /dev/null -w "%{http_code}" https://your-app.com 2>&1 || echo "Cannot reach app"`
   ```

2. **Display deployment summary**

### For Successful Deploy:
```markdown
## 🚀 Deployment Complete

### Summary
- **Version:** [version]
- **Environment:** [preview/production]
- **Duration:** [time]
- **Platform:** [platform]

### URLs
- 🌐 [Environment]: [url]
- 📊 Dashboard: [dashboard-url]

### What Changed
- [change 1]
- [change 2]
- [change 3]

### Health Check
✅ Application responding (200 OK)
✅ All services healthy
```

### For Failed Deploy:
```markdown
## ❌ Deployment Failed

### Error
[error message]

### Resolution
1. [fix step 1]
2. [fix step 2]
3. Try `/deploy` again

### Rollback Available
Previous version is still active.
Run `/deploy rollback` if needed.
```

## Platform Support

| Platform | Detection | Command |
|----------|-----------|---------|
| Vercel | vercel.json or .vercel | `vercel --prod` |
| Railway | railway.json | `railway up` |
| Fly.io | fly.toml | `fly deploy` |
| Docker | Dockerfile | `docker compose up -d --build` |

## Key Principles

- **Always run pre-flight checks**
- **Never skip tests for production**
- **Monitor deployment logs**
- **Have rollback plan ready**
- **Document deployments**

## Usage Examples

- `/deploy` → Full deployment wizard
- `/deploy check` → Run checks only
- `/deploy preview` → Deploy to staging
- `/deploy production` → Deploy to production
- `/deploy rollback` → Rollback deployment

Deploy safely with proper checks and verification.
