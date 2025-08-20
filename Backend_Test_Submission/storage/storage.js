const urls = new Map();
export function saveUrl(shortcode, longUrl, expiresAt) {
  const createdAt = new Date();
  urls.set(shortcode, { longUrl, expiresAt, createdAt, clicks: [] });
}
export function getUrl(shortcode) {
  return urls.get(shortcode) || null;
}
export function addClick(shortcode, info) {
  const row = urls.get(shortcode);
  if (!row) return;
  row.clicks.push({ ts: new Date(), ...info });
}
export function isExpired(row) {
  return !row || row.expiresAt.getTime() <= Date.now();
}
export function getStats(shortcode) {
  const row = urls.get(shortcode);
  if (!row) return null;
  return {
    shortcode,
    longUrl: row.longUrl,
    createdAt: row.createdAt.toISOString(),
    expiry: row.expiresAt.toISOString(),
    totalClicks: row.clicks.length,
    clicks: row.clicks.slice(-50)
  };
}
