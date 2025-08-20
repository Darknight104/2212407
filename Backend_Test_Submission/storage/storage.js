const store = new Map();
function saveEntry(shortcode, target, expiry) {
  store.set(shortcode, {
    target,
    expiry,
    created: new Date(),
    clicks: []
  });
}
function fetchEntry(shortcode) {
  return store.get(shortcode) || null;
}
function addVisit(shortcode, details) {
  const entry = store.get(shortcode);
  if (!entry) return;
  entry.clicks.push({ time: new Date(), ...details });
}
function expired(entry) {
  return !entry || entry.expiry.getTime() <= Date.now();
}
function stats(shortcode) {
  const entry = store.get(shortcode);
  if (!entry) return null;
  return {
    shortcode,
    target: entry.target,
    created: entry.created.toISOString(),
    expiry: entry.expiry.toISOString(),
    totalClicks: entry.clicks.length,
    recentClicks: entry.clicks.slice(-50)
  };
}
export { saveEntry, fetchEntry, addVisit, expired, stats };
