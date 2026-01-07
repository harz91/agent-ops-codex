import { Router } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import { store } from "../store/inMemoryStore.js";
import { requireApiKey, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

const tokenUsageSchema = z.object({
  model: z.string().min(1),
  promptTokens: z.number().int().nonnegative(),
  completionTokens: z.number().int().nonnegative(),
});

const eventSchema = z.object({
  eventType: z.string().min(2),
  timestamp: z.string().datetime(),
  payload: z.record(z.unknown()).default({}),
});

const runSchema = z.object({
  runId: z.string().uuid().optional(),
  agentId: z.string().uuid(),
  status: z.enum(["queued", "running", "completed", "failed"]).default("queued"),
  inputData: z.record(z.unknown()).default({}),
  outputData: z.record(z.unknown()).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  tokenUsage: tokenUsageSchema.optional(),
  externalReference: z.string().optional(),
  events: z.array(eventSchema).default([]),
});

const pricingPer1kTokens: Record<string, number> = {
  "gpt-4": 0.03,
  "gpt-4o": 0.005,
  "gpt-4o-mini": 0.0006,
  "claude-3-opus": 0.03,
  "claude-3-sonnet": 0.015,
};

const estimateCost = (usage?: z.infer<typeof tokenUsageSchema>) => {
  if (!usage) return null;
  const totalTokens = usage.promptTokens + usage.completionTokens;
  const rate = pricingPer1kTokens[usage.model] ?? 0.01;
  return Number(((totalTokens / 1000) * rate).toFixed(6));
};

router.post("/run", requireApiKey, (req: AuthedRequest, res) => {
  const parsed = runSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const orgId = req.auth?.orgId ?? "";
  const agent = store.getAgent(parsed.data.agentId);
  if (!agent || agent.orgId !== orgId) {
    return res.status(404).json({ error: "Agent not found" });
  }

  const runId = parsed.data.runId ?? randomUUID();
  const existing = store.getRun(runId);
  if (existing) {
    return res.status(202).json({
      id: runId,
      status: "queued",
      message: "Run already ingested",
    });
  }

  const startTime = parsed.data.startTime ?? new Date().toISOString();
  const endTime = parsed.data.endTime ?? null;
  const latencyMs =
    endTime && startTime ? new Date(endTime).getTime() - new Date(startTime).getTime() : null;

  const run = store.createRun({
    id: runId,
    orgId,
    agentId: parsed.data.agentId,
    status: parsed.data.status,
    inputData: parsed.data.inputData,
    outputData: parsed.data.outputData ?? null,
    startTime,
    endTime,
    latencyMs,
    tokenUsage: parsed.data.tokenUsage ?? null,
    costUsd: estimateCost(parsed.data.tokenUsage),
    externalReference: parsed.data.externalReference ?? null,
  });

  store.addEvents(
    runId,
    orgId,
    parsed.data.events.map((event) => ({ ...event, runId, orgId }))
  );

  return res.status(202).json({
    id: runId,
    status: "queued",
    message: "Run accepted for processing",
    data: run,
  });
});

export default router;
