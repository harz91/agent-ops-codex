import { Router } from "express";
import authRouter from "./auth.js";
import orgsRouter from "./orgs.js";
import membersRouter from "./orgMembers.js";
import apiKeysRouter from "./apiKeys.js";
import agentsRouter from "./agents.js";
import ingestRouter from "./ingest.js";
import runsRouter from "./runs.js";
import eventsRouter from "./events.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/orgs", orgsRouter);
router.use("/org-members", membersRouter);
router.use("/api-keys", apiKeysRouter);
router.use("/agents", agentsRouter);
router.use("/ingest", ingestRouter);
router.use("/runs", runsRouter);
router.use("/events", eventsRouter);

export default router;
