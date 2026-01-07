# AgentOps Hub Build Tasks Checklist

A phase-by-phase TODO list to build the full AgentOps Hub system. Each task is formatted as a checklist item so it can be marked complete.

## Phase 1 (Weeks 1-2): Platform Core
### Auth & Identity
- [ ] Configure Supabase Auth (email/password + OAuth providers).
- [ ] Implement signup flow to create org + first user.
- [ ] Implement login, logout, refresh token flows.
- [ ] Add password reset flow.
- [ ] Add 2FA-ready structure (TOTP/SMS optional).

### Org & Tenant Management
- [ ] Create org profile CRUD (name, logo, plan, region).
- [ ] Implement org invitations (email-based).
- [ ] Build org members CRUD with roles.

### RBAC & Permissions
- [ ] Define roles (Owner/Admin, Team Lead, Member, Viewer).
- [ ] Implement role-based access checks in middleware.
- [ ] Add permission mapping for agents, policies, approvals, settings.

### API Keys & Gateway
- [ ] Create API key issuance and revocation endpoints.
- [ ] Store API key hashes and scopes in Postgres.
- [ ] Implement API key auth middleware.
- [ ] Add request validation and versioned routes (`/api/v1`).
- [ ] Add rate limiting per org/key (Redis-backed).

### Logging, Error Handling, Observability
- [ ] Wire Winston structured logs.
- [ ] Configure Sentry error tracking.
- [ ] Add API error standardization (error codes + response schema).

### Frontend Core UI
- [ ] Build login and signup pages.
- [ ] Build settings pages: org profile, members, API keys.
- [ ] Add baseline app shell (nav, layout, theming).

### Infrastructure & Tooling
- [ ] Dockerize backend and frontend.
- [ ] Configure GitHub Actions CI (lint, test, build).
- [ ] Add environment config templates.

## Phase 2 (Weeks 2-3): Agent Registry + Run Ingestion
### Agent Registry
- [ ] Implement agents table and RLS policies.
- [ ] Build CRUD endpoints for agents.
- [ ] Add agent tags and environment flags (prod/staging/test).
- [ ] Build agent list and detail views.

### Run & Event Ingestion
- [ ] Implement ingestion schema validation.
- [ ] Add deduplication logic for run IDs.
- [ ] Create BullMQ queue for ingestion jobs.
- [ ] Store runs and events in Postgres.
- [ ] Update Redis cache for agent stats.

### Cost Enrichment
- [ ] Store model pricing configuration.
- [ ] Compute token usage and cost per run.
- [ ] Persist cost metrics to runs table.

### Ingestion API & Run Browsing
- [ ] Expose `/api/v1/ingest/run` endpoint.
- [ ] Implement runs list and run detail APIs.
- [ ] Build run history UI and run detail timeline.

## Phase 3 (Weeks 3-4): Observability & Dashboards
### Dashboard KPIs
- [ ] Build org-level KPI summary API.
- [ ] Add dashboard cards for runs, errors, cost.
- [ ] Add charts for runs over time and error rate.

### Agent Analytics
- [ ] Build per-agent trends API.
- [ ] Implement agent analytics UI (latency, errors, cost).

### Run Explorer
- [ ] Add advanced filtering and search for runs.
- [ ] Implement pagination and export.

### Forensic Replay
- [ ] Create timeline view for run events.
- [ ] Display full context payloads in UI.

### Real-Time Updates
- [ ] Add SSE or Socket.io for live updates.
- [ ] Wire front-end real-time refresh.

## Phase 4 (Weeks 4-5): Cost Analytics & Budgets
### Cost Aggregation
- [ ] Implement cost rollups by agent/team/org.
- [ ] Add daily and monthly breakdown queries.
- [ ] Implement cost breakdown by model.

### Budgets
- [ ] Create budgets table and CRUD APIs.
- [ ] Add budget UI management page.
- [ ] Trigger alerts at 50/80/100% thresholds.
- [ ] Optional: auto-pause agents at limit.

### Alerts & Notifications
- [ ] Email alerts for budget thresholds.
- [ ] In-app notifications for budget changes.

## Phase 5 (Week 5): Policy Engine & Approvals
### Policy Definitions
- [ ] Create policies table and CRUD APIs.
- [ ] Add policy UI management screens.
- [ ] Implement policy evaluation engine.

### Approvals Workflow
- [ ] Create approvals table and APIs.
- [ ] Implement approval queue UI.
- [ ] Add notification hooks for pending approvals.
- [ ] Log approvals and overrides in audit logs.

## Phase 6 (Week 6): Emergency Controls & Reporting
### Emergency Controls
- [ ] Build global pause/kill-switch API.
- [ ] Add bulk agent control UI.
- [ ] Implement audit logging for emergency actions.

### Reporting & Exports
- [ ] Add CSV export for cost and runs.
- [ ] Build reporting summary dashboard.

### Final Hardening
- [ ] Performance optimization (indexes, caching).
- [ ] Security review (RLS, API scopes, rate limits).
- [ ] End-to-end tests for critical flows.
- [ ] Documentation updates for SDK + onboarding.

## Cross-Cutting Tasks (All Phases)
### Data & Security
- [ ] Maintain RLS policies for every table.
- [ ] Add audit logging for admin and policy actions.
- [ ] Ensure API keys are scoped and hashed.

### QA & Testing
- [ ] Unit tests for auth, RBAC, API key validation.
- [ ] Integration tests for ingestion pipeline.
- [ ] Frontend UI tests for dashboards and settings.

### SDK & Integrations
- [ ] Build JS/TS SDK for `/api/v1/ingest/run`.
- [ ] Provide SDK examples and quickstart docs.

### Dev Experience
- [ ] Add linting/formatting rules.
- [ ] Add seed scripts and local dev setup.
