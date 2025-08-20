import { Log } from "./index.js";
export function loggingMiddleware(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    Log("backend", "info", "middleware", `${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  res.on("close", () => {
    Log("backend", "error", "middleware", `Connection closed before response: ${req.method} ${req.originalUrl}`);
  });
  next();
}
