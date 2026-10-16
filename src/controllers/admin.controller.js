const mongoose = require("mongoose");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Exercise = require("../models/exercise.model");
const Plan = require("../models/plan.model");
const WorkoutSession = require("../models/workoutSession.model");

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const notFound = (res, what) => res.status(404).json({ success: false, error: `${what} not found` });
const badRequest = (res, error) => res.status(400).json({ success: false, error });
const text = (value, max) => String(value ?? "").trim().slice(0, max);
const textList = (value, max) => (Array.isArray(value) ? value : []).map((entry) => text(entry, max)).filter(Boolean).slice(0, 20);

async function stats(_req, res, next) {
  try {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - 13);
    const twoWeeksAgo = since.toISOString().slice(0, 10);
    const [members, newMembers, sessions, newSessions, adoptions, exercises, signupDays, recentUsers, recentSessions] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: since } }),
      WorkoutSession.countDocuments(),
      WorkoutSession.countDocuments({ date: { $gte: twoWeeksAgo } }),
      Plan.countDocuments({ isTemplate: false }),
      Exercise.countDocuments({ published: true }),
      User.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select("name createdAt").lean(),
      WorkoutSession.find().sort({ createdAt: -1 }).limit(5).populate("user", "name").select("user focus createdAt").lean(),
    ]);
    const byDay = Object.fromEntries(signupDays.map((entry) => [entry._id, entry.count]));
    const signups = Array.from({ length: 14 }, (_, index) => {
      const day = new Date(since);
      day.setDate(since.getDate() + index);
      const key = day.toISOString().slice(0, 10);
      return { date: key, count: byDay[key] || 0 };
    });
    const activity = [
      ...recentUsers.map((user) => ({ kind: "signup", text: `${user.name} created an account`, at: user.createdAt })),
      ...recentSessions.map((session) => ({ kind: "session", text: `${session.user?.name || "A member"} logged ${session.focus || "a workout"}`, at: session.createdAt })),
    ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6);
    res.json({ success: true, stats: { members, newMembers, sessions, newSessions, adoptions, exercises }, signups, activity });
  } catch (error) { next(error); }
}

// ---- Exercises ----

function exerciseFields(body) {
  const fields = {
    name: text(body.name, 100),
    slug: text(body.slug, 80).toLowerCase(),
    category: text(body.category, 60).toLowerCase(),
    kit: body.kit === "bodyweight" ? "bodyweight" : "tools",
    level: ["LOW", "MEDIUM", "ADVANCED"].includes(body.level) ? body.level : "LOW",
    trainingType: ["Push", "Pull", "Legs", "Core"].includes(body.trainingType) ? body.trainingType : "Push",
    sets: Math.min(10, Math.max(1, Number(body.sets) || 3)),
    reps: text(body.reps, 30) || "8-12",
    rest: text(body.rest, 30) || "90 sec",
    restSec: Math.min(600, Math.max(0, Number(body.restSec) || 90)),
    muscles: text(body.muscles, 120),
    primaryMuscle: text(body.primaryMuscle, 40),
    secondaryMuscles: textList(body.secondaryMuscles, 40),
    equipment: text(body.equipment, 120),
    equipTags: textList(body.equipTags, 30),
    cues: textList(body.cues, 300),
    instructions: textList(body.instructions, 400),
    setup: text(body.setup, 1000),
    mistakes: textList(body.mistakes, 300),
    safetyNotes: text(body.safetyNotes, 600),
    alternatives: textList(body.alternatives, 80).map((slug) => slug.toLowerCase()),
    image: text(body.image, 300),
    imageAlt: text(body.imageAlt, 200),
    videoUrl: text(body.videoUrl, 300),
    published: body.published !== false,
  };
  if (!fields.name) return { error: "Exercise name is required" };
  if (!SLUG_PATTERN.test(fields.slug)) return { error: "URL slug may contain only lowercase letters, digits and hyphens" };
  if (fields.videoUrl && !/^https:\/\//.test(fields.videoUrl)) return { error: "Video URL must start with https://" };
  return { fields };
}

async function listExercises(_req, res, next) {
  try {
    res.json({ success: true, exercises: await Exercise.find().sort({ category: 1, position: 1 }).lean() });
  } catch (error) { next(error); }
}

async function createExercise(req, res, next) {
  try {
    const { fields, error } = exerciseFields(req.body || {});
    if (error) return badRequest(res, error);
    if (!(await Category.exists({ slug: fields.category }))) return badRequest(res, "Pick an existing category");
    const position = await Exercise.countDocuments({ category: fields.category });
    const exercise = await Exercise.create({ ...fields, position, updatedBy: req.user.name });
    res.status(201).json({ success: true, exercise });
  } catch (error) { next(error); }
}

async function updateExercise(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res, "Exercise");
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return notFound(res, "Exercise");
    const { fields, error } = exerciseFields(req.body || {});
    if (error) return badRequest(res, error);
    if (!(await Category.exists({ slug: fields.category }))) return badRequest(res, "Pick an existing category");
    const oldSlug = exercise.slug;
    exercise.set({ ...fields, version: exercise.version + 1, updatedBy: req.user.name });
    await exercise.save();
    // Keep plans pointing at the exercise when its slug changes.
    if (oldSlug !== exercise.slug) {
      await Plan.updateMany({ "days.items.exercise": oldSlug }, { $set: { "days.$[].items.$[item].exercise": exercise.slug } }, { arrayFilters: [{ "item.exercise": oldSlug }] });
    }
    res.json({ success: true, exercise });
  } catch (error) { next(error); }
}

async function removeExercise(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res, "Exercise");
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return notFound(res, "Exercise");
    const usedBy = await Plan.countDocuments({ "days.items.exercise": exercise.slug });
    if (usedBy) return res.status(409).json({ success: false, error: `Used in ${usedBy} plan${usedBy === 1 ? "" : "s"}. Unpublish it instead.` });
    await exercise.deleteOne();
    res.json({ success: true });
  } catch (error) { next(error); }
}

// ---- Categories ----

function categoryFields(body) {
  const fields = {
    name: text(body.name, 60),
    slug: text(body.slug, 60).toLowerCase(),
    blurb: text(body.blurb, 400),
    image: text(body.image, 300),
    published: body.published !== false,
  };
  if (!fields.name) return { error: "Category name is required" };
  if (!SLUG_PATTERN.test(fields.slug)) return { error: "URL slug may contain only lowercase letters, digits and hyphens" };
  return { fields };
}

async function listCategories(_req, res, next) {
  try {
    const [categories, counts] = await Promise.all([
      Category.find().sort({ position: 1 }).lean(),
      Exercise.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);
    const byCategory = Object.fromEntries(counts.map((entry) => [entry._id, entry.count]));
    res.json({ success: true, categories: categories.map((category) => ({ ...category, exerciseCount: byCategory[category.slug] || 0 })) });
  } catch (error) { next(error); }
}

async function createCategory(req, res, next) {
  try {
    const { fields, error } = categoryFields(req.body || {});
    if (error) return badRequest(res, error);
    const category = await Category.create({ ...fields, position: await Category.countDocuments() });
    res.status(201).json({ success: true, category });
  } catch (error) { next(error); }
}

async function updateCategory(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res, "Category");
    const category = await Category.findById(req.params.id);
    if (!category) return notFound(res, "Category");
    const { fields, error } = categoryFields(req.body || {});
    if (error) return badRequest(res, error);
    const oldSlug = category.slug;
    category.set(fields);
    await category.save();
    if (oldSlug !== category.slug) await Exercise.updateMany({ category: oldSlug }, { category: category.slug });
    res.json({ success: true, category });
  } catch (error) { next(error); }
}

async function removeCategory(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res, "Category");
    const category = await Category.findById(req.params.id);
    if (!category) return notFound(res, "Category");
    const exercises = await Exercise.countDocuments({ category: category.slug });
    if (exercises) return res.status(409).json({ success: false, error: `Move or delete its ${exercises} exercises first` });
    await category.deleteOne();
    res.json({ success: true });
  } catch (error) { next(error); }
}

// ---- Plan templates ----

async function listTemplates(_req, res, next) {
  try {
    const [templates, adoptions] = await Promise.all([
      Plan.find({ isTemplate: true }).sort({ position: 1 }).lean(),
      Plan.aggregate([{ $match: { isTemplate: false, active: true } }, { $group: { _id: "$templateId", count: { $sum: 1 } } }]),
    ]);
    const byTemplate = Object.fromEntries(adoptions.map((entry) => [String(entry._id), entry.count]));
    res.json({ success: true, templates: templates.map((plan) => ({ ...plan, adoptedBy: byTemplate[String(plan._id)] || 0 })) });
  } catch (error) { next(error); }
}

async function updateTemplate(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res, "Plan template");
    const plan = await Plan.findOne({ _id: req.params.id, isTemplate: true });
    if (!plan) return notFound(res, "Plan template");
    if (typeof req.body.published === "boolean") plan.published = req.body.published;
    await plan.save();
    res.json({ success: true, template: plan });
  } catch (error) { next(error); }
}

// ---- Users ----

async function listUsers(_req, res, next) {
  try {
    res.json({ success: true, users: await User.find().sort({ createdAt: -1 }).limit(500).lean() });
  } catch (error) { next(error); }
}

async function updateUser(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res, "User");
    const user = await User.findById(req.params.id);
    if (!user) return notFound(res, "User");
    if (user.id === req.user.id) return badRequest(res, "You cannot change your own role or status");
    if (req.body.role !== undefined) {
      if (!["member", "editor", "admin"].includes(req.body.role)) return badRequest(res, "Unknown role");
      user.role = req.body.role;
    }
    if (req.body.status !== undefined) {
      if (!["active", "disabled"].includes(req.body.status)) return badRequest(res, "Unknown status");
      user.status = req.body.status;
      if (user.status === "disabled") user.credentialsChangedAt = new Date();
    }
    await user.save();
    res.json({ success: true, user: user.toJSON() });
  } catch (error) { next(error); }
}

module.exports = {
  stats,
  listExercises, createExercise, updateExercise, removeExercise,
  listCategories, createCategory, updateCategory, removeCategory,
  listTemplates, updateTemplate,
  listUsers, updateUser,
};
