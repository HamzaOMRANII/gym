// Loads the initial catalog (categories, exercises, plan templates).
// Inserts what is missing and leaves existing records alone, so editors' changes survive a re-run
// (except that a record with no image gets the seed image).
// Pass --reset to overwrite catalog records with the seed versions (member plans and logs are never touched).
require("dotenv").config({ path: process.env.ENV_FILE || require("path").join(__dirname, "../.env"), override: true, quiet: true });
const { connectDB, disconnectDB } = require("../src/database/connection");
const Category = require("../src/models/category.model");
const Exercise = require("../src/models/exercise.model");
const Plan = require("../src/models/plan.model");
const catalog = require("../src/seed/catalog");

async function upsertAll(Model, records, key, extra = {}) {
  const reset = process.argv.includes("--reset");
  let written = 0;
  for (const record of records) {
    const filter = { [key]: record[key], ...extra };
    const result = reset
      ? await Model.replaceOne(filter, { ...record, ...extra }, { upsert: true })
      : await Model.updateOne(filter, { $setOnInsert: { ...record, ...extra } }, { upsert: true });
    written += (result.upsertedCount || 0) + (reset ? result.modifiedCount || 0 : 0);
  }
  return written;
}

// Records that still have no image get the seed image; an image chosen in /admin is never replaced.
async function fillImages(Model, records) {
  let filled = 0;
  for (const { slug, image, imageAlt } of records) {
    if (!image) continue;
    const result = await Model.updateOne({ slug, image: { $in: ["", null] } }, { $set: { image, ...(imageAlt ? { imageAlt } : {}) } });
    filled += result.modifiedCount || 0;
  }
  return filled;
}

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not set");
  await connectDB(process.env.MONGO_URI);
  await Promise.all([Category.init(), Exercise.init(), Plan.init()]);
  const categories = await upsertAll(Category, catalog.categories, "slug");
  const exercises = await upsertAll(Exercise, catalog.exercises, "slug");
  const templates = await upsertAll(Plan, catalog.templates, "slug", { isTemplate: true, owner: null });
  const images = (await fillImages(Category, catalog.categories)) + (await fillImages(Exercise, catalog.exercises));
  console.log(`Seed complete: ${categories} categories, ${exercises} exercises, ${templates} plan templates written, ${images} missing images filled.`);
}

main()
  .catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(disconnectDB);
