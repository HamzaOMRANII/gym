const path = require("path");
const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { createRoutes } = require("./routes");

function createApp(config) {
  const app = express();
  app.locals.config = config;
  app.set("trust proxy", 1);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        upgradeInsecureRequests: config.https ? [] : null,
      },
    },
    strictTransportSecurity: config.https,
  }));
  if (config.production && !config.https) console.warn("WARNING: APP_ORIGIN is not HTTPS; credentials travel unencrypted. Use HTTPS for real use.");
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use((req, res, next) => {
    const safeMethod = ["GET", "HEAD", "OPTIONS"].includes(req.method);
    if (!config.production || safeMethod) return next();
    const origin = req.get("origin");
    let normalized = null;
    try { normalized = origin ? new URL(origin).origin : null; } catch { /* malformed Origin header */ }
    if (normalized && config.allowedOrigins.includes(normalized)) return next();
    console.warn(`Rejected ${req.method} ${req.originalUrl}: Origin "${origin || "(none)"}" is not in APP_ORIGIN (${config.allowedOrigins.join(", ")})`);
    return res.status(403).json({ success: false, error: `Untrusted request origin. Set APP_ORIGIN=${origin || "<site URL>"} on the server.` });
  });
  app.get("/health", (_req, res) => res.json({ status: "ok", service: "groundwork" }));
  app.use("/api", createRoutes(config));
  app.use("/api", (_req, res) => res.status(404).json({ success: false, error: "Not found" }));
  const distPath = path.join(__dirname, "../dist");
  if (fs.existsSync(distPath)) {
    // Clean URLs: /plans serves plans.html, / serves index.html.
    app.use(express.static(distPath, { extensions: ["html"], maxAge: config.production ? "1d" : 0 }));
    app.use((_req, res) => res.status(404).sendFile(path.join(distPath, "index.html")));
  }
  app.use((error, _req, res, _next) => {
    console.error(error);
    if (error?.code === 11000) return res.status(409).json({ success: false, error: "A record with this value already exists" });
    if (error?.name === "ValidationError") return res.status(400).json({ success: false, error: Object.values(error.errors)[0]?.message || "Invalid data" });
    res.status(500).json({ success: false, error: "Internal server error" });
  });
  return app;
}

module.exports = { createApp };
