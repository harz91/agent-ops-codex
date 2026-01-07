import app from "./app.js";
import logger from "./utils/logger.js";

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  logger.info(`AgentOps backend running on port ${port}`);
});
