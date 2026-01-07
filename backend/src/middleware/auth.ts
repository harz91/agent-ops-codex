import type { NextFunction, Request, Response } from "express";
import { store } from "../store/inMemoryStore.js";

export type AuthContext = {
  orgId: string;
  apiKeyId?: string;
};

export type AuthedRequest = Request & { auth?: AuthContext };

const parseApiKey = (header?: string) => {
  if (!header) return null;
  const [prefix, value] = header.split(" ");
  if (prefix?.toLowerCase() !== "bearer" || !value) return null;
  return value.trim();
};

export const requireOrgContext = (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const orgId = req.headers["x-org-id"];
  if (!orgId || typeof orgId !== "string") {
    return res.status(400).json({ error: "Missing x-org-id header" });
  }
  req.auth = { orgId };
  return next();
};

export const requireApiKey = (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = parseApiKey(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: "Missing API key" });
  }
  const apiKey = store.findApiKeyByKey(token);
  if (!apiKey) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  req.auth = { orgId: apiKey.orgId, apiKeyId: apiKey.id };
  return next();
};
