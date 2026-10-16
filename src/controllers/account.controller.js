const argon2 = require("argon2");
const User = require("../models/user.model");
const Plan = require("../models/plan.model");
const WorkoutSession = require("../models/workoutSession.model");
const Measurement = require("../models/measurement.model");
const { setSessionCookie, clearSessionCookie, tokenForApp, PASSWORD_MIN } = require("./auth.controller");

const optionalNumber = (value, max) => {
  if (value === "" || value == null) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 && number <= max ? number : NaN;
};

function accountController(config) {
  return {
    update: async (req, res, next) => {
      try {
        const user = req.user;
        const body = req.body || {};
        if (body.name !== undefined) {
          const name = String(body.name).trim();
          if (!name || name.length > 80) return res.status(400).json({ success: false, error: "Enter a display name" });
          user.name = name;
        }
        if (body.timezone !== undefined) {
          const timezone = String(body.timezone).trim();
          try { new Intl.DateTimeFormat("en", { timeZone: timezone }); } catch { return res.status(400).json({ success: false, error: "Unknown timezone" }); }
          user.timezone = timezone;
        }
        const profile = body.profile || {};
        if (profile.units !== undefined) {
          if (!["metric", "imperial"].includes(profile.units)) return res.status(400).json({ success: false, error: "Units must be metric or imperial" });
          user.profile.units = profile.units;
        }
        for (const [field, max] of [["heightCm", 300], ["weightKg", 500]]) {
          if (profile[field] === undefined) continue;
          const value = optionalNumber(profile[field], max);
          if (Number.isNaN(value)) return res.status(400).json({ success: false, error: `Invalid ${field === "heightCm" ? "height" : "weight"}` });
          user.profile[field] = value;
        }
        if (profile.sessionsPerWeek !== undefined) {
          if (![2, 3, 5].includes(Number(profile.sessionsPerWeek))) return res.status(400).json({ success: false, error: "Sessions per week must be 2, 3 or 5" });
          user.profile.sessionsPerWeek = Number(profile.sessionsPerWeek);
        }
        const notifications = body.notifications || {};
        for (const key of ["reminders", "digest", "newContent", "product"]) {
          if (typeof notifications[key] === "boolean") user.notifications[key] = notifications[key];
        }
        await user.save();
        res.json({ success: true, user: user.toJSON() });
      } catch (error) { next(error); }
    },

    changePassword: async (req, res, next) => {
      try {
        const user = await User.findById(req.user._id).select("+passwordHash");
        if (!(await argon2.verify(user.passwordHash, String(req.body.currentPassword || "")))) {
          return res.status(401).json({ success: false, error: "Current password is incorrect" });
        }
        const newPassword = String(req.body.newPassword || "");
        if (newPassword.length < PASSWORD_MIN) return res.status(400).json({ success: false, error: `Use a password of at least ${PASSWORD_MIN} characters` });
        user.passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id });
        // Ends every other session; this browser gets a fresh cookie issued one second later.
        user.credentialsChangedAt = new Date(Date.now() - 1000);
        await user.save();
        const token = setSessionCookie(res, user, config, true);
        res.json({ success: true, ...tokenForApp(req, token) });
      } catch (error) { next(error); }
    },

    signoutEverywhere: async (req, res, next) => {
      try {
        req.user.credentialsChangedAt = new Date();
        await req.user.save();
        clearSessionCookie(res, config);
        res.json({ success: true });
      } catch (error) { next(error); }
    },

    exportData: async (req, res, next) => {
      try {
        const [plans, sessions, measurements] = await Promise.all([
          Plan.find({ owner: req.user._id }).lean(),
          WorkoutSession.find({ user: req.user._id }).sort({ date: 1 }).lean(),
          Measurement.find({ user: req.user._id }).sort({ date: 1 }).lean(),
        ]);
        const payload = { exportedAt: new Date().toISOString(), account: req.user.toJSON(), plans, sessions, measurements };
        const filename = `groundwork-export-${new Date().toISOString().slice(0, 10)}.json`;
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.type("application/json").send(JSON.stringify(payload, null, 2));
      } catch (error) { next(error); }
    },

    remove: async (req, res, next) => {
      try {
        const user = await User.findById(req.user._id).select("+passwordHash");
        if (!(await argon2.verify(user.passwordHash, String(req.body.password || "")))) {
          return res.status(401).json({ success: false, error: "Password is incorrect" });
        }
        await Promise.all([
          Plan.deleteMany({ owner: user._id }),
          WorkoutSession.deleteMany({ user: user._id }),
          Measurement.deleteMany({ user: user._id }),
        ]);
        await user.deleteOne();
        clearSessionCookie(res, config);
        res.json({ success: true });
      } catch (error) { next(error); }
    },
  };
}

module.exports = { accountController };
