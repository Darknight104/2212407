import { Router } from "express";
import { saveEntry, fetchEntry, addVisit, expired, stats } from "../storage/storage.js";
import { generateCode, expiryFromMinutes, isWebUrl, validCodeFormat } from "../utils/utils.js";
function buildRoutes(baseUrl) {
  const router = Router();
  router.post("/shorturls", (req, res) => {
    const { url, validity, shortcode } = req.body || {};

    if (!isWebUrl(url)) {
      return res.status(400).json({
        error: true,
        code: "INVALID_URL",
        message: "The field 'url' must be a valid http/https link."
      });
    }
    let code = shortcode;
    if (code && !validCodeFormat(code)) {
      return res.status(400).json({
        error: true,
        code: "INVALID_CODE",
        message: "The field 'shortcode' must be 4–32 characters (letters or numbers)."
      });
    }
    if (!code) {
      code = generateCode(7);
    }
  const expiry = expiryFromMinutes(Number(validity));
    saveEntry(code, url, expiry);
    res.status(201).json({
      shortLink: `${baseUrl}/${code}`,
      expiry: expiry.toISOString()
    });
  });
  router.get("/shorturls/:shortcode", (req, res) => {
    const result = stats(req.params.shortcode);
    if (!result) {
      return res.status(404).json({ error: true, code: "NOT_FOUND" });
    }
    if (new Date(result.expiry).getTime() <= Date.now()) {
      return res.status(410).json({ error: true, code: "EXPIRED" });
    }
    res.json(result);
  });
  router.get("/:shortcode", (req, res) => {
    const entry = fetchEntry(req.params.shortcode);
    if (!entry) {
      return res.status(404).send("Short URL not found");
    }
    if (expired(entry)) {
      return res.status(410).send("Short URL expired");
    }
    addVisit(req.params.shortcode, { referrer: req.get("referer") || null });
    res.redirect(302, entry.target);
  });
  return router;
}
export { buildRoutes };
