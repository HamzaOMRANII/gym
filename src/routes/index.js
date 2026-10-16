const express = require("express");
const rateLimit = require("express-rate-limit");
const { authController } = require("../controllers/auth.controller");
const { accountController } = require("../controllers/account.controller");
const { catalog } = require("../controllers/catalog.controller");
const training = require("../controllers/training.controller");
const admin = require("../controllers/admin.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");

function createRoutes(config) {
  const router = express.Router();
  const session = authMiddleware(config);
  const staff = [session, requireRole("editor", "admin")];
  const adminOnly = [session, requireRole("admin")];
  const auth = authController(config);
  const account = accountController(config);
  const limiter = (limit, options = {}) => rateLimit({
    windowMs: 15 * 60 * 1000, limit, standardHeaders: "draft-8", ...options,
    message: { success: false, error: "Too many attempts. Wait 15 minutes and try again." },
  });
  const signinLimiter = limiter(10, { skipSuccessfulRequests: true });
  const registerLimiter = limiter(5);
  // Only failed attempts count, so normal use is never blocked.
  const sensitiveLimiter = limiter(10, { skipSuccessfulRequests: true });
  const writeLimiter = limiter(300);

  router.get("/catalog", catalog);

  router.post("/auth/register", registerLimiter, auth.register);
  router.post("/auth/signin", signinLimiter, auth.signin);
  router.post("/auth/signout", auth.signout);
  router.get("/auth/me", auth.me);

  router.patch("/account", session, writeLimiter, account.update);
  router.post("/account/password", session, sensitiveLimiter, account.changePassword);
  router.post("/account/signout-everywhere", session, account.signoutEverywhere);
  router.get("/account/export", session, account.exportData);
  router.post("/account/delete", session, sensitiveLimiter, account.remove);

  router.get("/training", session, training.overview);
  router.post("/training/plan", session, writeLimiter, training.adopt);
  router.patch("/training/plan/days/:weekday/items/:index", session, writeLimiter, training.swapItem);
  router.post("/training/sessions", session, writeLimiter, training.logSession);
  router.post("/training/measurements", session, writeLimiter, training.addMeasurement);
  router.delete("/training", session, training.clearTraining);

  router.get("/admin/stats", staff, admin.stats);
  router.get("/admin/exercises", staff, admin.listExercises);
  router.post("/admin/exercises", staff, admin.createExercise);
  router.patch("/admin/exercises/:id", staff, admin.updateExercise);
  router.delete("/admin/exercises/:id", staff, admin.removeExercise);
  router.get("/admin/categories", staff, admin.listCategories);
  router.post("/admin/categories", staff, admin.createCategory);
  router.patch("/admin/categories/:id", staff, admin.updateCategory);
  router.delete("/admin/categories/:id", staff, admin.removeCategory);
  router.get("/admin/templates", staff, admin.listTemplates);
  router.patch("/admin/templates/:id", staff, admin.updateTemplate);
  router.get("/admin/users", adminOnly, admin.listUsers);
  router.patch("/admin/users/:id", adminOnly, admin.updateUser);
  return router;
}

module.exports = { createRoutes };
