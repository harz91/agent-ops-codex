import { Router } from "express";
import { z } from "zod";
import { store } from "../store/inMemoryStore.js";

const router = Router();

const memberSchema = z.object({
  orgId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(["Admin", "TeamLead", "Member", "Viewer"]),
  teams: z.array(z.string()).default([]),
});

router.post("/", (req, res) => {
  const parsed = memberSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const member = store.addMember(parsed.data);
  return res.status(201).json({ data: member, message: "Member invited" });
});

router.get("/", (req, res) => {
  const orgId = req.headers["x-org-id"] as string | undefined;
  if (!orgId) {
    return res.status(400).json({ error: "Missing x-org-id header" });
  }

  const members = store.listMembers(orgId);
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
