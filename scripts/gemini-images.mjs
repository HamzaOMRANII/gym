// Generates exercise images in the Groundwork Gemini style (grayscale 3D anatomy, glowing red target muscles)
// and saves them as public/uploads/<slug>.jpg (1408x768).
//
//   GEMINI_API_KEY=... node scripts/gemini-images.mjs                 every exercise in TARGETS
//   node scripts/gemini-images.mjs --only plank,dead-bug               some of them
//   node scripts/gemini-images.mjs --prompts                           print the prompts (no key needed)
//
// GEMINI_IMAGE_MODEL overrides the model. Existing files are replaced, so review the results before committing.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const catalog = require(join(root, "src/seed/catalog.js"));
const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

// Movement as Gemini should draw it, and the muscles that glow. Exercises not listed keep their current image.
const TARGETS = {
  "incline-push-up": ["hands-elevated push-up with the hands on a bench", "pectoralis major"],
  "floor-fly-towel": ["wall push-up, leaning into a wall with the hands on it at chest height", "pectoralis major"],
  "table-row": ["inverted bodyweight row under a sturdy table edge", "latissimus dorsi and rhomboids"],
  "towel-row": ["standing towel row, leaning back and pulling on a towel looped around a door handle", "latissimus dorsi and rhomboids"],
  "prone-y": ["prone floor Y-raise, lying face down and lifting the arms in a Y shape", "lower trapezius and rhomboids"],
  "machine-shoulder-press": ["seated machine shoulder press", "anterior deltoid"],
  "pike-push-up": ["pike push-up with the hips high in an inverted V", "anterior deltoid"],
  "wall-slide": ["wall slide, back against a wall, sliding the arms up overhead", "lower trapezius and serratus anterior"],
  "chair-dip": ["chair dip, hands on the edge of a chair behind the body", "triceps brachii"],
  "towel-curl": ["isometric towel biceps curl, one foot standing on a towel and pulling up on both ends", "biceps brachii"],
  "diamond-push-up": ["diamond push-up with the hands together under the chest", "triceps brachii"],
  "leg-press": ["seated leg press machine", "quadriceps and gluteus maximus"],
  "leg-extension": ["seated leg extension machine", "quadriceps"],
  "leg-curl": ["seated leg curl machine", "hamstrings"],
  "hip-abductor": ["seated hip abductor machine, pushing the knees apart", "gluteus medius"],
  "calf-raise": ["standing calf raise machine", "gastrocnemius and soleus"],
  "bodyweight-squat": ["bodyweight air squat", "quadriceps and gluteus maximus"],
  "split-squat": ["bodyweight split squat in a lunge stance", "quadriceps and gluteus maximus"],
  "glute-bridge": ["glute bridge lying on the floor", "gluteus maximus"],
  "step-up": ["step-up onto a sturdy step", "quadriceps and gluteus maximus"],
  "calf-raise-step": ["standing calf raise on the edge of a step", "gastrocnemius and soleus"],
  plank: ["forearm plank", "rectus abdominis and transverse abdominis"],
  "dead-bug": ["dead bug, lying on the back with opposite arm and leg extended", "rectus abdominis and transverse abdominis"],
  "side-plank": ["forearm side plank", "obliques"],
  "cable-crunch": ["kneeling cable crunch with a rope attachment", "rectus abdominis"],
  "bird-dog": ["bird dog on hands and knees with the opposite arm and leg extended", "erector spinae and gluteus maximus"],
};

const LEVEL = { LOW: "Beginner", MEDIUM: "Intermediate", ADVANCED: "Advanced" };
const categoryName = Object.fromEntries(catalog.categories.map((c) => [c.slug, c.name]));

export function promptFor(exercise) {
  const [movement, muscles] = TARGETS[exercise.slug];
  const listed = exercise.muscles.split(" · ").join(", ");
  return `A high-resolution, full-body 3D anatomical render of a muscular human figure, presented in a scientific textbook diagram style. The figure is isolated on a perfectly clean, seamless white background. The body is rendered entirely in detailed grayscale to emphasize muscle striations. The figure is captured dynamically performing a ${movement}, demonstrating proper form. The key anatomical feature is that the primary target muscles, the ${muscles}, are brightly and precisely illuminated with a distinct, glowing red light, contrasting sharply with the monochrome body. The lighting is minimal and dramatic, designed to highlight muscle volume and depth. Include precise, unobtrusive white text labels with thin pointer lines identifying ONLY the glowing ${muscles} by name.

${categoryName[exercise.category]},"${listed}",${exercise.name},${exercise.kit === "bodyweight" ? "home" : "gym"},${LEVEL[exercise.level] || "Beginner"}`;
}

async function generate(prompt) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" } },
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
  const part = body.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`no image returned (${body.candidates?.[0]?.finishReason || "unknown reason"})`);
  return Buffer.from(part.inlineData.data, "base64");
}

const args = process.argv.slice(2);
const onlyIndex = args.indexOf("--only");
const only = onlyIndex > -1 ? new Set(args[onlyIndex + 1].split(",")) : null;
const exercises = catalog.exercises.filter((e) => TARGETS[e.slug] && (!only || only.has(e.slug)));

if (args.includes("--prompts")) {
  for (const e of exercises) console.log(`## ${e.name} (${e.slug}.jpg)\n\n${promptFor(e)}\n`);
} else {
  if (!process.env.GEMINI_API_KEY) throw new Error("Set GEMINI_API_KEY (Google AI Studio key)");
  let failed = 0;
  for (const e of exercises) {
    try {
      const image = await generate(promptFor(e));
      const out = join(root, "public/uploads", `${e.slug}.jpg`);
      writeFileSync(out, await sharp(image).flatten({ background: "#ffffff" }).resize(1408, 768, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer());
      console.log(`ok   ${e.slug}`);
    } catch (error) {
      failed++;
      console.log(`FAIL ${e.slug}: ${error.message}`);
    }
  }
  if (failed) process.exitCode = 1;
}
