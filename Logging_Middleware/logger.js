function logger(req, res, next) {
  const start = Date.now();
  console.log(`[REQ] ${req.method} ${req.originalUrl} | body: ${JSON.stringify(req.body)}`);
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[RES] ${req.method} ${req.originalUrl} | status: ${res.statusCode} | ${duration}ms`);
  });
  next();
}
export { logger };
