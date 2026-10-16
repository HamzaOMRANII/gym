const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function userFromRequest(req, config) {
  const token = req.cookies.session;
  if (!token) return null;
  const payload = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
  const user = await User.findOne({ _id: payload.sub, status: "active" });
  if (!user) return null;
  if (user.credentialsChangedAt && payload.iat < Math.floor(user.credentialsChangedAt.getTime() / 1000)) return null;
  return user;
}

function authMiddleware(config) {
  return async (req, res, next) => {
    try {
      const user = await userFromRequest(req, config);
      if (!user) return res.status(401).json({ success: false, error: "Sign in to continue" });
      req.user = user;
      next();
    } catch (_error) {
      res.status(401).json({ success: false, error: "Invalid or expired session" });
    }
  };
}

function requireRole(...roles) {
  return (req, res, next) => roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ success: false, error: "Insufficient permissions" });
}

module.exports = { authMiddleware, requireRole, userFromRequest };
