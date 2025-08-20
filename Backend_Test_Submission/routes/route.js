import { Router } from "express";
import { saveUrl, getUrl, addClick, isExpired, getStats } from "../storage/storage.js";
import { makeCode, toExpiry, isHttpUrl, isValidCode } from "../util/util.js";
import { Log } from "../../Logging_Middleware/index.js";
export function buildRoutes(baseUrl) {
  const r = Router();
  r.post("/shorturls", (req, res) => {
    const { url, validity, shortcode } = req.body || {};
    if (!isHttpUrl(url)) {
      Log("backend", "error", "handler", `Invalid URL: ${url}`);
      return res.status(400).json({
        error: true,
        code: "VALIDATION_ERROR",
        message: "Field 'url' must be a valid http/https URL."
      });
    }
    let code = shortcode;
    if (code && !isValidCode(code)) {
      Log("backend", "error", "handler", `Invalid shortcode: ${code}`);
      return res.status(400).json({
        error: true,
        code: "VALIDATION_ERROR",
        message: "Field 'shortcode' must be 4-32 alphanumeric characters."
      });
    }
    if (!code) code = makeCode(7);
    const expiresAt = toExpiry(Number(validity));
    saveUrl(code, url, expiresAt);
    Log("backend", "success", "handler", `Created short URL: ${code} -> ${url}`);
    return res.status(201).json({
      shortLink: `${baseUrl}/${code}`,
      expiry: expiresAt.toISOString()
    });
  });
  r.get("/:shortcode", (req, res) => {
    const code = req.params.shortcode;
    const row = getUrl(code);
    if (!row) {
      Log("backend", "error", "handler", `Shortcode not found: ${code}`);
      return res.status(404).send("Short URL not found");
    }
    if (isExpired(row)) {
      Log("backend", "warning", "handler", `Expired shortcode: ${code}`);
      return res.status(410).send("Short URL expired");
    }
    addClick(code, { referrer: req.get("referer") || null });
    Log("backend", "info", "handler", `Redirected: ${code} -> ${row.longUrl}`);
    return res.redirect(302, row.longUrl);
  });
  r.get("/shorturls/:shortcode", (req, res) => {
    const data = getStats(req.params.shortcode);
    if (!data) {
      Log("backend", "error", "handler", `Stats not found for: ${req.params.shortcode}`);
      return res.status(404).json({ error: true, code: "NOT_FOUND" });
    }
    Log("backend", "info", "handler", `Fetched stats for: ${req.params.shortcode}`);
    return res.json(data);
  });
  return r;
}
