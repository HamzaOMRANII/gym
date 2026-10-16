import "../styles.css";
import "../lib/muscle-map.js";
import { loadCatalog, loadMe } from "../lib/api.js";
import { $, esc, onAction, store } from "../lib/dom.js";
import { header, brand, categoryArt, exerciseArt, dose, showFatal, DISCLAIMER, appDownloadSlot, mountAppDownload } from "../lib/site.js";

const SLIDES = [
  { kicker: "Start from zero", title: "No expertise required", body: "No coach, no bought program, no gym history. Five movements you can do correctly and a week that repeats — that is the whole entry fee." },
  { kicker: "No advanced tools", title: "A floor is enough to start", body: "Every body part has a machine version and a version that needs nothing: floor, wall, chair, stairs. Train at home first, then walk into a gym already knowing the pattern." },
  { kicker: "Stay consistent", title: "Discipline is a schedule", body: "Two, three or five sessions a week on real days with rest built in. Follow the week, log the sets, and progress becomes something you read rather than feel." },
];

const SESSIONS = [
  { id: "push", label: "Push day", title: "Chest, shoulders & triceps", ids: ["machine-chest-press", "incline-db-press", "lateral-raise", "pec-deck", "triceps-pushdown", "overhead-triceps"] },
  { id: "pull", label: "Pull day", title: "Back & biceps", ids: ["lat-pulldown", "chest-supported-row", "seated-cable-row", "reverse-pec-deck", "db-curl", "hammer-curl"] },
  { id: "legs", label: "Leg day", title: "Legs & core", ids: ["leg-press", "leg-extension", "leg-curl", "hip-abductor", "calf-raise", "plank"] },
];

const TIERS = ["€3", "€10", "€25"];

const FAQ = [
  { q: "Is this suitable for complete beginners?", a: "Yes — it is built for them. Every exercise is graded low or medium, machines and stable movements come first, and nothing technically demanding (barbell squats, deadlifts, olympic lifts) appears in the program." },
  { q: "Do I need a gym?", a: "No. Each body part lists exercises that need nothing but a floor, a wall, a chair or a set of stairs. Start at home and move to a gym when you want to add load." },
  { q: "How long does a session take?", a: "Between 45 and 70 minutes depending on the day and how long you rest. The shorter two-day plan runs 35 to 45 minutes." },
  { q: "What does it cost?", a: "Nothing. No paywall, no advertising, and the training app works without an account. Donations cover hosting and keeping the library accurate." },
  { q: "How is progress tracked?", a: "The training app logs the weight and reps of every set, plus body weight, chest and arm measurements, and charts them over time. Without an account everything stays on your device; with a free account it follows you to every device." },
];

const BODY_KEY = "groundwork.body.v1";
const root = $("#root");
const saved = store.get(BODY_KEY, {}) || {};
const state = { slide: 0, session: "push", faq: 0, tier: null, height: saved.height || "", weight: saved.weight || "", savedAt: saved.date || "" };
let catalog = null;
let timer = null;

function bmi() {
  const height = parseFloat(state.height);
  const weight = parseFloat(state.weight);
  if (!height || !weight || height < 80 || height > 250) return null;
  return weight / (height / 100) ** 2;
}

function heroHtml() {
  const slide = SLIDES[state.slide];
  return `<div class="hero-body">
    <div class="hero-kicker">${esc(slide.kicker)}</div>
    <h1>${esc(slide.title)}</h1>
    <p>${esc(slide.body)}</p>
    <div class="row" style="--gap:12px;margin-top:4px">
      <a class="btn btn-primary" href="/plans">Start free plan</a>
      <a class="btn btn-glass" href="#library">Browse exercises</a>
    </div>
    <div class="slide-dots">${SLIDES.map((_, index) => `<button type="button" class="slide-dot${index === state.slide ? " is-on" : ""}" data-action="slide" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>`).join("")}</div>
  </div>`;
}

function sessionHtml() {
  const session = SESSIONS.find((entry) => entry.id === state.session);
  return `<div class="section-head">
      <div><div class="eyebrow">Sample session</div><h2 class="h2">${esc(session.title)}</h2></div>
      <div class="pills rail">${SESSIONS.map((entry) => `<button type="button" class="pill${entry.id === state.session ? " is-on" : ""}" data-action="session" data-id="${entry.id}">${esc(entry.label)}</button>`).join("")}</div>
    </div>
    <div class="grid" style="--min:230px">${session.ids.map((slug, index) => {
      const exercise = catalog.bySlug[slug];
      if (!exercise) return "";
      return `<div class="card ex-card" style="overflow:hidden;display:flex;flex-direction:column">
        ${exerciseArt(exercise, { num: index + 1 })}
        <div class="ex-card-body">
          <div class="ex-card-name">${esc(exercise.name)}</div>
          <div class="ex-card-meta">${esc(exercise.equipment)}</div>
          <div class="dose" style="margin-top:auto"><strong>${esc(dose(exercise.sets, exercise.reps))}</strong><span class="dot-sep"></span><span>${esc(exercise.rest)} rest</span></div>
        </div>
      </div>`;
    }).join("")}</div>
    <div class="row" style="--gap:12px;margin-top:16px">
      <a class="btn btn-primary" href="/app">Run this session →</a>
      <a class="btn btn-secondary" href="/plans">See the full week</a>
    </div>`;
}

function bmiHtml() {
  const value = bmi();
  const band = value == null ? "Awaiting your numbers" : value < 18.5 ? "Below the usual range" : value < 25 ? "Within the usual range" : value < 30 ? "Above the usual range" : "Well above the usual range";
  const advice = value == null
    ? "Enter your height and weight and we suggest a starting emphasis — how many sessions a week, which body parts first, and whether to lead with machines or bodyweight work."
    : value < 18.5 ? "Lead with three full-body sessions a week and eat enough to support them. Machine pressing and rowing first, longer rests, no rush to add load."
    : value < 25 ? "Three sessions a week on a push / pull / legs split fits you well. Prioritise chest, back and arms, and add a fourth day once eight weeks are behind you."
    : value < 30 ? "Two or three sessions plus daily walking is the honest starting point. Machines and bodyweight work spare the joints while the habit forms."
    : "Start with two short machine-based sessions a week and walking on the other days. Add a third only when the first two feel routine, and speak to a professional first.";
  return `<div style="font-size:14px;font-weight:700;opacity:0.85">What we read from it</div>
    <div class="row" style="align-items:baseline"><span class="bmi-value">${value == null ? "—" : value.toFixed(1)}</span><span style="font-size:15px;font-weight:700;opacity:0.85">BMI</span></div>
    <div class="bmi-band">${band}</div>
    <p style="font-size:15px;line-height:1.55;margin-top:6px">${advice}</p>
    <a class="btn btn-dark" href="/app" style="margin-top:auto;align-self:flex-start;padding:13px 20px;border-radius:12px">Open the training app →</a>`;
}

const savedNote = () => state.savedAt ? `Saved on ${esc(state.savedAt)}. This device only — no account, no server.` : "Stored on this device only. No account, no server.";

function donateHtml() {
  return `<div class="row">${TIERS.map((amount, index) => `<button type="button" class="tier${state.tier === index ? " is-on" : ""}" data-action="tier" data-index="${index}">${state.tier === index ? "Thank you ✓" : `Donate ${amount}`}</button>`).join("")}</div>
    <div class="hint" style="margin-top:12px;max-width:42ch">${state.tier == null
      ? "Payment processing is not connected yet — pick a tier to mark your intent."
      : `Noted. Once payments are connected this takes the ${TIERS[state.tier]} donation.`}</div>`;
}

function faqHtml() {
  return FAQ.map((item, index) => {
    const open = state.faq === index;
    return `<div class="faq-item${open ? " is-open" : ""}">
      <button type="button" class="faq-q" data-action="faq" data-index="${index}" aria-expanded="${open}"><span>${esc(item.q)}</span><span class="faq-sign" aria-hidden="true">${open ? "−" : "+"}</span></button>
      ${open ? `<p class="faq-a">${esc(item.a)}</p>` : ""}
    </div>`;
  }).join("");
}

function render(user) {
  const { categories, exercises, templates } = catalog;
  const noKit = exercises.filter((exercise) => exercise.kit === "bodyweight").length;
  root.innerHTML = `
  ${header({ user, links: [["Exercises", "#library"], ["Sessions", "#today"], ["Progress", "#progress"], ["FAQ", "#faq"]], cta: ["Get your plan", "/plans"] })}
  <main>
    <div id="top" class="wrap" style="padding-top:28px">
      <div class="hero">
        <span class="hero-art"><muscle-map group="fullbody"></muscle-map></span>
        <div class="hero-shade"></div>
        <div id="hero" style="position:relative">${heroHtml()}</div>
      </div>
    </div>

    <div class="wrap" style="padding-top:16px">
      <div class="grid" style="--min:160px;--gap:12px">
        ${[[exercises.length, "Exercises documented"], [noKit, "Need no equipment", "var(--gold)"], [templates.length, "Weekly plans to pick from"], ["€0", "Cost, no paywall"]]
          .map(([value, label, tone]) => `<div class="stat"><div class="stat-value"${tone ? ` style="color:${tone}"` : ""}>${esc(value)}</div><div class="stat-label">${esc(label)}</div></div>`).join("")}
      </div>
    </div>

    <div class="wrap" style="padding-top:16px">${appDownloadSlot()}</div>

    <section id="library" class="wrap section">
      <div class="section-head">
        <div><div class="eyebrow">Exercise library</div><h2 class="h2">Train by body part</h2></div>
        <a class="btn btn-secondary" href="/category?cat=${esc(categories[0]?.slug || "")}" style="padding:12px 18px;border-radius:12px;font-size:14px">See all →</a>
      </div>
      <div class="grid" style="--min:210px">${categories.map((category) => {
        const list = exercises.filter((exercise) => exercise.category === category.slug);
        return `<a class="card lift cat-card" href="/category?cat=${esc(category.slug)}">
          ${categoryArt(category)}
          <span class="cat-card-body">
            <span class="row" style="justify-content:space-between"><span class="cat-card-name">${esc(category.name)}</span><span class="cat-card-count">${list.length} exercises</span></span>
            <span class="cat-card-blurb">${esc(category.blurb)}</span>
            <span class="row" style="--gap:6px;margin-top:4px"><span class="badge badge-blue">${list.filter((e) => e.kit === "tools").length} with kit</span><span class="badge badge-neutral">${list.filter((e) => e.kit === "bodyweight").length} no kit</span></span>
          </span>
        </a>`;
      }).join("")}</div>
    </section>

    <section id="today" class="wrap section">${sessionHtml()}</section>

    <section id="progress" class="wrap section">
      <div class="eyebrow">Progress</div>
      <h2 class="h2" style="margin-bottom:22px">Numbers, not feelings</h2>
      <div class="grid" style="--min:300px">
        <div class="card body-card">
          <div style="font-size:14px;font-weight:700;color:var(--dim)">Your measurements</div>
          <div class="grid" style="--min:130px;--gap:12px">
            <label class="field"><span class="label">Height (cm)</span><input class="input input-big" id="height" inputmode="decimal" placeholder="175" value="${esc(state.height)}"></label>
            <label class="field"><span class="label">Weight (kg)</span><input class="input input-big" id="weight" inputmode="decimal" placeholder="72" value="${esc(state.weight)}"></label>
          </div>
          <button type="button" class="btn btn-primary btn-lg" data-action="saveBody" style="box-shadow:none">Save today's entry</button>
          <div class="hint" id="savedNote">${savedNote()}</div>
        </div>
        <div class="bmi-card" id="bmi">${bmiHtml()}</div>
      </div>
      <p class="hint" style="margin-top:12px;max-width:76ch">BMI is a rough population measure, not a diagnosis, and it reads high for muscular builds. We use it only to pick a starting emphasis. Everything you enter here stays on this device.</p>
    </section>

    <section class="wrap section">
      <div class="split-card">
        <div class="split-card-body">
          <span class="kicker">Build your own</span>
          <h2 style="font-size:clamp(28px,4vw,46px);line-height:1.05;letter-spacing:-0.035em">Your plan, placed on real days</h2>
          <p class="muted" style="font-size:16px;line-height:1.55;max-width:44ch">Pick a recommended week — exercises and rest already scheduled, ordered by difficulty — then swap any movement for one that matches your equipment.</p>
          <div class="row" style="margin-top:6px">
            <a class="btn btn-primary" href="/plans" style="box-shadow:none">Build my plan</a>
            <a class="btn btn-glass" href="/app">See the 5-day program</a>
          </div>
        </div>
        <div class="split-card-art"><img src="/media/plan.jpg" alt="Cable chest fly: the chest muscles it trains, highlighted" loading="lazy"></div>
      </div>
    </section>

    <section id="faq" class="wrap section">
      <div class="grid" style="--min:290px;--gap:32px;align-items:start">
        <div>
          <div class="eyebrow">FAQ &amp; support</div>
          <h2 class="h2" style="margin-bottom:14px">Free, and staying free</h2>
          <p class="muted" style="font-size:15.5px;line-height:1.6;max-width:42ch;margin-bottom:20px">No paywall, no ads. Donations cover hosting and keeping the exercise library accurate.</p>
          <div id="donate">${donateHtml()}</div>
        </div>
        <div class="stack" style="--gap:10px" id="faqList">${faqHtml()}</div>
      </div>
    </section>
  </main>

  <footer class="site-footer"><div class="footer-grid">
    <div>
      <div style="margin-bottom:10px">${brand("#top")}</div>
      <div class="hint" style="font-size:13.5px;line-height:1.6;max-width:32ch">Beginner strength training, scheduling and progress tracking. Built for people starting from zero.</div>
    </div>
    <div class="footer-links">
      <a href="#library">Exercise library</a><a href="/plans">Weekly plans</a><a href="/app">Training app</a><a href="#faq">Support us</a>
    </div>
    <div><div class="disclaimer-title">Disclaimer</div><p class="disclaimer-text">${DISCLAIMER}</p></div>
  </div></footer>`;

  for (const field of ["height", "weight"]) {
    $(`#${field}`).addEventListener("input", (event) => { state[field] = event.target.value; $("#bmi").innerHTML = bmiHtml(); });
  }
  mountAppDownload();
}

const rerenderHero = () => { $("#hero").innerHTML = heroHtml(); };
function startSlides() {
  clearInterval(timer);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = setInterval(() => { state.slide = (state.slide + 1) % SLIDES.length; rerenderHero(); }, 7000);
}

onAction(root, {
  slide: ({ index }) => { state.slide = Number(index); rerenderHero(); startSlides(); },
  session: ({ id }) => { state.session = id; $("#today").innerHTML = sessionHtml(); },
  faq: ({ index }) => { state.faq = state.faq === Number(index) ? -1 : Number(index); $("#faqList").innerHTML = faqHtml(); },
  tier: ({ index }) => { state.tier = Number(index); $("#donate").innerHTML = donateHtml(); },
  saveBody: () => {
    state.savedAt = new Date().toISOString().slice(0, 10);
    store.set(BODY_KEY, { height: state.height, weight: state.weight, date: state.savedAt });
    $("#savedNote").innerHTML = savedNote();
  },
});

Promise.all([loadCatalog(), loadMe()])
  .then(([data, user]) => {
    catalog = data;
    render(user);
    startSlides();
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  })
  .catch(() => showFatal(root, "The exercise library could not be loaded. Refresh the page to try again."));
