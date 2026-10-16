const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  role: { type: String, enum: ["member", "editor", "admin"], default: "member" },
  passwordHash: { type: String, required: true, select: false },
  status: { type: String, enum: ["active", "disabled"], default: "active" },
  timezone: { type: String, trim: true, maxlength: 64, default: "Europe/Paris" },
  profile: {
    units: { type: String, enum: ["metric", "imperial"], default: "metric" },
    heightCm: { type: Number, min: 0, max: 300 },
    weightKg: { type: Number, min: 0, max: 500 },
    sessionsPerWeek: { type: Number, enum: [2, 3, 5], default: 3 },
  },
  notifications: {
    reminders: { type: Boolean, default: true },
    digest: { type: Boolean, default: true },
    newContent: { type: Boolean, default: false },
    product: { type: Boolean, default: true },
  },
  // The training disclaimer is accepted explicitly at signup, with its version and a timestamp.
  disclaimerVersion: { type: String, required: true },
  disclaimerAcceptedAt: { type: Date, required: true },
  // Sessions issued before this moment are rejected (password change, "sign out everywhere").
  credentialsChangedAt: { type: Date, default: null },
  lastLoginAt: Date,
}, { timestamps: true });

userSchema.set("toJSON", { transform: (_doc, value) => {
  delete value.passwordHash;
  delete value.__v;
  return value;
} });

module.exports = mongoose.model("User", userSchema);
