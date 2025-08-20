export async function Log(stack, level, pkg, message) {
  const logEntry = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString()
  };
  try {
    await fetch("http://localhost:4000/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry)
    });
  } catch {
    console.error("Log server unavailable:", logEntry);
  }
}
