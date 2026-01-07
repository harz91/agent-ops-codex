import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("Unhandled error", { message: error.message, stack: error.stack });
  res.status(500).json({ error: "Internal server error" });
};
