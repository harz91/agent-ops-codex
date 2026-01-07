import { Router } from "express";
import { z } from "zod";
import { store } from "../store/inMemoryStore.js";
import { requireOrgContext, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

const agentSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  provider: z.string().min(2),
  tags: z.array(z.string()).default([]),
  environment: z.enum(["prod", "staging", "dev"]).default("prod"),
  config: z.record(z.unknown()).default({}),
});

router.post("/", requireOrgContext, (req: AuthedRequest, res) => {
  const parsed = agentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const agent = store.createAgent({
    orgId: req.auth?.orgId ?? "",
    status: "active",
    ...parsed.data,
  });
  return res.status(201).json({ data: agent, message: "Agent created" });
});

router.get("/", requireOrgContext, (req: AuthedRequest, res) => {
  const agents = store.listAgents(req.auth?.orgId ?? "");
  return res.json({ data: agents, message: "Agents" });
});

router.get("/:id", requireOrgContext, (req: AuthedRequest, res) => {
  const agent = store.getAgent(req.params.id);
  if (!agent || agent.orgId !== req.auth?.orgId) {
    return res.status(404).json({ error: "Agent not found" });
  }
  return res.json({ data: agent, message: "Agent detail" });
});

const updateSchema = agentSchema.partial().extend({
  status: z.enum(["active", "paused", "archived"]).optional(),
});

router.patch("/:id", requireOrgContext, (req: AuthedRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const agent = store.getAgent(req.params.id);
  if (!agent || agent.orgId !== req.auth?.orgId) {
    return res.status(404).json({ error: "Agent not found" });
  }

  const updated = store.updateAgent(req.params.id, parsed.data);
  return res.json({ data: updated, message: "Agent updated" });
});

router.delete("/:id", requireOrgContext, (req: AuthedRequest, res) => {
  const agent = store.getAgent(req.params.id);
  if (!agent || agent.orgId !== req.auth?.orgId) {
    return res.status(404).json({ error: "Agent not found" });
  }

  const updated = store.updateAgent(req.params.id, { status: "archived" });
  return res.json({ data: updated, message: "Agent archived" });
});

export default router;
