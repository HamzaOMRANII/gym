const mongoose = require("mongoose");
const { Schema } = mongoose;

// One exercise slot on a training day: the unit a member swaps.
const itemSchema = new Schema({
  exercise: { type: String, required: true, lowercase: true, trim: true }, // Exercise.slug
  sets: { type: Number, min: 1, max: 10, default: 3 },
  reps: { type: String, trim: true, maxlength: 30, default: "8-12" },
  rest: { type: String, trim: true, maxlength: 30, default: "90 sec" },
  restSec: { type: Number, min: 0, max: 600, default: 90 },
}, { _id: false });

const daySchema = new Schema({
  weekday: { type: Number, min: 0, max: 6, required: true }, // 0 = Monday
  focus: { type: String, trim: true, maxlength: 80, default: "" },
  isRest: { type: Boolean, default: false },
  notes: { type: [String], default: [] }, // shown on rest days: walking, stretching...
  items: { type: [itemSchema], default: [] },
}, { _id: false });

// Editors publish templates (isTemplate, no owner). Adopting one deep-copies it to a
// member-owned plan, so editing the template never changes a member's week.
const planSchema = new Schema({
  isTemplate: { type: Boolean, default: false, index: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  templateId: { type: Schema.Types.ObjectId, ref: "Plan", default: null },
  slug: { type: String, trim: true, lowercase: true, maxlength: 60 },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  commitment: { type: String, trim: true, maxlength: 80, default: "" },
  level: { type: String, enum: ["LOW", "MEDIUM", "ADVANCED"], default: "LOW" },
  who: { type: String, trim: true, maxlength: 400, default: "" },
  restNote: { label: { type: String, default: "Other days" }, items: { type: [String], default: [] } },
  days: { type: [daySchema], default: [] },
  position: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

planSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { isTemplate: true } });
planSchema.index({ owner: 1, active: 1 });

module.exports = mongoose.model("Plan", planSchema);
