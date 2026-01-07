import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { apiRateLimit } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(apiRateLimit);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
