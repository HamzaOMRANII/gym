const mongoose = require("mongoose");

// A body measurement entry: weight in the weight unit, chest and arm in the length unit.
const measurementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, match: /^\d{4}-\d{2}-\d{2}$/, required: true },
  weight: { type: Number, min: 0, max: 1000 },
  chest: { type: Number, min: 0, max: 500 },
  arm: { type: Number, min: 0, max: 200 },
  units: { type: String, enum: ["metric", "imperial"], default: "metric" },
}, { timestamps: true });

measurementSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("Measurement", measurementSchema);
