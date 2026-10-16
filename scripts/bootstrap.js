// Creates the first administrator, or promotes an existing account to admin.
// Usage: BOOTSTRAP_ADMIN_EMAIL=... BOOTSTRAP_ADMIN_PASSWORD=... npm run bootstrap
require("dotenv").config({ path: process.env.ENV_FILE || require("path").join(__dirname, "../.env"), override: true, quiet: true });
const argon2 = require("argon2");
const { connectDB, disconnectDB } = require("../src/database/connection");
const User = require("../src/models/user.model");

async function main() {
  const email = String(process.env.BOOTSTRAP_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.BOOTSTRAP_ADMIN_PASSWORD || "");
  const name = String(process.env.BOOTSTRAP_ADMIN_NAME || "Administrator").trim();
  if (!email) throw new Error("Set BOOTSTRAP_ADMIN_EMAIL");
  await connectDB(process.env.MONGO_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    existing.status = "active";
    await existing.save();
    console.log(`${email} is now an administrator.`);
    return;
  }
  if (password.length < 12) throw new Error("Set BOOTSTRAP_ADMIN_PASSWORD (at least 12 characters) to create a new admin");
  await User.create({
    name, email, role: "admin",
    passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
    disclaimerVersion: "2026-09",
    disclaimerAcceptedAt: new Date(),
  });
  console.log(`Administrator ${email} created. Remove BOOTSTRAP_ADMIN_PASSWORD from .env now.`);
}

main()
  .catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(disconnectDB);
