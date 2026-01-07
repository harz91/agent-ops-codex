import { Router } from "express";
import { z } from "zod";
import { store } from "../store/inMemoryStore.js";
import { requireOrgContext, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

const listSchema = z.object({
  agentId: z.string().uuid().optional(),
  status: z.enum(["queued", "running", "completed", "failed"]).optional(),
});

router.get("/", requireOrgContext, (req: AuthedRequest, res) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const orgId = req.auth?.orgId ?? "";
  let runs = store.listRuns(orgId);
  if (parsed.data.agentId) {
    runs = runs.filter((run) => run.agentId === parsed.data.agentId);
  }
  if (parsed.data.status) {
    runs = runs.filter((run) => run.status === parsed.data.status);
  }
  return res.json({ data: runs, message: "Runs" });
});

router.get("/:id", requireOrgContext, (req: AuthedRequest, res) => {
  const run = store.getRun(req.params.id);
  if (!run || run.orgId !== req.auth?.orgId) {
    return res.status(404).json({ error: "Run not found" });
  }
  return res.json({ data: run, message: "Run detail" });
});

export default router;
