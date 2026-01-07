import { Router } from "express";
import { z } from "zod";
import { randomUUID } from "crypto";
import { store } from "../store/inMemoryStore.js";

const router = Router();

const apiKeySchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(2),
  scope: z.array(z.string()).default(["ingest", "read"]),
  createdBy: z.string().uuid(),
});

router.post("/", (req, res) => {
  const parsed = apiKeySchema.safeParse(req.body);
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

router.get("/", (req, res) => {
  const orgId = req.headers["x-org-id"] as string | undefined;
  if (!orgId) {
    return res.status(400).json({ error: "Missing x-org-id header" });
  }

  const keys = store.listApiKeys(orgId);
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
