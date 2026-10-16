const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { userFromRequest } = require("../middleware/auth");

const DISCLAIMER_VERSION = "2026-09";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 10;

// "Keep me signed in" keeps the cookie for 30 days; otherwise it ends with the browser session.
function setSessionCookie(res, user, config, keep) {
  const ttlSeconds = keep ? 30 * 24 * 60 * 60 : 12 * 60 * 60;
  const token = jwt.sign({ sub: user.id }, config.jwtSecret, { algorithm: "HS256", expiresIn: ttlSeconds });
  res.cookie("session", token, {
    httpOnly: true,
    secure: config.https,
    sameSite: "lax",
    path: "/",
    ...(keep ? { maxAge: ttlSeconds * 1000 } : {}),
  });
  return token;
}

// The Android app cannot use the cookie (its pages are not on gym.omranisystems.com), so requests
// marked "X-Client: android" also get the token in the JSON body; the app stores it and sends it back.
const isAppRequest = (req) => req.get("x-client") === "android";
const tokenForApp = (req, token) => (isAppRequest(req) ? { token } : {});

function clearSessionCookie(res, config) {
  res.clearCookie("session", { httpOnly: true, secure: config.https, sameSite: "lax", path: "/" });
}

function authController(config) {
  return {
    register: async (req, res, next) => {
      try {
        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");
        if (!name || name.length > 80) return res.status(400).json({ success: false, error: "Enter a display name" });
        if (!EMAIL_PATTERN.test(email)) return res.status(400).json({ success: false, error: "Enter a valid email address" });
        if (password.length < PASSWORD_MIN) return res.status(400).json({ success: false, error: `Use a password of at least ${PASSWORD_MIN} characters` });
        if (req.body.acceptDisclaimer !== true) return res.status(400).json({ success: false, error: "Accept the training disclaimer, terms and privacy policy to continue" });
        if (await User.exists({ email })) return res.status(409).json({ success: false, error: "An account with this email already exists" });

        const user = await User.create({
          name, email,
          passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
          disclaimerVersion: DISCLAIMER_VERSION,
          disclaimerAcceptedAt: new Date(),
          lastLoginAt: new Date(),
        });
        const token = setSessionCookie(res, user, config, isAppRequest(req) || Boolean(req.body.keep));
        res.status(201).json({ success: true, user: user.toJSON(), ...tokenForApp(req, token) });
      } catch (error) { next(error); }
    },

    signin: async (req, res, next) => {
      try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const user = await User.findOne({ email, status: "active" }).select("+passwordHash");
        if (!user || !(await argon2.verify(user.passwordHash, String(req.body.password || "")))) {
          return res.status(401).json({ success: false, error: "Incorrect email or password" });
        }
        user.lastLoginAt = new Date();
        await user.save();
        const token = setSessionCookie(res, user, config, isAppRequest(req) || Boolean(req.body.keep));
        res.json({ success: true, user: user.toJSON(), ...tokenForApp(req, token) });
      } catch (error) { next(error); }
    },

    signout: (_req, res) => {
      clearSessionCookie(res, config);
      res.json({ success: true });
    },

    // Never 401: the public pages call this to decide between "Sign in" and "My account".
    me: async (req, res) => {
      let user = null;
      try { user = await userFromRequest(req, config); } catch { /* expired or invalid token */ }
      if (!user && req.cookies.session) clearSessionCookie(res, config);
      res.json({ success: true, user: user ? user.toJSON() : null });
    },
  };
}

module.exports = { authController, setSessionCookie, clearSessionCookie, tokenForApp, PASSWORD_MIN };
