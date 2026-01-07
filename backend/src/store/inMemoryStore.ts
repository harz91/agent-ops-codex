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

const organizations = new Map<string, Organization>();
const users = new Map<string, User>();
const orgMembers = new Map<string, OrganizationMember>();
const apiKeys = new Map<string, ApiKey>();

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
};
