import rateLimit from "express-rate-limit";

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const ingestRateLimit = rateLimit({
  windowMs: 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
