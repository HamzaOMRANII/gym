const mongoose = require("mongoose");

const list = (max) => ({ type: [{ type: String, trim: true, maxlength: max }], default: [] });

// One exercise in the public library. Editorial content, edited from /admin.
const exerciseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9-]+$/, maxlength: 80 },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, lowercase: true, trim: true, index: true }, // Category.slug
  kit: { type: String, enum: ["tools", "bodyweight"], required: true },
  level: { type: String, enum: ["LOW", "MEDIUM", "ADVANCED"], default: "LOW" },
  trainingType: { type: String, enum: ["Push", "Pull", "Legs", "Core"], default: "Push" },
  sets: { type: Number, min: 1, max: 10, default: 3 },
  reps: { type: String, trim: true, maxlength: 30, default: "8-12" },
  rest: { type: String, trim: true, maxlength: 30, default: "90 sec" },
  restSec: { type: Number, min: 0, max: 600, default: 90 },
  muscles: { type: String, trim: true, maxlength: 120, default: "" },
  primaryMuscle: { type: String, trim: true, maxlength: 40, default: "" },
  secondaryMuscles: list(40),
  equipment: { type: String, trim: true, maxlength: 120, default: "" },
  equipTags: list(30),
  cues: list(300),
  instructions: list(400),
  setup: { type: String, trim: true, maxlength: 1000, default: "" },
  mistakes: list(300),
  safetyNotes: { type: String, trim: true, maxlength: 600, default: "" },
  alternatives: list(80), // exercise slugs
  image: { type: String, trim: true, maxlength: 300, default: "" },
  imageAlt: { type: String, trim: true, maxlength: 200, default: "" },
  videoUrl: { type: String, trim: true, maxlength: 300, default: "" },
  position: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  version: { type: Number, default: 1 },
  updatedBy: { type: String, trim: true, default: "" },
}, { timestamps: true });

exerciseSchema.index({ category: 1, position: 1 });

module.exports = mongoose.model("Exercise", exerciseSchema);
