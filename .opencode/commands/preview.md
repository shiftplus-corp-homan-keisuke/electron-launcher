---
description: Preview server management
---

Manage the preview server: start, stop, restart, status check.

## Usage

- `/preview` - Show current status
- `/preview start` - Start server
- `/preview stop` - Stop server
- `/preview restart` - Restart server
- `/preview check` - Health check

$ARGUMENTS

## Steps

### If no arguments or "status"
1. Check if server is running
   - Run: !`ps aux | grep -E "(npm|node|next|vite|python|uvicorn)" | grep -v grep`
2. Show current status with URL

### If "start"
1. Check if already running
   - Run: !`ps aux | grep -E "(npm|node|next|vite|python|uvicorn)" | grep -v grep`
2. Detect project type and start appropriate server
   - Next.js: `npm run dev`
   - Vite: `npm run dev`
   - Python/FastAPI: `uvicorn main:app --reload`
   - Python/Flask: `flask run`
3. Show URL (usually http://localhost:3000 or similar)

### If "stop"
1. Find running server process
   - Run: !`ps aux | grep -E "(npm|node|next|vite|python|uvicorn)" | grep -v grep`
2. Stop the process gracefully
   - Run: !`pkill -f "next dev"` or appropriate command

### If "restart"
1. Stop the server
2. Wait 2 seconds
3. Start the server again

### If "check"
1. Verify server is responding
   - Run: !`curl -s http://localhost:3000 > /dev/null && echo "OK" || echo "Not responding"`
2. Show health status

## Output Format

For status:
```
=== Preview Status ===

🌐 URL: [url]
📁 Project: [path]
🏷️ Type: [type]
💚 Health: [OK/Not Running]
```

For start:
```
🚀 Starting preview...
   Port: [port-number]
   Type: [server-type]

✅ Preview ready!
   URL: [url]
```

For port conflict:
```
⚠️ Port [port] is in use.

Options:
1. Start on port [alternative-port]
2. Close app on [port]
3. Specify different port

Which one? (default: 1)
```

Manage the preview server based on the arguments provided.
