const Plan = require("../models/plan.model");
const Exercise = require("../models/exercise.model");
const WorkoutSession = require("../models/workoutSession.model");
const Measurement = require("../models/measurement.model");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);
const positiveOrUndefined = (value, max) => {
  if (value === "" || value == null) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= max ? number : NaN;
};
const notFound = (res, what) => res.status(404).json({ success: false, error: `${what} not found` });

async function activePlan(userId) {
  return Plan.findOne({ owner: userId, isTemplate: false, active: true });
}

// The member's plan, logged sessions and measurements: everything the training app shows.
async function overview(req, res, next) {
  try {
    const [plan, sessions, measurements] = await Promise.all([
      activePlan(req.user._id),
      WorkoutSession.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 }).limit(60).lean(),
      Measurement.find({ user: req.user._id }).sort({ date: 1, createdAt: 1 }).lean(),
    ]);
    res.json({ success: true, plan, sessions, measurements });
  } catch (error) { next(error); }
}

// Copy-on-adopt: the template's days and items are deep-copied into a plan the member owns.
async function adopt(req, res, next) {
  try {
    const slug = String(req.body.template || "");
    const template = await Plan.findOne({ isTemplate: true, published: true, slug }).lean();
    if (!template) return notFound(res, "Plan template");
    await Plan.updateMany({ owner: req.user._id, active: true }, { active: false });
    const plan = await Plan.create({
      owner: req.user._id,
      templateId: template._id,
      slug: template.slug,
      name: template.name,
      commitment: template.commitment,
      level: template.level,
      who: template.who,
      restNote: template.restNote,
      days: template.days,
      active: true,
    });
    res.status(201).json({ success: true, plan });
  } catch (error) { next(error); }
}

// Swap one exercise for another that trains the same body part.
async function swapItem(req, res, next) {
  try {
    const plan = await activePlan(req.user._id);
    if (!plan) return notFound(res, "Plan");
    const day = plan.days.find((entry) => entry.weekday === Number(req.params.weekday));
    const item = day?.items[Number(req.params.index)];
    if (!item) return notFound(res, "Plan item");
    const [current, replacement] = await Promise.all([
      Exercise.findOne({ slug: item.exercise }).lean(),
      Exercise.findOne({ slug: String(req.body.exercise || ""), published: true }).lean(),
    ]);
    if (!replacement) return notFound(res, "Exercise");
    if (current && current.category !== replacement.category) {
      return res.status(400).json({ success: false, error: "Swap for an exercise from the same body part" });
    }
    item.exercise = replacement.slug;
    item.sets = replacement.sets;
    item.reps = replacement.reps;
    item.rest = replacement.rest;
    item.restSec = replacement.restSec;
    plan.markModified("days");
    await plan.save();
    res.json({ success: true, plan });
  } catch (error) { next(error); }
}

// Idempotent on clientRef: an offline retry of the same workout returns the stored copy.
async function logSession(req, res, next) {
  try {
    const body = req.body || {};
    const clientRef = String(body.clientRef || "").trim();
    if (!clientRef || clientRef.length > 64) return res.status(400).json({ success: false, error: "clientRef is required" });
    const lines = (Array.isArray(body.lines) ? body.lines : []).slice(0, 30).map((line) => ({
      exercise: String(line.exercise || "").slice(0, 80),
      name: String(line.name || "").slice(0, 100),
      sets: (Array.isArray(line.sets) ? line.sets : []).slice(0, 10).map((set) => ({
        weight: positiveOrUndefined(set.weight, 1000),
        reps: String(set.reps ?? "").slice(0, 20),
      })),
    })).filter((line) => line.exercise && line.sets.length);
    if (!lines.length) return res.status(400).json({ success: false, error: "Log at least one set" });
    if (lines.some((line) => line.sets.some((set) => Number.isNaN(set.weight)))) {
      return res.status(400).json({ success: false, error: "Weights must be numbers" });
    }
    const existing = await WorkoutSession.findOne({ user: req.user._id, clientRef }).lean();
    if (existing) return res.json({ success: true, session: existing });
    const session = await WorkoutSession.create({
      user: req.user._id,
      clientRef,
      date: DATE_PATTERN.test(body.date) ? body.date : today(),
      day: String(body.day || "").slice(0, 20),
      focus: String(body.focus || "").slice(0, 80),
      unit: body.unit === "lb" ? "lb" : "kg",
      lines,
    });
    res.status(201).json({ success: true, session });
  } catch (error) { next(error); }
}

async function addMeasurement(req, res, next) {
  try {
    const body = req.body || {};
    const entry = {
      weight: positiveOrUndefined(body.weight, 1000),
      chest: positiveOrUndefined(body.chest, 500),
      arm: positiveOrUndefined(body.arm, 200),
    };
    if (Object.values(entry).some(Number.isNaN)) return res.status(400).json({ success: false, error: "Measurements must be positive numbers" });
    if (Object.values(entry).every((value) => value === undefined)) return res.status(400).json({ success: false, error: "Enter at least one measurement" });
    const measurement = await Measurement.create({
      user: req.user._id,
      date: DATE_PATTERN.test(body.date) ? body.date : today(),
      units: req.user.profile.units,
      ...entry,
    });
    res.status(201).json({ success: true, measurement });
  } catch (error) { next(error); }
}

async function clearTraining(req, res, next) {
  try {
    await Promise.all([
      WorkoutSession.deleteMany({ user: req.user._id }),
      Measurement.deleteMany({ user: req.user._id }),
    ]);
    res.json({ success: true });
  } catch (error) { next(error); }
}

module.exports = { overview, adopt, swapItem, logSession, addMeasurement, clearTraining };
