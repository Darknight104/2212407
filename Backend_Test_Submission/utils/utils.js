const DEFAULT_VALIDITY_MINUTES = 30;
function generateCode(length = 7) {
  const alphabet="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i=0; i < length; i++) {
    result+=alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}
function expiryFromMinutes(minutes) {
  const validMinutes=Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_VALIDITY_MINUTES;
  return new Date(Date.now() + validMinutes * 60000);
}

function isWebUrl(str) {
  try {
    const parsed=new URL(str);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validCodeFormat(code) {
  return /^[0-9a-zA-Z]{4,32}$/.test(code);
}

export { DEFAULT_VALIDITY_MINUTES, generateCode, expiryFromMinutes, isWebUrl, validCodeFormat };
