import { Router } from "express";
import { z } from "zod";
import { store } from "../store/inMemoryStore.js";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  orgName: z.string().min(2),
});

router.post("/signup", (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const { email, fullName, orgName } = parsed.data;
  const existing = store.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const user = store.createUser({ email, fullName });
  const org = store.createOrganization({
    name: orgName,
    plan: "starter",
    createdBy: user.id,
  });
  store.addMember({
    orgId: org.id,
    userId: user.id,
    role: "Admin",
    teams: [],
  });

  return res.status(201).json({
    data: {
      user,
      org,
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
    },
    message: "Signup successful",
  });
});

const loginSchema = z.object({
  email: z.string().email(),
});

const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

const passwordResetConfirmSchema = z.object({
  token: z.string().min(8),
  newPassword: z.string().min(8),
});

router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const user = store.getUserByEmail(parsed.data.email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({
    data: {
      user,
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
    },
    message: "Login successful",
  });
});

router.post("/logout", (_req, res) => {
  res.json({ data: { revoked: true }, message: "Logged out" });
});

router.post("/refresh-token", (_req, res) => {
  res.json({
    data: { token: "mock-jwt-token", refreshToken: "mock-refresh-token" },
    message: "Token refreshed",
  });
});

router.post("/password-reset/request", (req, res) => {
  const parsed = passwordResetRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const reset = store.createPasswordReset(parsed.data.email);

  return res.json({
    data: reset
      ? { resetToken: reset.token, expiresAt: reset.expiresAt }
      : null,
    message: "If an account exists, a reset email has been sent.",
  });
});

router.post("/password-reset/confirm", (req, res) => {
  const parsed = passwordResetConfirmSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error });
  }

  const result = store.consumePasswordReset(parsed.data.token, parsed.data.newPassword);
  if ("error" in result) {
    const message =
      result.error === "expired"
        ? "Reset token expired. Request a new one."
        : "Reset token invalid.";
    return res.status(400).json({ error: message });
  }

  return res.json({
    data: { userId: result.user.id },
    message: "Password reset successful.",
  });
});

export default router;
