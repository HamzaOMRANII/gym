const required = ["MONGO_URI", "JWT_SECRET"];

function loadConfig() {
  const production = process.env.NODE_ENV === "production";
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");

  // APP_ORIGIN may list several origins separated by commas; each is normalized
  // (scheme + host + port, no path or trailing slash) so "http://x:14000/" matches "http://x:14000".
  const allowedOrigins = String(process.env.APP_ORIGIN || "http://localhost:14000")
    .split(",").map((value) => value.trim()).filter(Boolean)
    .map((value) => {
      try { return new URL(value).origin; } catch { throw new Error(`APP_ORIGIN contains an invalid URL: "${value}"`); }
    });
  const appOrigin = allowedOrigins[0];
  return {
    allowedOrigins,
    // Loopback by default so only the reverse proxy (Nginx) can reach Express.
    host: process.env.HOST || "127.0.0.1",
    port: Number(process.env.PORT || 14000),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    production,
    appOrigin,
    // HTTPS-only cookies, HSTS and upgrade-insecure-requests apply only when the public origin is HTTPS.
    https: appOrigin.startsWith("https://"),
  };
}

module.exports = { loadConfig };
