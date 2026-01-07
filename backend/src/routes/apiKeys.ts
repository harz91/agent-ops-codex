import { Router } from "express";
import { z } from "zod";
import { randomUUID } from "crypto";
import { store } from "../store/inMemoryStore.js";
import { requireOrgContext, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

const apiKeySchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(2),
  scope: z.array(z.string()).default(["ingest", "read"]),
  createdBy: z.string().uuid(),
});

router.post("/", requireOrgContext, (req: AuthedRequest, res) => {
  const parsed = apiKeySchema.safeParse({ ...req.body, orgId: req.auth?.orgId });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const key = `ak_${randomUUID()}`;
  const apiKey = store.createApiKey({ ...parsed.data, key });
  return res.status(201).json({
    data: apiKey,
    message: "API key generated",
  });
});

router.get("/", requireOrgContext, (req: AuthedRequest, res) => {
  const keys = store.listApiKeys(req.auth?.orgId ?? "");
  return res.json({ data: keys, message: "API keys" });
});

router.delete("/:id", (req, res) => {
  const deleted = store.revokeApiKey(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "API key not found" });
  }

  return res.json({ data: { deleted: true }, message: "API key revoked" });
});

export default router;
