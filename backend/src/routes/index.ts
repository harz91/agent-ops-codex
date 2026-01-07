import { Router } from "express";
import authRouter from "./auth.js";
import orgsRouter from "./orgs.js";
import membersRouter from "./orgMembers.js";
import apiKeysRouter from "./apiKeys.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/orgs", orgsRouter);
router.use("/org-members", membersRouter);
router.use("/api-keys", apiKeysRouter);

export default router;
