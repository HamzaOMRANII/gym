const Category = require("../models/category.model");
const Exercise = require("../models/exercise.model");
const Plan = require("../models/plan.model");

const PUBLIC_EXERCISE_FIELDS = "-_id -__v -published -version -updatedBy -createdAt -updatedAt";
const PUBLIC_PLAN_FIELDS = "slug name commitment level who restNote days position";

// Everything the public pages need in one cacheable response: categories, exercises, plan templates.
async function catalog(_req, res, next) {
  try {
    const [categories, exercises, templates] = await Promise.all([
      Category.find({ published: true }).sort({ position: 1 }).select("-_id slug name blurb image").lean(),
      Exercise.find({ published: true }).sort({ position: 1 }).select(PUBLIC_EXERCISE_FIELDS).lean(),
      Plan.find({ isTemplate: true, published: true }).sort({ position: 1 }).select(PUBLIC_PLAN_FIELDS).lean(),
    ]);
    res.set("Cache-Control", "public, max-age=60");
    res.json({ success: true, categories, exercises, templates });
  } catch (error) { next(error); }
}

module.exports = { catalog };
