import { Router } from "express";
import { z } from "zod";
import { store } from "../store/inMemoryStore.js";

const router = Router();

router.get("/profile", (req, res) => {
  const orgId = req.headers["x-org-id"] as string | undefined;
  if (!orgId) {
    return res.status(400).json({ error: "Missing x-org-id header" });
  }

  const org = store.getOrganization(orgId);
  if (!org) {
    return res.status(404).json({ error: "Organization not found" });
  }

  return res.json({ data: org, message: "Organization profile" });
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  plan: z.string().min(2).optional(),
});

router.patch("/profile", (req, res) => {
  const orgId = req.headers["x-org-id"] as string | undefined;
  if (!orgId) {
    return res.status(400).json({ error: "Missing x-org-id header" });
  }

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const updated = store.updateOrganization(orgId, parsed.data);
  if (!updated) {
    return res.status(404).json({ error: "Organization not found" });
  }

  return res.json({ data: updated, message: "Organization updated" });
});

export default router;
