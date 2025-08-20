export const DEFAULT_VALIDITY_MIN = 30;
export function makeCode(len = 7) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
export function toExpiry(minutes) {
  const m = Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_VALIDITY_MIN;
  return new Date(Date.now() + m * 60000);
}
export function isHttpUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
export function isValidCode(code) {
  return /^[0-9a-zA-Z]{4,32}$/.test(code);
}
