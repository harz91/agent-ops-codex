# AgentOps Hub System Architecture & Build Plan

## 1. Purpose & Scope
AgentOps Hub is a multi-tenant SaaS control plane for AI agents that provides visibility, governance, and cost control. This document translates the PRD and build prompt into an implementation-ready architecture and delivery plan for the mandated stack.

## 2. Goals & Non-Goals (v1)
**Goals**
- Centralized visibility into agent activity (runs, events, audit trails).
- Cost analytics, budgets, and alerts.
- Policy enforcement and approval workflows.
- Emergency controls (pause/kill-switch).
- SMB-friendly onboarding and UX.

**Non-Goals**
- Not an agent-builder or workflow designer.
- Not a full enterprise GRC platform.
- Multi-provider by default (avoid single-vendor lock-in).

## 3. System Context
**Actors**
- Org Owners/Admins, Team Leads, Members, Viewers.
- External agent orchestrators (SDK/API/webhooks).
- Third-party identity providers (Supabase Auth).

**High-Level Flow**
1. Agents (or orchestrators) post runs/events to ingestion API using API keys.
2. The backend validates, deduplicates, and queues processing (BullMQ + Redis).
3. Workers enrich runs (costs, policy checks), persist to Postgres, update caches.
4. Frontend reads dashboards/logs via REST endpoints.
5. Alerts and approvals are emitted via notifications.

## 4. Architecture Overview
**Stack (mandated)**
- Frontend: React + TypeScript + Tailwind (Vercel)
- Backend: Node.js + TypeScript + Express (Railway/Render)
- Database: Postgres (Supabase, RLS)
- Cache: Redis (Upstash)
- Jobs: BullMQ
- Auth: Supabase Auth
- Logs: Winston + Sentry
- SDK: TypeScript/JavaScript npm package
- Deploy: Docker + GitHub Actions

**Core Services**
- **API Gateway (Express)**: auth, RBAC, rate limiting, versioning, request validation.
- **Ingestion Service**: ingest endpoints, deduplication, async processing.
- **Worker Service**: BullMQ consumer(s) for enrichment, policy evaluation, alerts.
- **Reporting Service**: aggregated queries for dashboards and cost analytics.

**Data Storage**
- **Postgres** as system of record (multi-tenant via org_id + RLS).
- **Redis** for hot data (agent stats, cost aggregates, rate limits).

## 5. Module Architecture
### 5.1 Platform Core
- Auth & session management (Supabase Auth).
- Organization & team management.
- RBAC & permissions.
- API keys and rate limiting.
- Global settings and notifications.

### 5.2 Agent Registry
- CRUD for agents (metadata, provider, environment, tags).
- External provider bindings and configuration.

### 5.3 Run & Event Ingestion
- `/api/v1/ingest/run` for primary run ingestion.
- Validation and deduplication.
- Queue background processing for cost/policy enrichment.
- Store runs and events.

### 5.4 Observability & Dashboards
- KPI cards, trends, and run timelines.
- Filterable run browser and forensic replay.

### 5.5 Cost Analytics & Budgets
- Aggregated cost by agent/team/org.
- Budgets with thresholds and alerts.
- Optional auto-pause at spend limits.

### 5.6 Policy & Approvals
- Policy definitions scoped to agents/teams.
- Approval workflows for sensitive actions.
- Audit trail for approvals and overrides.

### 5.7 Emergency Controls
- Global pause/kill-switch for agents.
- Rapid role-based access for critical actions.

## 6. Data Model (Initial)
**Organizations**
- id, name, plan, billing, region, created_at

**Users & Memberships**
- users: id, email, full_name, created_at
- organization_members: id, org_id, user_id, role, team

**API Keys**
- api_keys: id, org_id, name, key_hash, scope, created_by, created_at, revoked_at

**Agents**
- agents: id, org_id, name, type, provider, status, tags, environment, config

**Runs & Events**
- runs: id, org_id, agent_id, status, input_data, output_data, start_time, end_time,
  latency_ms, token_usage, cost_usd, external_reference
- events: id, run_id, org_id, event_type, timestamp, payload

**Budgets**
- budgets: id, org_id, agent_id, team_name, max_amount_usd, period,
  threshold_alert_percent, auto_pause_at_percent, current_spend_usd,
  period_start_date, period_end_date

**Policies & Approvals**
- policies: id, org_id, name, scope, conditions, action, status
- approvals: id, org_id, policy_id, run_id, requested_by, approved_by, status, decided_at

**Audit Logs**
- audit_logs: id, org_id, actor_type, action_type, entity_type, changes, timestamp

## 7. Key API Surface
**Auth & Org**
- POST /api/v1/auth/signup
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- POST /api/v1/auth/refresh-token
- GET/PATCH /api/v1/orgs/profile
- POST/GET/PATCH/DELETE /api/v1/org-members

**API Keys**
- POST /api/v1/api-keys
- GET /api/v1/api-keys
- DELETE /api/v1/api-keys/:id

**Agents**
- POST /api/v1/agents
- GET /api/v1/agents
- GET /api/v1/agents/:id
- PATCH /api/v1/agents/:id
- DELETE /api/v1/agents/:id

**Ingestion & Runs**
- POST /api/v1/ingest/run
- GET /api/v1/runs
- GET /api/v1/runs/:id
- GET /api/v1/events/:run_id

**Dashboards**
- GET /api/v1/dashboard/home
- GET /api/v1/dashboard/agent/:id

**Costs & Budgets**
- GET /api/v1/costs/summary
- GET /api/v1/costs/by-agent/:id
- GET /api/v1/costs/by-team/:name
- POST/GET/PATCH/DELETE /api/v1/budgets

## 8. Security & Compliance
- RLS in Supabase for org-scoped data access.
- API key hashing and scoped permissions.
- Rate limiting per org and per key.
- Audit logs for all admin/policy actions.
- Sentry for error tracking and Winston for structured logs.

## 9. Operational Architecture
**Async Processing**
- BullMQ handles run enrichment, cost calculations, policy checks.
- Worker retries with dead-letter queues for failures.

**Caching**
- Redis stores frequently accessed aggregates (agent stats, cost summaries).

**Observability**
- Request logging, metrics, tracing hooks.
- Dedicated error dashboards for ingestion failures.

## 10. Build Plan (6 Weeks)
### Phase 1 (Weeks 1-2): Platform Core
- Supabase schema with RLS policies and core tables.
- Auth, org management, RBAC, API keys, rate limiting.
- Baseline UI shell and settings pages.

### Phase 2 (Weeks 2-3): Agent Registry + Ingestion
- Agents CRUD and provider bindings.
- Ingestion endpoint, deduplication, async job pipeline.
- Runs and events persistence with cost enrichment.

### Phase 3 (Weeks 3-4): Observability
- Dashboard KPIs, agent analytics, run explorer.
- Forensic timeline view and filtering.

### Phase 4 (Weeks 4-5): Cost Analytics + Budgets
- Cost aggregation queries and budget management.
- Alerts for thresholds with optional auto-pause.

### Phase 5 (Week 5): Policy Engine + Approvals
- Policy definitions, approval workflows, auditing.

### Phase 6 (Week 6): Emergency Controls + Reporting
- Global pause, bulk agent controls.
- Reporting exports and final UX polish.

## 11. Risks & Mitigations
- **Ingestion overload**: apply rate limits and queue backpressure.
- **Cost calculation accuracy**: keep model pricing in config and versioned tables.
- **RLS complexity**: test with end-to-end auth scenarios and service role access.
- **Approval latency**: async notifications + simple pending queue UI.

## 12. Deliverables
- Architecture and system documentation (this file).
- Backend services with ingestion and core endpoints.
- Frontend dashboards and settings screens.
- SDK starter package for agent ingestion.
