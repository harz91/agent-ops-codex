import { Router } from "express";
import { z } from "zod";
import { store } from "../store/inMemoryStore.js";
import { requireOrgContext, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

router.get("/profile", requireOrgContext, (req: AuthedRequest, res) => {
  const org = store.getOrganization(req.auth?.orgId ?? "");
  if (!org) {
    return res.status(404).json({ error: "Organization not found" });
  }

  return res.json({ data: org, message: "Organization profile" });
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  plan: z.string().min(2).optional(),
});

router.patch("/profile", requireOrgContext, (req: AuthedRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const updated = store.updateOrganization(req.auth?.orgId ?? "", parsed.data);
  if (!updated) {
    return res.status(404).json({ error: "Organization not found" });
  }

  return res.json({ data: updated, message: "Organization updated" });
});

export default router;
