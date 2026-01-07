# AgentOps Hub: Quick-Start AI Orchestrator Build Prompt

You are an expert full-stack AI development agent. Your mission: **Build AgentOps Hub (SaaS control plane for AI agents) in 6 weeks.**

## WHAT IS AGENTOPS HUB?

**Simple Definition:** "GitHub for monitoring + Datadog for cost tracking + Zapier for approvals" = multi-tenant SaaS platform where SMBs see/control/budget all their AI agents in one place.

**Core Problems Solved:**
- "I deployed 10 AI agents but have no idea what they're doing"
- "How much am I spending on AI? Which agents ROI positive?"
- "An agent did something it shouldn't have—audit trail?"
- "Red alert—pause all agents NOW"

**Users:** Founders, CTOs, ops teams, compliance officers, integrators

## YOUR TECH STACK (MANDATED)

```
Frontend:  React + TypeScript + Tailwind CSS (Vercel)
Backend:   Node.js + TypeScript + Express (Railway/Render)
Database:  PostgreSQL on Supabase (multi-tenant RLS)
Cache:     Redis (Upstash)
Jobs:      BullMQ (async task queue)
Auth:      Supabase Auth (email + OAuth)
Logs:      Winston + Sentry
SDK:       TypeScript/JavaScript (npm package)
Deploy:    Docker + GitHub Actions
```

## BUILD PLAN: 6 WEEKS, 7 PHASES

### WEEK 1-2: PHASE 1 - CORE PLATFORM (Auth, RBAC, API Gateway)

**Deliverables:**
- Supabase project setup (PostgreSQL + RLS policies)
- Auth system (signup, login, password reset, 2FA ready)
- Organization & multi-tenancy architecture
- API key management
- RBAC (Admin, TeamLead, Member, Viewer roles)
- Rate limiting middleware
- Error handling + logging
- Docker setup

**Key Tables to Create:**
```
organizations (id, name, plan, created_by)
users (id, email, full_name)
organization_members (id, org_id, user_id, role, teams)
api_keys (id, org_id, name, key_hash, scope, created_by)
audit_logs (id, org_id, actor_type, action_type, entity_type, changes, timestamp)
```

**API Endpoints:**
```
POST   /api/v1/auth/signup              → Create org + user
POST   /api/v1/auth/login               → Get JWT token
POST   /api/v1/auth/logout              → Invalidate session
POST   /api/v1/auth/refresh-token       → New JWT
GET    /api/v1/orgs/profile             → Org details
PATCH  /api/v1/orgs/profile             → Update settings
POST   /api/v1/org-members              → Invite user
GET    /api/v1/org-members              → List members
PATCH  /api/v1/org-members/:id          → Change role
DELETE /api/v1/org-members/:id          → Remove member
POST   /api/v1/api-keys                 → Generate key
GET    /api/v1/api-keys                 → List keys
DELETE /api/v1/api-keys/:id             → Revoke key
```

**Frontend Pages:**
- `/login` & `/signup` (with org creation)
- `/settings/org` (name, logo, plan)
- `/settings/members` (invite, role management)
- `/settings/api-keys` (generate, revoke, copy)

**Testing:** Unit tests for auth, RBAC, key validation

---

### WEEK 2-3: PHASE 2 - AGENT REGISTRY + RUN INGESTION

**Deliverables:**
- Agent CRUD + metadata management
- Run & Event ingestion pipeline (async, validated, deduplicated)
- Cost enrichment (calculate token cost from LLM pricing)
- Redis cache for hot data (agent stats, cost aggregates)
- BullMQ job queue for background processing
- Comprehensive logging

**Key Tables:**
```
agents (id, org_id, name, type, provider, status, tags, environment, config)
runs (id, org_id, agent_id, status, input_data, output_data, start_time, end_time, latency_ms, token_usage, cost_usd, external_reference)
events (id, run_id, org_id, event_type, timestamp, payload)
```

**API Endpoints:**
```
POST   /api/v1/agents                   → Register new agent
GET    /api/v1/agents                   → List agents (with stats)
GET    /api/v1/agents/:id               → Agent detail
PATCH  /api/v1/agents/:id               → Update agent config
DELETE /api/v1/agents/:id               → Archive agent

POST   /api/v1/ingest/run               → **Primary endpoint for AI agents**
GET    /api/v1/runs                     → List runs (filterable, paginated)
GET    /api/v1/runs/:id                 → Run detail + all events
GET    /api/v1/events/:run_id           → Get events for run
```

**Key Implementation Detail: Run Ingestion**
```
POST /api/v1/ingest/run (with API Key auth) →
  1. Validate schema
  2. Deduplicate (check if run_id already exists)
  3. Accept immediately (return 202)
  4. Queue background job:
     - Enrich cost (call LLM pricing APIs)
     - Store run + events
     - Update agent stats cache
     - Check policies (async)
     - Send notifications if needed
```

**Frontend Pages:**
- `/agents` - List with stats (runs/24h, error rate, cost)
- `/agents/:id` - Detail view (config, recent runs, stats charts)
- `/agents/:id/runs` - Filtered run history
- `/runs/:id` - Run detail with forensic timeline

**Testing:** Integration tests for full run lifecycle

---

### WEEK 3-4: PHASE 3 - OBSERVABILITY & DASHBOARDS

**Deliverables:**
- Home dashboard (KPIs, top agents, alerts)
- Agent detail dashboard (trends, errors, latency)
- Run filtering & search
- Forensic replay (timeline view of run events with full context)
- Real-time updates (Socket.io or SSE for live updates)
- Performance optimizations (indexed queries, caching)

**API Endpoints:**
```
GET    /api/v1/dashboard/home           → Org KPIs + top agents
GET    /api/v1/dashboard/agent/:id      → Agent trends + performance
GET    /api/v1/runs?filter=...          → Filtered runs with pagination
```

**Frontend Pages:**
- `/dashboard` - Home page (stats cards, charts, alerts)
- `/agents/:id/analytics` - Agent performance trends
- `/runs` - Run browser with advanced filtering

**Charts/Viz Needed:**
- Line chart: Runs over time (with filter by agent, status)
- Bar chart: Top agents by error rate / cost / volume
- Pie chart: Cost breakdown by agent / model
- Timeline: Forensic replay of events in a run
- Status indicators: Agent health (active/paused/error)

---

### WEEK 4-5: PHASE 4 - COST ANALYTICS & BUDGETING

**Deliverables:**
- Cost aggregation queries (per-agent, per-team, per-org, over time)
- Budget creation & tracking
- Alert notifications (email, in-app) at 50%, 80%, 100%
- Auto-pause agents at budget limit (optional)
- Cost export (CSV)
- Cost breakdown by model (GPT-4, Claude, etc.)

**Key Tables:**
```
budgets (id, org_id, agent_id, team_name, max_amount_usd, period, threshold_alert_percent, auto_pause_at_percent, current_spend_usd, period_start_date, period_end_date)
```

**API Endpoints:**
```
GET    /api/v1/costs/summary            → Total cost, per-agent, per-team, budget status
GET    /api/v1/costs/by-agent/:id       → Daily breakdown, model breakdown
GET    /api/v1/costs/by-team/:name      → Team cost trends
POST   /api/v1/budgets                  → Create budget
GET    /api/v1/budgets                  → List budgets
PATCH  /api/v1/budgets/:id              → Update budget thresholds
DELETE /api/v1/budgets/:id              → Delete budget
```

**Frontend Pages:**
- `/costs` - Organization cost dashboard
- `/costs/budgets` - Budget management
- `/agents/:id/costs` - Agent cost detail

---

### WEEK 5: PHASE 5 - POLICY ENGINE & APPROVALS

**Deliverables:**
- Policy rule evaluator (declarative, JSONB-based)
- Approval workflow + notification
- Policy templates (simple defaults)
- Template-based UI + JSON advanced mode

**Key Tables:**
```
policies (id, org_id, name, description, rule_definition, status)
approval_requests (id, org_id, run_id, policy_id, action_type, action_context, status, approver_user_id, approval_comment, expires_at)
```

**API Endpoints:**
```
POST   /api/v1/policies                 → Create policy
GET    /api/v1/policies                 → List policies
PATCH  /api/v1/policies/:id             → Update policy
DELETE /api/v1/policies/:id             → Deactivate policy

POST   /api/v1/policies/:id/evaluate    → Check if action allowed
GET    /api/v1/approvals/pending        → Get pending approvals
POST   /api/v1/approvals/:id/approve    → Approve action
POST   /api/v1/approvals/:id/reject     → Reject action
```

**Policy Rule Example (JSONB):**
```json
{
  "type": "conditional",
  "conditions": [
    { "field": "agent.name", "operator": "equals", "value": "SalesBot" },
    { "field": "action.type", "operator": "equals", "value": "apply_discount" },
    { "field": "action.discount_percent", "operator": "greater_than", "value": 10 }
  ],
  "action": "require_approval",
  "approval_required_from": ["role:sales_lead"],
  "timeout_minutes": 60
}
```

**Frontend Pages:**
- `/policies` - Policy list + editor
- `/approvals` - Approval queue (approve/reject UI)

---

### WEEK 5-6: PHASE 6 - EMERGENCY CONTROLS & AUDIT (Parallel with Phase 5)

**Deliverables:**
- Pause/resume individual agents
- Org-level kill-switch (pause all agents)
- Audit log ingestion (all state changes)
- Audit log viewer + timeline

**API Endpoints:**
```
POST   /api/v1/controls/pause-agent/:id        → Pause agent
POST   /api/v1/controls/resume-agent/:id       → Resume agent
POST   /api/v1/controls/kill-switch            → Pause ALL agents (org-level)
GET    /api/v1/audit-logs                      → Audit trail
```

**Frontend Pages:**
- `/agents/:id` - Show "Pause" button + status
- `/settings/emergency` - Big red "Kill Switch" button
- `/audit-logs` - Searchable audit trail

---

### WEEK 6: PHASE 7 - DEVELOPER SDK

**Deliverables:**
- TypeScript/JavaScript SDK (npm package)
- Methods: `startRun()`, `recordToolCall()`, `recordExternalAction()`, `checkPolicy()`, `endRun()`
- Example integrations (basic orchestrator, OpenAI Assistants)
- SDK documentation

**SDK Example Usage:**
```typescript
import { AgentOpsClient } from '@agentops/sdk';

const client = new AgentOpsClient({ 
  apiKey: process.env.AGENTOPS_API_KEY,
  agentId: 'support-bot'
});

const runId = await client.startRun({ input: {...} });

await client.recordToolCall({
  runId,
  toolName: 'search_kb',
  input: {...},
  output: {...}
});

const policyCheck = await client.checkPolicy({
  runId,
  action: 'send_email',
  context: { recipient: 'customer@example.com' }
});

if (policyCheck.decision === 'require_approval') {
  await policyCheck.waitForApproval();
}

await client.recordExternalAction({
  runId,
  actionType: 'send_email',
  payload: {...}
});

await client.endRun({ runId, status: 'completed', output: {...} });
```

---

## CRITICAL IMPLEMENTATION PATTERNS

### 1. Multi-Tenancy (Supabase RLS)
- Every table has `organization_id`
- Supabase RLS policies enforce org isolation at DB layer
- **Never filter by org in application code**; rely on RLS

```sql
CREATE POLICY org_isolation ON runs
  USING (organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid()
  ));
```

### 2. Async Ingestion
```
POST /ingest/run → validate → queue job → return 202 (Accepted)
Background job: enrich cost → store → update cache → check policies
```
**Why:** Prevents slowness, allows graceful degradation

### 3. Cost Enrichment
- Store calculated cost with each run: `cost_usd`
- Integrate with LLM APIs (OpenAI, Anthropic, etc.) for real-time pricing
- Cache pricing data in Redis (refresh daily)

### 4. Policy Evaluation
- Store rules as JSONB (flexible, versionable)
- Evaluate server-side (security)
- Return decision synchronously: `allow` | `block` | `require_approval`

### 5. Caching Strategy
```
Redis keys:
- agent_stats:{org_id}:{agent_id} → {runs_24h, error_rate, cost}
- cost_daily:{org_id}:{date} → {total_cost, by_agent}
- policy_cache:{org_id}:{policy_id} → {rule_definition}
Invalidate on: agent update, cost ingestion, policy change
```

---

## DATABASE SCHEMA (ESSENTIAL TABLES)

Create in Supabase with migrations:

1. `organizations` - Orgs (name, plan, billing)
2. `users` - Users (email, name)
3. `organization_members` - Link users → orgs (role, teams)
4. `agents` - AI agents (name, type, provider, status)
5. `runs` - Individual run executions (status, input, output, cost)
6. `events` - Events within runs (tool_called, external_action, etc)
7. `policies` - Governance rules (JSONB rule_definition)
8. `approval_requests` - Pending approvals (action_context, status)
9. `budgets` - Cost limits (agent/team/org level)
10. `api_keys` - API credentials (key_hash, scope)
11. `audit_logs` - State change history (actor, action, changes)

---

## CORE API PATTERNS

### Request/Response Format
```
Request:
- Header: Authorization: Bearer <api_key> or JWT
- Body: JSON
- Content-Type: application/json

Response (Success):
- Status: 200, 201, 202
- Body: { data: {...}, message: "..." }

Response (Error):
- Status: 400, 401, 403, 404, 500
- Body: { error: "...", code: "...", details: {...} }

Example 202 Async Response:
{ "id": "job_uuid", "status": "queued", "message": "Processing..." }
```

### Authentication
- Signup/Login return JWT + Refresh Token
- API Keys for SDK (hash stored, never shown again)
- All endpoints require auth (or API key)
- Enforce org context on all queries (RLS)

### Rate Limiting
- 100 req/sec per API key (burst to 200)
- 1000 ingest events/sec per org
- Return 429 Too Many Requests if exceeded

---

## FRONTEND ARCHITECTURE (React)

### Pages (Folder Structure)
```
src/pages/
  ├── auth/
  │   ├── login.tsx
  │   ├── signup.tsx
  │   └── reset-password.tsx
  ├── dashboard/
  │   ├── home.tsx
  │   ├── agent-detail.tsx
  │   └── run-detail.tsx
  ├── agents/
  │   ├── list.tsx
  │   ├── detail.tsx
  │   ├── analytics.tsx
  │   └── new.tsx
  ├── runs/
  │   ├── list.tsx
  │   └── detail.tsx (forensic replay)
  ├── costs/
  │   ├── summary.tsx
  │   ├── by-agent.tsx
  │   └── budgets.tsx
  ├── policies/
  │   ├── list.tsx
  │   ├── editor.tsx
  │   └── templates.tsx
  ├── approvals/
  │   └── queue.tsx
  ├── settings/
  │   ├── org.tsx
  │   ├── members.tsx
  │   ├── api-keys.tsx
  │   └── emergency.tsx
  └── audit/
      └── logs.tsx

src/components/
  ├── AgentCard.tsx
  ├── RunTimeline.tsx
  ├── CostChart.tsx
  ├── PolicyBuilder.tsx
  ├── ApprovalQueue.tsx
  ├── BudgetTracker.tsx
  └── [more...]

src/hooks/
  ├── useAuth.ts
  ├── useOrganization.ts
  ├── useAgent.ts
  └── [more...]

src/services/
  ├── api.ts (fetch wrapper with auth)
  ├── authService.ts
  ├── agentService.ts
  └── [more...]
```

### State Management
- Use Context API or Zustand (keep it simple for MVP)
- Store: `currentUser`, `currentOrg`, `authToken`
- Fetch data on-demand (React Query or SWR)

### UI Kit
- Tailwind CSS (already included)
- Headless UI components (buttons, modals, forms)
- Charts: Recharts or Chart.js

---

## DEPLOYMENT STRATEGY

### Backend (Node.js API)
1. Build Docker image: `docker build -t agentops-backend .`
2. Deploy to Railway or Render
3. Set environment variables (Supabase URL, API key, Redis URL, JWT secret)
4. Database migrations run automatically on deploy
5. Healthcheck endpoint: `GET /health`

### Frontend (React)
1. Build: `npm run build`
2. Deploy to Vercel (auto-redeploys on git push)
3. Environment variables: `REACT_APP_API_URL`, `REACT_APP_SUPABASE_URL`

### Database (PostgreSQL + Supabase)
- Create Supabase project
- Run migration files (version control)
- Enable RLS policies
- Set up backups (Supabase does this automatically)

### Monitoring
- Sentry for error tracking (both frontend + backend)
- Datadog or New Relic for performance
- CloudWatch/Papertrail for logs

---

## TESTING CHECKLIST

- [ ] Auth flow (signup, login, logout, refresh token)
- [ ] RBAC enforcement (can't access other org's data)
- [ ] Run ingestion (validate, deduplicate, enrich, store)
- [ ] Cost calculation (check against known values)
- [ ] Policy evaluation (rule logic correct)
- [ ] Approval workflow (create → approve/reject → execute)
- [ ] Budget alerts (trigger at thresholds)
- [ ] Kill-switch (pause all agents atomically)
- [ ] Audit logging (all actions recorded)
- [ ] API rate limiting (returns 429)
- [ ] Load test: 100 ingest req/sec

---

## HANDOFF CHECKLIST

When complete, deliver:

- [ ] Git repo (clean history, meaningful commits)
- [ ] README (setup, deploy, run locally)
- [ ] `.env.example` (all required vars)
- [ ] Database migration scripts (numbered: `001_init.sql`, `002_add_policies.sql`)
- [ ] API docs (Swagger JSON + hosted HTML)
- [ ] SDK package (npm published with version tags)
- [ ] Example integrations (simple orchestrator, OpenAI)
- [ ] Deployment guide (Railway/Render steps)
- [ ] Runbook (common operations, troubleshooting)
- [ ] Performance benchmarks (latency, throughput)
- [ ] Known limitations + roadmap
- [ ] Test coverage report (target: >80%)

---

## SUCCESS METRICS (MVP READY)

- [ ] Signup → agent creation → ingest run → view in dashboard (5-min flow works)
- [ ] 100 ingest events/sec per org (load test passes)
- [ ] <2s dashboard load time
- [ ] Multi-tenancy enforced (no cross-org data leakage)
- [ ] SDK works with custom orchestrator (example included)
- [ ] Deployment is one-command (no manual steps)
- [ ] Docs are complete + understandable
- [ ] System uptime >99% for 7 days
- [ ] Zero security vulnerabilities (secrets not logged)
- [ ] First 10 customers can self-serve (minimal support)

---

## BUILDING TIPS FOR AI AGENT

1. **Start with Phase 1** - Get auth + API gateway rock-solid first
2. **Test each phase** - Don't move to Phase 2 until Phase 1 is tested
3. **Use TypeScript** - Strict types catch bugs early
4. **Document code** - Comments explain the "why"
5. **Log everywhere** - Future debugging depends on logs
6. **Build for one engineer** - Code should be simple + maintainable
7. **No premature optimization** - Simple solutions first
8. **Think about errors** - What can go wrong? Log it clearly
9. **Security mindset** - Never log secrets, validate inputs, enforce auth
10. **Follow the schema** - Every table should have org isolation

---

Now build AgentOps Hub.

