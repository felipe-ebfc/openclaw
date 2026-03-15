# EBFC AI Admin Guide

This guide is for Felipe. It covers how to add users, monitor the platform, troubleshoot issues, and think about scaling.

This is the technical layer — not for beta users.

---

## Adding a New Beta User

### Step 1: Invite to Google Chat Space

1. Open the EBFC AI Google Chat Space
2. Click the Space name > "Add people & bots"
3. Enter the user's Google or work email address
4. Send the invite — they'll get an email notification

### Step 2: Provision Their Container

Each user runs in an isolated Docker container on the server. To add a new user:

```bash
# SSH into the server
ssh deploy@your-server-host

# Navigate to the EBFC compose directory
cd /opt/ebfc-ai

# Create a user-specific .env override
# Replace 'newuser' with a short identifier (e.g., first name, lowercase)
USER_ID=newuser docker compose up -d --scale openclaw-gateway=1
```

Or if you're using the per-user compose file approach:

```bash
# Copy the template compose file for this user
cp docker-compose.yml users/newuser/docker-compose.yml

# Edit USER_ID in the new file
nano users/newuser/docker-compose.yml

# Start the user's stack
docker compose -f users/newuser/docker-compose.yml up -d
```

### Step 3: Verify It's Running

```bash
# Check all running containers
docker ps | grep ebfc

# Test the health endpoint for the user's container
curl http://localhost:18789/healthz
# Should return: {"status":"ok"}

# Send a test message via the gateway
# (Or just message "ping" as the user in Google Chat and confirm Osito responds)
```

### Step 4: Seed the User's Memory (Optional but Recommended)

If you collected onboarding info from the user before they start, you can pre-seed their Open Brain memory:

```bash
# Inside the user's container
docker exec -it <container_name> bash

# Run the cold-start seeder with their info
# (Once implemented — see cold-start-seed.py template)
python3 templates/cold-start-seed.py \
  --user-id newuser \
  --name "John Smith" \
  --role "Project Manager" \
  --company "Turner Construction" \
  --project "Riverside Commons"
```

Note: The cold-start seeder is planned but not yet built. Until it exists, guide the user through the profile setup themselves on Day 1 using the quick-start guide.

---

## Monitoring User Activity

### Check Container Health

```bash
# All containers and their status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Health check status
docker inspect <container_name> --format='{{.State.Health.Status}}'

# Last 100 lines of gateway logs for a user
docker logs <container_name> --tail 100

# Follow live logs
docker logs <container_name> -f
```

### Check Session Activity

Look for these log patterns to confirm a user is active:

```bash
# Messages processed (user activity)
docker logs <container_name> 2>&1 | grep "message received"

# Memory writes (Osito learning new context)
docker logs <container_name> 2>&1 | grep "memory:store"

# Skill executions
docker logs <container_name> 2>&1 | grep "skill:run"
```

### Ollama (Embeddings) Health

The Ollama service handles all memory embeddings. If it's down, memory search breaks.

```bash
# Check Ollama is running
docker compose ps ollama

# Test embedding endpoint
curl http://localhost:11434/api/embeddings \
  -d '{"model":"nomic-embed-text","prompt":"test"}'
# Should return a vector array

# Pull the embedding model if missing
docker compose exec ollama ollama pull nomic-embed-text
```

---

## Updating Skills or Config

### Update a Config Value

Config lives in the mounted config directory. To change a setting:

```bash
# Find the config file location
echo $OPENCLAW_CONFIG_DIR
# Usually: /data/config or /home/node/.openclaw/config

# Edit the config (example: adjust model routing)
nano $OPENCLAW_CONFIG_DIR/config.json

# Restart the gateway to apply changes
docker compose restart openclaw-gateway
```

Key config values to know:

| Setting | What it controls | Current value |
|---------|-----------------|---------------|
| `agents.defaults.memorySearch.provider` | Embedding engine | `ollama` |
| `gateway.channelHealthCheckMinutes` | How often channels are checked | `60` |
| `models.providers.ollama.baseUrl` | Ollama endpoint | `http://ollama:11434` |

### Deploy a New Skill

AEC skills live in `extensions/ebfc-aec/` (once built). To deploy an update:

```bash
# On your dev machine: build and push the updated image
docker build -t ebfc-ai:latest .
docker push your-registry/ebfc-ai:latest

# On the server: pull and restart
docker pull your-registry/ebfc-ai:latest
docker compose up -d --force-recreate openclaw-gateway
```

For beta (pre-registry setup), you can build directly on the server:

```bash
cd /opt/ebfc-ai
git pull origin main
docker compose build
docker compose up -d --force-recreate openclaw-gateway
```

---

## Troubleshooting

### User Can't Reach the Bot (No Response in Google Chat)

1. **Check the container is running:**
   ```bash
   docker ps | grep ebfc
   ```
   If the container isn't listed, start it: `docker compose up -d`

2. **Check the health endpoint:**
   ```bash
   curl http://localhost:18789/healthz
   ```
   If this fails, the gateway is down — check logs: `docker logs openclaw-gateway --tail 50`

3. **Check the Google Chat channel connection:**
   ```bash
   docker logs openclaw-gateway 2>&1 | grep -i "channel\|telegram\|chat" | tail 20
   ```

4. **Restart the gateway:**
   ```bash
   docker compose restart openclaw-gateway
   ```
   Wait 30 seconds, then test again.

---

### Bot Not Responding to Messages (Container Running but Silent)

1. **Check for errors in the logs:**
   ```bash
   docker logs openclaw-gateway --tail 100 2>&1 | grep -i "error\|warn\|fail"
   ```

2. **Check the model provider is reachable:**
   The default model is Kimi K2.5 via Together AI. If Together AI is down, requests fail silently.
   ```bash
   # Test Together AI connectivity
   curl -s https://api.together.xyz/health 2>/dev/null || echo "Together AI unreachable"
   ```
   If Together AI is down, the fallback to Claude should kick in automatically. If neither works, check your API key config.

3. **Check Ollama for embedding failures:**
   If memory search is broken, Osito may fail on queries that require it.
   ```bash
   docker compose ps ollama
   docker logs ollama --tail 30
   ```

---

### Memory Issues (Osito Doesn't Remember Things)

1. **Verify memory writes are working:**
   ```bash
   docker logs openclaw-gateway 2>&1 | grep "memory" | tail 20
   ```

2. **Test the Open Brain API directly:**
   ```bash
   curl https://brain-api.ebfc.ai/health
   # Should return: {"status":"ok"}
   ```

3. **Check Ollama embeddings:**
   Embeddings must work for memory search to function.
   ```bash
   curl http://localhost:11434/api/embeddings \
     -d '{"model":"nomic-embed-text","prompt":"hello"}'
   ```
   If this returns an error, pull the model:
   ```bash
   docker compose exec ollama ollama pull nomic-embed-text
   ```

4. **Check user schema isolation:**
   Each user's memory is stored in a separate Supabase schema (`user_{id}`). If a user is seeing someone else's data (shouldn't happen), check that `USER_ID` is set correctly in their container environment.

---

### Container Keeps Restarting

```bash
# Check restart count and last error
docker inspect <container_name> | grep -A5 "RestartCount\|Error"

# Read the last crash log
docker logs <container_name> --tail 50
```

Common causes:
- Out of memory: Increase container memory limit in `docker-compose.yml`
- Port conflict: Another process is on port 18789 — check with `lsof -i :18789`
- Config syntax error: Validate your config JSON with `python3 -m json.tool config.json`

---

## Scaling: Adding Users 11 and Beyond

The current setup runs one container per user. This works cleanly up to ~20 users on a mid-size VPS (4 core, 8GB RAM). Beyond that, you have options:

### Short term (users 11-25)
- Upgrade server to 8 core / 16GB RAM
- One Ollama instance is shared across all user containers — this scales fine for embeddings
- Each user container uses ~200-400MB RAM at idle

### Medium term (25-100 users)
- Move to Render.com or Fly.io with auto-scaling (see `render.yaml` in the repo)
- Each user gets a Render service — billing is per service
- Supabase handles memory isolation automatically via per-user schemas

### Pricing check at scale
At 100 users on Starter ($49/mo):
- Revenue: $4,900/mo
- Infra target (97% margin): ~$147/mo infra budget
- Kimi K2.5 cost per active user at ~50K tokens/day: ~$0.05/user/day = $5/user/mo
- Supabase: ~$25/mo for 100 users (pgvector, standard plan)
- VPS: ~$80/mo (16 core, 32GB for gateway fleet)

Monitor token usage per user monthly. High-volume users (>200K tokens/day) may need to be on Pro or Enterprise tier.

---

## Useful Commands Reference

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# Restart just the gateway
docker compose restart openclaw-gateway

# View all logs live
docker compose logs -f

# Get a shell inside the gateway container
docker exec -it openclaw-gateway bash

# Check Ollama models loaded
docker compose exec ollama ollama list

# Pull the embedding model
docker compose exec ollama ollama pull nomic-embed-text

# Health check
curl http://localhost:18789/healthz
```
