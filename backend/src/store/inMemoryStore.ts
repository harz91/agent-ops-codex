import { randomUUID } from "crypto";

export type Organization = {
  id: string;
  name: string;
  plan: string;
  createdBy: string;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  password?: string;
};

export type OrganizationMember = {
  id: string;
  orgId: string;
  userId: string;
  role: "Admin" | "TeamLead" | "Member" | "Viewer";
  teams: string[];
};

export type ApiKey = {
  id: string;
  orgId: string;
  name: string;
  key: string;
  scope: string[];
  createdBy: string;
  createdAt: string;
};

export type Agent = {
  id: string;
  orgId: string;
  name: string;
  type: string;
  provider: string;
  status: "active" | "paused" | "archived";
  tags: string[];
  environment: "prod" | "staging" | "dev";
  config: Record<string, unknown>;
};

export type Run = {
  id: string;
  orgId: string;
  agentId: string;
  status: "queued" | "running" | "completed" | "failed";
  inputData: Record<string, unknown>;
  outputData: Record<string, unknown> | null;
  startTime: string;
  endTime: string | null;
  latencyMs: number | null;
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    model: string;
  } | null;
  costUsd: number | null;
  externalReference: string | null;
};

export type Event = {
  id: string;
  runId: string;
  orgId: string;
  eventType: string;
  timestamp: string;
  payload: Record<string, unknown>;
};

export type PasswordReset = {
  token: string;
  userId: string;
  email: string;
  expiresAt: string;
  createdAt: string;
};

const organizations = new Map<string, Organization>();
const users = new Map<string, User>();
const orgMembers = new Map<string, OrganizationMember>();
const apiKeys = new Map<string, ApiKey>();
const agents = new Map<string, Agent>();
const runs = new Map<string, Run>();
const events = new Map<string, Event[]>();
const passwordResets = new Map<string, PasswordReset>();

export const store = {
  createOrganization: (data: Omit<Organization, "id">) => {
    const id = randomUUID();
    const org = { id, ...data };
    organizations.set(id, org);
    return org;
  },
  updateOrganization: (id: string, updates: Partial<Omit<Organization, "id">>) => {
    const org = organizations.get(id);
    if (!org) return null;
    const next = { ...org, ...updates };
    organizations.set(id, next);
    return next;
  },
  getOrganization: (id: string) => organizations.get(id) ?? null,
  createUser: (data: Omit<User, "id">) => {
    const id = randomUUID();
    const user = { id, ...data };
    users.set(id, user);
    return user;
  },
  getUserByEmail: (email: string) =>
    Array.from(users.values()).find((user) => user.email === email) ?? null,
  updateUserPassword: (id: string, password: string) => {
    const user = users.get(id);
    if (!user) return null;
    const next = { ...user, password };
    users.set(id, next);
    return next;
  },
  addMember: (data: Omit<OrganizationMember, "id">) => {
    const id = randomUUID();
    const member = { id, ...data };
    orgMembers.set(id, member);
    return member;
  },
  listMembers: (orgId: string) =>
    Array.from(orgMembers.values()).filter((member) => member.orgId === orgId),
  updateMember: (id: string, updates: Partial<Omit<OrganizationMember, "id">>) => {
    const member = orgMembers.get(id);
    if (!member) return null;
    const next = { ...member, ...updates };
    orgMembers.set(id, next);
    return next;
  },
  removeMember: (id: string) => orgMembers.delete(id),
  createApiKey: (data: Omit<ApiKey, "id" | "createdAt">) => {
    const id = randomUUID();
    const apiKey = { id, createdAt: new Date().toISOString(), ...data };
    apiKeys.set(id, apiKey);
    return apiKey;
  },
  listApiKeys: (orgId: string) =>
    Array.from(apiKeys.values()).filter((key) => key.orgId === orgId),
  revokeApiKey: (id: string) => apiKeys.delete(id),
  findApiKeyByKey: (key: string) =>
    Array.from(apiKeys.values()).find((apiKey) => apiKey.key === key) ?? null,
  createAgent: (data: Omit<Agent, "id">) => {
    const id = randomUUID();
    const agent = { id, ...data };
    agents.set(id, agent);
    return agent;
  },
  listAgents: (orgId: string) =>
    Array.from(agents.values()).filter((agent) => agent.orgId === orgId),
  getAgent: (id: string) => agents.get(id) ?? null,
  updateAgent: (id: string, updates: Partial<Omit<Agent, "id" | "orgId">>) => {
    const agent = agents.get(id);
    if (!agent) return null;
    const next = { ...agent, ...updates };
    agents.set(id, next);
    return next;
  },
  createRun: (data: Run) => {
    runs.set(data.id, data);
    return data;
  },
  getRun: (id: string) => runs.get(id) ?? null,
  listRuns: (orgId: string) =>
    Array.from(runs.values()).filter((run) => run.orgId === orgId),
  addEvents: (runId: string, orgId: string, newEvents: Omit<Event, "id">[]) => {
    const existing = events.get(runId) ?? [];
    const created = newEvents.map((event) => ({ id: randomUUID(), ...event }));
    events.set(runId, [...existing, ...created]);
    return created.filter((event) => event.orgId === orgId);
  },
  listEventsByRun: (runId: string, orgId: string) =>
    (events.get(runId) ?? []).filter((event) => event.orgId === orgId),
  createPasswordReset: (email: string) => {
    const user = Array.from(users.values()).find((entry) => entry.email === email);
    if (!user) return null;
    const token = randomUUID();
    const now = Date.now();
    const reset: PasswordReset = {
      token,
      userId: user.id,
      email: user.email,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 1000 * 60 * 60).toISOString(),
    };
    passwordResets.set(token, reset);
    return reset;
  },
  consumePasswordReset: (token: string, newPassword: string) => {
    const reset = passwordResets.get(token);
    if (!reset) {
      return { error: "invalid" as const };
    }
    if (new Date(reset.expiresAt).getTime() < Date.now()) {
      passwordResets.delete(token);
      return { error: "expired" as const };
    }
    const user = users.get(reset.userId);
    if (!user) {
      passwordResets.delete(token);
      return { error: "invalid" as const };
    }
    const updated = { ...user, password: newPassword };
    users.set(user.id, updated);
    passwordResets.delete(token);
    return { user: updated };
  },
};
