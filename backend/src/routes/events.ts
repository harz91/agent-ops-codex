import { Router } from "express";
import { store } from "../store/inMemoryStore.js";
import { requireOrgContext, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

router.get("/:runId", requireOrgContext, (req: AuthedRequest, res) => {
  const events = store.listEventsByRun(req.params.runId, req.auth?.orgId ?? "");
  return res.json({ data: events, message: "Events" });
});

export default router;
