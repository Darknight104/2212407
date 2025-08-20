import express from "express";
import { buildRoutes } from "./routes/route.js";
import { loggingMiddleware } from "../Logging_Middleware/middleware.js";
import { Log } from "../Logging_Middleware/index.js";
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
const app = express();
app.use(express.json());
app.use(loggingMiddleware);
Log("backend", "info", "server", `Starting server at ${BASE_URL}`);
app.use(buildRoutes(BASE_URL));
app.get("/", (_req, res) => {
  Log("backend", "debug", "root", "Root endpoint accessed");
  res.type("text/plain").send("POST /shorturls with { url, validity?, shortcode? }");
});
app.listen(PORT, () => {
  Log("backend", "success", "server", `Server running at ${BASE_URL}`);
});
