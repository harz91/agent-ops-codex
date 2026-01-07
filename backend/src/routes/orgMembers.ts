import { Router } from "express";
import { z } from "zod";
import { store } from "../store/inMemoryStore.js";
import { requireOrgContext, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

const memberSchema = z.object({
  orgId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(["Admin", "TeamLead", "Member", "Viewer"]),
  teams: z.array(z.string()).default([]),
});

router.post("/", requireOrgContext, (req: AuthedRequest, res) => {
  const parsed = memberSchema.safeParse({ ...req.body, orgId: req.auth?.orgId });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const member = store.addMember(parsed.data);
  return res.status(201).json({ data: member, message: "Member invited" });
});

router.get("/", requireOrgContext, (req: AuthedRequest, res) => {
  const members = store.listMembers(req.auth?.orgId ?? "");
  return res.json({ data: members, message: "Organization members" });
});

const updateSchema = z.object({
  role: z.enum(["Admin", "TeamLead", "Member", "Viewer"]).optional(),
  teams: z.array(z.string()).optional(),
});

router.patch("/:id", (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const updated = store.updateMember(req.params.id, parsed.data);
  if (!updated) {
    return res.status(404).json({ error: "Member not found" });
  }

  return res.json({ data: updated, message: "Member updated" });
});

router.delete("/:id", (req, res) => {
  const deleted = store.removeMember(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Member not found" });
  }

  return res.json({ data: { deleted: true }, message: "Member removed" });
});

export default router;
