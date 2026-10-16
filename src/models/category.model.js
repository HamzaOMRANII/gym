const mongoose = require("mongoose");

// A body-part grouping of the exercise library (Chest, Back, ...).
const categorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9-]+$/, maxlength: 60 },
  name: { type: String, required: true, trim: true, maxlength: 60 },
  blurb: { type: String, trim: true, maxlength: 400, default: "" },
  image: { type: String, trim: true, maxlength: 300, default: "" },
  position: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
