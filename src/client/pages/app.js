import "../styles.css";
import "../lib/muscle-map.js";
import { api, loadCatalog, loadMe } from "../lib/api.js";
import { $, esc, onAction, store, toast, todayISO } from "../lib/dom.js";
import { brand, levelTag, showFatal, WEEKDAYS, DISCLAIMER } from "../lib/site.js";

const LOCAL_KEY = "fitprog.v1"; // signed-out history + measurements (same key as the design prototype)
const PLAN_KEY = "groundwork.plan"; // signed-out plan choice
const WORKOUT_KEY = "groundwork.workout"; // the workout in progress survives a reload
const PENDING_KEY = "groundwork.pending"; // finished workouts not yet uploaded (signed in, offline)
const DEFAULT_PLAN = "upper-5";
const LEVEL_NOTE = { LOW: "Beginner-friendly", MEDIUM: "Some technique needed", ADVANCED: "Experienced lifters" };
const MUSCLE_ORDER = ["Chest", "Back", "Biceps", "Triceps", "Shoulders", "Legs", "Calves", "Core"];
const TYPE_ORDER = ["Push", "Pull", "Legs", "Core"];

const root = $("#root");
const todayIdx = (new Date().getDay() + 6) % 7;
const state = {
  view: "home", dayIdx: todayIdx, exId: null, from: "home",
  search: "", filters: { muscle: [], level: [], equip: [], type: [] },
  mode: store.get(WORKOUT_KEY, null), resting: false, restLeft: 0, curWeight: "", curReps: "",
  draft: { weight: "", chest: "", arm: "" },
  history: [], measurements: [],
};
let catalog = null;
let user = null;
let plan = null; // the program being followed (member copy or template)
let ownPlan = false; // true when the plan belongs to the signed-in member (swappable)
let week = [];
let restTimer = null;

// ---------- Data ----------

const ex = (slug) => catalog.bySlug[slug];
const units = () => (user?.profile?.units === "imperial" ? { w: "lb", l: "in" } : { w: "kg", l: "cm" });

function buildWeek() {
  week = WEEKDAYS.map((name, weekday) => {
    const day = plan?.days.find((entry) => entry.weekday === weekday);
    const items = (day?.items || []).filter((item) => ex(item.exercise));
    if (!day || day.isRest || !items.length) {
      return { weekday, name, focus: day?.focus || "Rest", items: [], notes: day?.notes?.length ? day.notes : plan?.restNote?.items || [] };
    }
    return { weekday, name, focus: day.focus, items, notes: [] };
  });
}

function saveLocal() {
  if (!user) store.set(LOCAL_KEY, { history: state.history, measurements: state.measurements });
}

const pending = () => store.get(PENDING_KEY, []) || [];

// Uploads finished workouts; each carries a clientRef, so a retry never creates a duplicate.
async function flushPending() {
  if (!user) return;
  let queue = pending();
  for (const entry of [...queue]) {
    try {
      const { session } = await api.post("/api/training/sessions", entry);
      queue = queue.filter((item) => item.clientRef !== entry.clientRef);
      store.set(PENDING_KEY, queue);
      state.history = [session, ...state.history.filter((item) => item.clientRef !== entry.clientRef)];
    } catch (error) {
      if (error.status && error.status < 500 && error.status !== 401) {
        queue = queue.filter((item) => item.clientRef !== entry.clientRef); // rejected for good: drop it
        store.set(PENDING_KEY, queue);
      }
      break;
    }
  }
  if (state.view === "progress") renderView();
}

async function loadTraining() {
  if (user) {
    const data = await api.get("/api/training");
    ownPlan = Boolean(data.plan);
    plan = data.plan || catalog.templates.find((entry) => entry.slug === DEFAULT_PLAN) || catalog.templates[0] || null;
    const queued = pending();
    state.history = [...queued.map((entry) => ({ ...entry, pending: true })), ...data.sessions];
    state.measurements = data.measurements;
  } else {
    const local = store.get(LOCAL_KEY, {}) || {};
    const choice = store.get(PLAN_KEY, DEFAULT_PLAN);
    plan = catalog.templates.find((entry) => entry.slug === choice) || catalog.templates.find((entry) => entry.slug === DEFAULT_PLAN) || catalog.templates[0] || null;
    ownPlan = false;
    state.history = local.history || [];
    state.measurements = local.measurements || [];
  }
  buildWeek();
  // A saved workout from a plan that has since changed cannot be resumed safely.
  if (state.mode && !week[state.mode.dayIdx]?.items[state.mode.idx]) setMode(null);
}

// ---------- Derived values ----------

function duration(day) {
  if (!day.items.length) return "—";
  const minutes = Math.round((300 + day.items.reduce((sum, item) => sum + item.sets * (90 + item.restSec), 0)) / 60);
  return `~${minutes - 5}-${minutes + 5} min`;
}
function muscles(day) {
  const seen = [];
  day.items.forEach((item) => { const muscle = ex(item.exercise).primaryMuscle; if (muscle && !seen.includes(muscle)) seen.push(muscle); });
  return seen.join(" · ") || "Recovery";
}
function dayLevel(day) {
  if (!day.items.length) return "—";
  const levels = new Set(day.items.map((item) => ex(item.exercise).level));
  return levels.has("ADVANCED") ? "Up to advanced" : levels.has("MEDIUM") ? "Low / Medium" : "Low";
}
const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const setDetail = (set, unit) => `${set.weight ? `${set.weight} ${unit} × ` : ""}${set.reps}`;
const img = (exercise, eager = false) => exercise?.image ? `<img src="${esc(exercise.image)}" alt="${esc(exercise.imageAlt || "")}"${eager ? "" : ' loading="lazy"'}>` : "";

function setMode(mode) {
  state.mode = mode;
  if (mode) store.set(WORKOUT_KEY, mode); else store.remove(WORKOUT_KEY);
}

// ---------- Views ----------

function homeView() {
  const today = week[todayIdx];
  const mode = state.mode;
  const totalSets = today.items.reduce((sum, item) => sum + item.sets, 0);
  const doneSets = mode && mode.dayIdx === todayIdx ? today.items.reduce((sum, item, index) => sum + (mode.done[index] || []).length, 0) : 0;
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;
  const resuming = mode && mode.dayIdx === todayIdx;
  return `<div style="padding-top:28px">
    <div class="micro-blue" style="margin-bottom:6px">Today — ${esc(new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" }))}</div>
    <h1 class="app-h1" style="margin-bottom:4px">${esc(today.name)}</h1>
    <div class="app-focus" style="margin-bottom:20px">${esc(today.focus)}</div>
    <div class="grid" style="--min:150px;--gap:12px">${[
      ["Exercises", today.items.length ? `${today.items.length} exercises` : "Rest day"],
      ["Duration", duration(today)], ["Muscle groups", muscles(today)], ["Difficulty", dayLevel(today)],
    ].map(([label, value]) => `<div class="stat" style="padding:16px 18px"><div class="stat-label" style="margin:0 0 8px;font-size:12.5px">${label}</div><div class="stat-value" style="font-size:26px">${esc(value)}</div></div>`).join("")}</div>
    ${today.items.length ? `<div style="padding-top:22px">
      <div class="row micro" style="justify-content:space-between;gap:4px;margin-bottom:8px"><span>Progress through today</span><span>${doneSets} / ${totalSets} sets · ${pct}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="row" style="margin-top:18px">
        <button type="button" class="btn btn-primary btn-lg" data-action="${resuming ? "resume" : "start"}" data-day="${todayIdx}">${resuming ? "Resume workout" : "Start workout"}</button>
        <button type="button" class="btn btn-secondary btn-lg" data-action="openDay" data-day="${todayIdx}">View exercises</button>
      </div>
    </div>` : `<div class="rest-panel" style="margin-top:22px">
      <div class="rest-panel-title">Rest &amp; recovery</div>
      <div style="font-size:11px;margin:14px 0 10px">Optional</div>
      <div class="grid" style="--min:140px;--gap:10px;font-size:15px;font-weight:600">${(today.notes.length ? today.notes : ["Walking", "Light stretching", "Hydration", "Sleep"]).map((note) => `<div>${esc(note)}</div>`).join("")}</div>
    </div>`}
    ${mode && mode.dayIdx !== todayIdx ? `<div class="boxed" style="margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center"><span style="flex:1">A ${esc(week[mode.dayIdx].name)} workout is still open.</span><button type="button" class="btn btn-secondary" data-action="resume">Resume it</button></div>` : ""}
    <div style="margin-top:34px;border-top:1px solid var(--line);padding-top:18px">
      <div class="row" style="justify-content:space-between;margin-bottom:14px"><h2 style="font-size:13px">Weekly schedule · ${esc(plan.name)}</h2><a href="/plans" style="font-size:13px;color:var(--blue)">Change plan</a></div>
      <div class="grid" style="--min:240px;--gap:12px">${week.map((day, index) => `<button type="button" class="week-day${index === todayIdx ? " is-today" : ""}${day.items.length ? " is-work" : ""}" data-action="openDay" data-day="${index}">
        <span style="font-weight:800;letter-spacing:-0.02em;font-size:17px">${esc(day.name)}</span>
        <span style="font-size:14px;font-weight:600;color:var(--blue)">${esc(day.focus)}</span>
        <span class="micro">${day.items.length ? `${day.items.length} exercises · ${duration(day)}` : "Recovery"}</span>
      </button>`).join("")}</div>
    </div>
  </div>`;
}

function dayView() {
  const day = week[state.dayIdx];
  return `<div style="padding-top:24px">
    <button type="button" class="btn btn-ghost" data-action="go" data-view="home" style="font-size:12px;margin-bottom:14px">← Schedule</button>
    <h1 class="app-h1" style="font-size:clamp(34px,7vw,60px);margin-bottom:2px">${esc(day.name)}</h1>
    <div class="app-focus" style="font-size:clamp(18px,3.6vw,28px)">${esc(day.focus)}</div>
    <div class="row" style="gap:8px 26px;margin:16px 0 20px;padding:12px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-size:13px">
      <span class="nowrap">${day.items.length ? `${day.items.length} exercises` : "No resistance training"}</span>
      <span class="nowrap">${duration(day)}</span>
      <span class="nowrap faint">${esc(muscles(day))}</span>
    </div>
    ${day.items.length ? "" : `<div class="rest-panel"><div class="rest-panel-title">Rest &amp; recovery</div><p style="margin-top:14px;font-size:16px;max-width:46ch">No resistance training today. Optional: ${esc((day.notes.length ? day.notes : ["walking", "light stretching", "hydration", "sleep"]).join(", ").toLowerCase())}.</p></div>`}
    <div class="grid" style="--min:300px">${day.items.map((item, index) => {
      const exercise = ex(item.exercise);
      return `<article class="item-card">
        <button type="button" data-action="open" data-slug="${esc(exercise.slug)}" data-from="day" style="all:unset;cursor:pointer;display:flex;flex-direction:column">
          ${exercise.image ? `<span class="art has-img">${img(exercise)}</span>` : ""}
          <span class="item-head"><span class="item-num">${index + 1}</span><span class="item-title"><strong>${esc(exercise.name)}</strong><span class="micro">${esc(exercise.primaryMuscle)}</span></span></span>
          <span class="item-metrics">
            <span><span class="metric-label">Sets × reps</span><span class="metric-value">${item.sets} × ${esc(item.reps)}</span></span>
            <span><span class="metric-label">Rest</span><span class="metric-value">${esc(item.rest)}</span></span>
            <span><span class="metric-label">Level</span><span style="display:block;margin-top:2px">${levelTag(exercise.level)}</span></span>
          </span>
        </button>
        <div class="item-foot"><span style="flex:1">${esc(exercise.equipment)}</span>${ownPlan ? `<button type="button" class="btn btn-secondary btn-sm" data-action="swap" data-index="${index}">Swap</button>` : ""}</div>
      </article>`;
    }).join("")}</div>
    ${day.items.length ? `<div style="margin-top:20px">
      <button type="button" class="btn btn-primary btn-block" data-action="start" data-day="${state.dayIdx}" style="min-height:62px;font-size:18px">${state.mode?.dayIdx === state.dayIdx ? "Resume workout" : "Start workout"}</button>
      ${ownPlan ? "" : `<p class="hint" style="margin-top:10px">${user ? `Want to swap exercises? <a href="/plans" style="color:var(--blue)">Choose this week in Plans</a> to make it your own.` : `<a href="/account" style="color:var(--blue)">Sign in</a> and choose a plan to swap exercises and keep your log on every device.`}</p>`}
    </div>` : ""}
  </div>`;
}

function exerciseView() {
  const exercise = ex(state.exId);
  if (!exercise) return `<div class="empty" style="margin-top:24px">This exercise is no longer in the library.</div>`;
  const number = String(catalog.exercises.indexOf(exercise) + 1).padStart(2, "0");
  const list = (items, cls) => items.map((text) => `<div class="bar-note ${cls}">${esc(text)}</div>`).join("");
  const alternatives = exercise.alternatives.map(ex).filter(Boolean);
  return `<div style="padding-top:24px">
    <button type="button" class="btn btn-ghost" data-action="back" style="font-size:12px;margin-bottom:14px">← Back</button>
    ${exercise.image ? `<div class="ex-hero-img">${img(exercise, true)}</div>` : ""}
    <div class="ex-head">
      <div class="ex-badge">
        <div style="font-size:11px">${esc(exercise.trainingType)}</div>
        <div class="ex-badge-num">${number}</div>
        <div style="font-weight:800;letter-spacing:-0.02em;font-size:clamp(22px,5vw,36px);line-height:1">${esc(exercise.primaryMuscle)}</div>
      </div>
      <div style="padding:22px;display:flex;flex-direction:column;gap:12px">
        <h1 style="font-size:clamp(26px,5vw,42px)">${esc(exercise.name)}</h1>
        <div class="row">${levelTag(exercise.level)}<span style="font-size:13px;color:var(--faint)">${LEVEL_NOTE[exercise.level]}</span></div>
        <div class="grid" style="--min:90px;--gap:12px;border-top:1px solid var(--line);padding-top:12px">
          ${[["Sets", exercise.sets], ["Reps", exercise.reps], ["Rest", exercise.rest]].map(([label, value]) => `<div><span class="metric-label">${label}</span><span class="metric-value" style="font-size:30px">${esc(value)}</span></div>`).join("")}
        </div>
      </div>
    </div>
    <div class="ex-facts">
      <div><span class="metric-label" style="margin-bottom:8px">Equipment</span><div style="font-size:15px;font-weight:600">${esc(exercise.equipment)}</div></div>
      <div><span class="metric-label" style="margin-bottom:8px">Main muscle</span><div style="font-weight:800;font-size:18px">${esc(exercise.primaryMuscle)}</div></div>
      <div><span class="metric-label" style="margin-bottom:8px">Secondary muscles</span>${exercise.secondaryMuscles.map((muscle) => `<div style="font-size:15px;font-weight:600">${esc(muscle)}</div>`).join("") || '<div class="faint">—</div>'}</div>
    </div>
    <div class="grid" style="--min:300px;--gap:26px;margin-top:26px">
      <div>
        ${exercise.instructions.length ? `<h2 class="rule-head">How to perform</h2>${exercise.instructions.map((text, index) => `<div class="step"><b>${index + 1}</b><span>${esc(text)}</span></div>`).join("")}` : ""}
        ${exercise.setup ? `<h2 class="rule-head" style="margin-top:24px">Setup</h2><p style="font-size:15px;line-height:1.55">${esc(exercise.setup)}</p>` : ""}
        ${!exercise.instructions.length && !exercise.setup ? `<h2 class="rule-head">How to perform</h2><p class="muted" style="font-size:15px;line-height:1.55">Follow the form cues. Step-by-step instructions for this exercise are being written.</p>` : ""}
      </div>
      <div>
        <h2 class="rule-head">Form cues</h2>${list(exercise.cues, "")}
        ${exercise.mistakes.length ? `<h2 class="rule-head" style="margin-top:24px">Common mistakes</h2>${list(exercise.mistakes, "muted-bar")}` : ""}
        ${alternatives.length ? `<h2 class="rule-head" style="margin-top:24px">Alternatives</h2><div class="row" style="--gap:8px">${alternatives.map((alt) => `<button type="button" class="chip" data-action="open" data-slug="${esc(alt.slug)}" data-from="${esc(state.from)}">${esc(alt.name)}</button>`).join("")}</div>` : ""}
        <div class="boxed" style="margin-top:24px"><span class="metric-label" style="margin-bottom:6px">Video</span><div style="font-size:14px;color:var(--dim)">${exercise.videoUrl
          ? `<a href="${esc(exercise.videoUrl)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue)">Watch the demonstration ↗</a>`
          : "No demonstration video is linked for this exercise yet."}</div></div>
        <div class="boxed boxed-blue" style="margin-top:12px"><span class="metric-label" style="margin-bottom:6px;color:var(--blue)">Safety</span><div style="font-size:14px">${esc(exercise.safetyNotes || "No exercise is risk-free. Stop if you feel sharp or unusual pain, and reduce the load before reducing control.")}</div></div>
      </div>
    </div>
  </div>`;
}

function filterGroups() {
  const present = (key) => [...new Set(catalog.exercises.flatMap((exercise) => [].concat(exercise[key])))].filter(Boolean);
  const ordered = (values, order) => [...order.filter((value) => values.includes(value)), ...values.filter((value) => !order.includes(value)).sort()];
  return [
    { key: "muscle", label: "Muscle", opts: ordered(present("primaryMuscle"), MUSCLE_ORDER) },
    { key: "level", label: "Difficulty", opts: ordered(present("level"), ["LOW", "MEDIUM", "ADVANCED"]) },
    { key: "equip", label: "Equipment", opts: present("equipTags").sort() },
    { key: "type", label: "Training type", opts: ordered(present("trainingType"), TYPE_ORDER) },
  ];
}

function libraryResults() {
  const { filters } = state;
  const query = state.search.trim().toLowerCase();
  const results = catalog.exercises.filter((exercise) => {
    if (filters.muscle.length && !filters.muscle.includes(exercise.primaryMuscle)) return false;
    if (filters.level.length && !filters.level.includes(exercise.level)) return false;
    if (filters.type.length && !filters.type.includes(exercise.trainingType)) return false;
    if (filters.equip.length && !filters.equip.some((tag) => exercise.equipTags.includes(tag))) return false;
    if (query && !`${exercise.name} ${exercise.primaryMuscle} ${exercise.muscles} ${exercise.equipment}`.toLowerCase().includes(query)) return false;
    return true;
  });
  return `<div class="row" style="border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:12px 0;margin-bottom:16px">
      <div style="font-size:13px">${results.length} of ${catalog.exercises.length} exercises</div>
      <button type="button" class="btn btn-ghost" data-action="clearFilters" style="font-size:12px;padding:6px 0">Clear all</button>
    </div>
    ${results.length ? `<div class="grid" style="--min:280px">${results.map((exercise) => `<button type="button" class="result-card" data-action="open" data-slug="${esc(exercise.slug)}" data-from="library">
      ${exercise.image ? `<span class="art has-img">${img(exercise)}</span>` : ""}
      <span class="micro-blue">${esc(exercise.primaryMuscle)}</span>
      <span style="font-weight:800;letter-spacing:-0.02em;font-size:20px;line-height:1.1">${esc(exercise.name)}</span>
      <span>${levelTag(exercise.level)}</span>
      <span style="font-size:13px;color:var(--dim)">${esc(exercise.equipment)}</span>
      <span style="font-weight:800;font-size:16px">${exercise.sets} × ${esc(exercise.reps)}</span>
    </button>`).join("")}</div>` : `<div class="boxed" style="font-size:15px">No exercises match these filters. Try clearing one.</div>`}`;
}

function libraryView() {
  return `<div style="padding-top:24px">
    <h1 style="font-size:clamp(30px,6vw,52px);margin-bottom:16px">Exercise library</h1>
    <label class="sr-only" for="search">Search exercises</label>
    <input class="input" id="search" type="search" value="${esc(state.search)}" placeholder="Search exercises" style="font-size:16px;margin-bottom:6px">
    ${filterGroups().map((group) => `<div style="border-top:1px solid var(--line);padding:12px 0">
      <div class="micro" style="margin-bottom:8px">${group.label}</div>
      <div class="row" style="--gap:8px">${group.opts.map((option) => `<button type="button" class="chip${state.filters[group.key].includes(option) ? " is-on" : ""}" data-action="filter" data-key="${group.key}" data-value="${esc(option)}" aria-pressed="${state.filters[group.key].includes(option)}">${esc(option)}</button>`).join("")}</div>
    </div>`).join("")}
    <div id="results">${libraryResults()}</div>
  </div>`;
}

function chart(field, label, unit) {
  const rows = state.measurements.filter((entry) => entry[field] != null && entry[field] !== "");
  const values = rows.map((entry) => Number(entry[field]));
  if (!values.length) return { label, latest: "—", points: "", dots: [], first: "No entries yet", range: "" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const dots = values.map((value, index) => ({
    x: values.length === 1 ? 160 : Math.round(10 + (300 * index) / (values.length - 1)),
    y: Math.round(104 - ((value - min) / span) * 88) + 8,
  }));
  return { label, latest: `${values.at(-1)} ${unit}`, points: dots.map((dot) => `${dot.x},${dot.y}`).join(" "), dots, first: rows[0].date, range: `${min}-${max} ${unit}` };
}

function progressView() {
  const unit = units();
  const latest = (field, suffix) => { const rows = state.measurements.filter((entry) => entry[field]); return rows.length ? `${rows.at(-1)[field]} ${suffix}` : "—"; };
  const setCount = state.history.reduce((sum, entry) => sum + entry.lines.reduce((acc, line) => acc + line.sets.length, 0), 0);
  const queued = state.history.filter((entry) => entry.pending).length;
  return `<div style="padding-top:24px">
    <h1 style="font-size:clamp(30px,6vw,52px);margin-bottom:6px">Progress</h1>
    <p class="sync-note" style="margin-bottom:16px">${user ? `Synced to your account (${esc(user.email)}).${queued ? ` ${queued} workout${queued === 1 ? "" : "s"} waiting for a connection.` : ""}` : `Stored on this device only. <a href="/account" style="color:var(--blue)">Create a free account</a> to keep it on every device.`}</p>
    <div class="grid" style="--min:150px;--gap:12px;margin-bottom:26px">${[
      ["Sessions logged", state.history.length], ["Sets logged", setCount], ["Body weight", latest("weight", unit.w)], ["Arm", latest("arm", unit.l)],
    ].map(([label, value]) => `<div class="stat" style="padding:16px 18px"><div class="stat-label" style="margin:0 0 8px;font-size:12.5px">${label}</div><div class="stat-value" style="font-size:26px">${esc(value)}</div></div>`).join("")}</div>

    <h2 class="rule-head" style="margin-bottom:14px">Log a measurement</h2>
    <form id="measureForm" class="grid" style="--min:160px;--gap:12px;align-items:end;margin-bottom:30px">
      ${[["weight", `Body weight (${unit.w})`], ["chest", `Chest (${unit.l})`], ["arm", `Arm (${unit.l})`]].map(([field, label]) => `<label class="field"><span class="label">${label}</span><input class="input" name="${field}" inputmode="decimal" placeholder="0" value="${esc(state.draft[field])}" style="font-size:18px;font-weight:700"></label>`).join("")}
      <button type="submit" class="btn btn-primary btn-lg" style="box-shadow:none">Save entry</button>
    </form>

    <div class="grid" style="--min:280px;--gap:20px">${[chart("weight", "Body weight", unit.w), chart("chest", "Chest", unit.l), chart("arm", "Arm", unit.l)].map((item) => `<div class="boxed">
      <div class="row" style="justify-content:space-between;align-items:baseline;margin-bottom:10px"><div style="font-size:12.5px">${item.label}</div><div style="font-weight:800;font-size:20px">${esc(item.latest)}</div></div>
      <svg class="chart" viewBox="0 0 320 120" preserveAspectRatio="none" role="img" aria-label="${item.label} over time">
        <line x1="0" y1="119" x2="320" y2="119" stroke="#232838" stroke-width="2" vector-effect="non-scaling-stroke"></line>
        ${item.points ? `<polyline points="${item.points}" fill="none" stroke="#3b6bff" stroke-width="2" vector-effect="non-scaling-stroke"></polyline>` : ""}
        ${item.dots.map((dot) => `<circle cx="${dot.x}" cy="${dot.y}" r="3" fill="#f4f6fb"></circle>`).join("")}
      </svg>
      <div class="row micro" style="justify-content:space-between;margin-top:6px"><span>${esc(item.first)}</span><span>${esc(item.range)}</span></div>
    </div>`).join("")}</div>

    <h2 class="rule-head" style="margin:30px 0 14px">Workout history</h2>
    ${state.history.length ? `<div class="stack" style="--gap:10px">${state.history.map((entry) => {
      const sets = entry.lines.reduce((sum, line) => sum + line.sets.length, 0);
      return `<div class="boxed" style="padding:14px">
        <div class="row" style="gap:6px 16px;align-items:baseline">
          <span style="font-weight:800;font-size:17px">${esc(entry.day)}</span><span class="micro-blue" style="font-size:12px">${esc(entry.focus)}</span>
          <span class="spacer"></span><span class="micro" style="font-size:12px">${esc(entry.date)}${entry.pending ? " · waiting to sync" : ""}</span>
        </div>
        <div style="font-size:13px;color:var(--dim);margin-top:6px">${entry.lines.length} exercise${entry.lines.length === 1 ? "" : "s"} · ${sets} set${sets === 1 ? "" : "s"}</div>
        <div class="grid" style="--min:200px;gap:4px 16px;margin-top:10px;border-top:1px solid var(--line);padding-top:10px">${entry.lines.map((line) => `<div class="row" style="justify-content:space-between;gap:12px;font-size:13px;flex-wrap:nowrap"><span>${esc(line.name)}</span><span style="font-weight:700;white-space:nowrap">${esc(line.sets.map((set) => setDetail(set, entry.unit || unit.w)).join(", "))}</span></div>`).join("")}</div>
      </div>`;
    }).join("")}</div>` : `<div class="boxed" style="padding:20px;font-size:15px">No sessions logged yet. Finish a workout in workout mode and it lands here.</div>`}
    <button type="button" class="btn btn-secondary" data-action="resetData" style="margin-top:18px;font-size:12px;padding:12px 18px">Clear all saved data</button>
  </div>`;
}

function modeView() {
  const mode = state.mode;
  const day = week[mode.dayIdx];
  const item = day.items[mode.idx];
  const exercise = ex(item.exercise);
  const done = mode.done[mode.idx] || [];
  const unit = units();
  const last = mode.idx + 1 >= day.items.length;
  return `<div style="padding-top:20px">
    <div class="row" style="margin-bottom:14px">
      <button type="button" class="btn btn-ghost" data-action="exitMode" style="font-size:12px">← Exit</button>
      <span class="spacer"></span><span class="micro" style="font-size:12px">${esc(day.name)} · exercise ${mode.idx + 1} of ${day.items.length}</span>
    </div>
    ${state.resting ? `<div class="rest-panel" style="padding:30px 24px;margin-bottom:16px">
      <div style="font-size:12px">Rest</div>
      <div class="rest-clock" id="restClock" role="timer" aria-live="off">${clock(state.restLeft)}</div>
      <div class="row" style="margin-top:18px">
        <button type="button" class="btn" data-action="addRest" style="background:var(--bg0);color:var(--ink);min-height:56px;font-size:16px">+30 sec</button>
        <button type="button" class="btn btn-outline-light" data-action="skipRest" style="min-height:56px;font-size:16px">Skip rest</button>
      </div>
    </div>` : ""}
    <div class="boxed" style="padding:0;overflow:hidden">
      ${exercise.image ? `<div style="position:relative;height:clamp(220px,50vw,380px);background:#fff"><span class="art has-img" style="position:absolute;inset:0">${img(exercise, true)}</span></div>` : ""}
      <div class="item-head">
        <div class="item-num" style="flex-basis:96px;color:var(--gold);font-size:54px">${mode.idx + 1}</div>
        <div style="flex:1;padding:16px;min-width:0">
          <div class="metric-label" style="margin-bottom:6px">Current exercise</div>
          <button type="button" data-action="open" data-slug="${esc(exercise.slug)}" data-from="mode" style="all:unset;cursor:pointer;font-weight:800;letter-spacing:-0.02em;font-size:clamp(24px,5.5vw,40px);line-height:1.05">${esc(exercise.name)}</button>
          <div class="row" style="margin-top:8px;gap:8px 14px">${levelTag(exercise.level)}<span style="font-size:13px;color:var(--dim)">${esc(exercise.equipment)}</span></div>
        </div>
      </div>
      <div class="item-metrics" style="border-bottom:1px solid var(--line)">
        ${[["Sets", item.sets], ["Reps", item.reps], ["Rest", item.rest]].map(([label, value]) => `<span style="padding:16px"><span class="metric-label">${label}</span><span class="metric-value" style="font-size:40px">${esc(value)}</span></span>`).join("")}
      </div>
      <div class="stack" style="--gap:10px;padding:16px;border-bottom:1px solid var(--line)">${Array.from({ length: item.sets }, (_, index) => {
        const set = done[index];
        return `<div class="set-row${set ? " is-done" : ""}"><span style="font-weight:800;font-size:16px">Set ${index + 1}${set ? " ✓" : ""}</span><span class="spacer"></span><span style="font-size:14px;font-weight:700">${set ? `${esc(setDetail(set, unit.w))} reps` : `target ${esc(item.reps)}`}</span></div>`;
      }).join("")}</div>
      <div class="grid" style="--min:140px;--gap:12px;padding:16px">
        <label class="field"><span class="label">Weight (${unit.w})</span><input class="input" id="curWeight" inputmode="decimal" placeholder="0" value="${esc(state.curWeight)}" style="min-height:56px;font-size:20px;font-weight:700"></label>
        <label class="field"><span class="label">Reps done</span><input class="input" id="curReps" inputmode="numeric" placeholder="${esc(item.reps)}" value="${esc(state.curReps)}" style="min-height:56px;font-size:20px;font-weight:700"></label>
      </div>
    </div>
    <div class="row" style="margin-top:16px">
      <button type="button" class="btn btn-primary" data-action="completeSet" style="flex:1 1 220px;min-height:66px;font-size:18px"${done.length >= item.sets ? " disabled" : ""}>${done.length >= item.sets ? "All sets complete" : `Set complete (${done.length + 1} of ${item.sets})`}</button>
      <button type="button" class="btn btn-secondary" data-action="nextExercise" style="flex:1 1 180px;min-height:66px;font-size:16px">${last ? "Finish workout" : "Next exercise →"}</button>
    </div>
    <div class="row" style="--gap:8px;margin-top:20px;border-top:1px solid var(--line);padding-top:12px">${day.items.map((_, index) => `<button type="button" class="chip${index === mode.idx ? " is-on" : ""}" data-action="jump" data-index="${index}" aria-label="Exercise ${index + 1}">${index + 1}</button>`).join("")}</div>
  </div>`;
}

const VIEWS = { home: homeView, day: dayView, exercise: exerciseView, library: libraryView, progress: progressView, mode: modeView };

function renderView({ scroll = false } = {}) {
  if (state.view === "mode" && !state.mode) state.view = "home";
  const nav = { day: "schedule", mode: "schedule", exercise: state.from === "library" ? "library" : "schedule" }[state.view] || state.view;
  $("#appNav").innerHTML = [["home", "Home"], ["schedule", "Schedule"], ["library", "Exercises"], ["progress", "Progress"]]
    .map(([key, label]) => `<button type="button" class="chip${nav === key ? " is-on" : ""}" data-action="nav" data-view="${key}"${nav === key ? ' aria-current="page"' : ""}>${label}</button>`).join("");
  $("#view").innerHTML = VIEWS[state.view]();
  bindViewInputs();
  if (scroll) window.scrollTo({ top: 0 });
}

function bindViewInputs() {
  $("#search")?.addEventListener("input", (event) => { state.search = event.target.value; $("#results").innerHTML = libraryResults(); });
  $("#curWeight")?.addEventListener("input", (event) => { state.curWeight = event.target.value; });
  $("#curReps")?.addEventListener("input", (event) => { state.curReps = event.target.value; });
  const form = $("#measureForm");
  if (form) {
    form.addEventListener("input", (event) => { state.draft[event.target.name] = event.target.value; });
    form.addEventListener("submit", (event) => { event.preventDefault(); saveMeasurement(); });
  }
}

function render() {
  root.innerHTML = `<div class="app-wrap">
    <div class="app-top">
      ${brand()}
      <span class="muted">Training app</span>
      <span class="faint nowrap">${esc(plan.name)}</span>
      <span class="spacer"></span>
      <span class="faint nowrap">Units: ${units().w} / ${units().l}</span>
      <a href="/account" style="font-weight:700;color:var(--blue)">${user ? "My account" : "Sign in"}</a>
    </div>
    <nav class="app-nav rail" id="appNav" aria-label="Training app"></nav>
    <main id="view"></main>
    <footer style="margin-top:40px;border-top:1px solid var(--line);padding-top:16px">
      <div class="micro-blue" style="margin-bottom:8px">Disclaimer</div>
      <p style="font-size:13px;line-height:1.6;max-width:88ch;color:var(--dim)">${DISCLAIMER}</p>
    </footer>
    <dialog id="swapDialog" class="dialog" aria-labelledby="swapTitle"></dialog>
  </div>`;
  renderView();
}

// ---------- Actions ----------

function startMode(dayIdx) {
  if (!week[dayIdx].items.length) return;
  if (!state.mode || state.mode.dayIdx !== dayIdx) {
    setMode({ dayIdx, idx: 0, done: {}, clientRef: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`, startedAt: new Date().toISOString() });
  }
  stopRest();
  state.curWeight = ""; state.curReps = "";
  state.view = "mode";
  renderView({ scroll: true });
}

function startRest(seconds) {
  state.resting = seconds > 0;
  state.restLeft = seconds;
  clearInterval(restTimer);
  if (!state.resting) return;
  restTimer = setInterval(() => {
    state.restLeft -= 1;
    if (state.restLeft <= 0) {
      stopRest();
      navigator.vibrate?.(300);
      if (state.view === "mode") renderView();
      return;
    }
    const node = $("#restClock");
    if (node) node.textContent = clock(state.restLeft);
  }, 1000);
}
function stopRest() { clearInterval(restTimer); state.resting = false; state.restLeft = 0; }

function completeSet() {
  const mode = state.mode;
  const item = week[mode.dayIdx].items[mode.idx];
  const done = mode.done[mode.idx] || [];
  if (done.length >= item.sets) return;
  const weight = state.curWeight.trim();
  if (weight && !(Number(weight) >= 0)) { toast("Weight must be a number", { error: true }); return; }
  mode.done[mode.idx] = [...done, { weight: weight ? Number(weight) : undefined, reps: state.curReps.trim() || item.reps }];
  setMode(mode);
  state.curReps = "";
  const finished = mode.done[mode.idx].length >= item.sets;
  startRest(finished ? 0 : item.restSec);
  renderView();
}

function nextExercise() {
  const mode = state.mode;
  if (mode.idx + 1 >= week[mode.dayIdx].items.length) { finishSession(); return; }
  setMode({ ...mode, idx: mode.idx + 1 });
  stopRest();
  state.curWeight = ""; state.curReps = "";
  renderView({ scroll: true });
}

async function finishSession() {
  const mode = state.mode;
  const day = week[mode.dayIdx];
  const lines = day.items.map((item, index) => ({ item, sets: mode.done[index] || [] })).filter(({ sets }) => sets.length)
    .map(({ item, sets }) => ({ exercise: item.exercise, name: ex(item.exercise).name, sets }));
  setMode(null);
  stopRest();
  state.view = "progress";
  if (lines.length) {
    const entry = { clientRef: mode.clientRef, date: todayISO(), day: day.name, focus: day.focus, unit: units().w, lines };
    if (user) {
      store.set(PENDING_KEY, [...pending(), entry]);
      state.history = [{ ...entry, pending: true }, ...state.history];
      renderView({ scroll: true });
      await flushPending();
      if (pending().some((item) => item.clientRef === entry.clientRef)) toast("Saved on this device. It uploads when the connection is back.");
      return;
    }
    state.history = [entry, ...state.history].slice(0, 60);
    saveLocal();
  }
  renderView({ scroll: true });
}

async function saveMeasurement() {
  const { weight, chest, arm } = state.draft;
  if (!weight && !chest && !arm) return;
  if ([weight, chest, arm].some((value) => value && !(Number(value) > 0))) { toast("Measurements must be positive numbers", { error: true }); return; }
  const entry = { date: todayISO(), weight: weight ? Number(weight) : undefined, chest: chest ? Number(chest) : undefined, arm: arm ? Number(arm) : undefined };
  try {
    if (user) {
      const { measurement } = await api.post("/api/training/measurements", entry);
      state.measurements = [...state.measurements, measurement];
    } else {
      state.measurements = [...state.measurements, entry];
      saveLocal();
    }
    state.draft = { weight: "", chest: "", arm: "" };
    renderView();
  } catch (error) { toast(error.message, { error: true }); }
}

function openSwap(index) {
  const item = week[state.dayIdx].items[index];
  const current = ex(item.exercise);
  const options = catalog.exercises.filter((exercise) => exercise.category === current.category && exercise.slug !== current.slug);
  const dialog = $("#swapDialog");
  dialog.innerHTML = `<h2 id="swapTitle" class="card-title">Swap ${esc(current.name)}</h2>
    <p class="hint" style="margin-top:6px">Same body part, with or without equipment. Sets, reps and rest follow the new exercise.</p>
    <div class="swap-list">${options.map((exercise) => `<button type="button" class="swap-option" data-action="doSwap" data-index="${index}" data-slug="${esc(exercise.slug)}"><span>${esc(exercise.name)}</span><span class="faint" style="font-size:12.5px">${exercise.kit === "bodyweight" ? "No equipment" : "Equipment"}</span>${levelTag(exercise.level)}</button>`).join("")}</div>
    <button type="button" class="btn btn-secondary btn-block" data-action="closeSwap">Cancel</button>`;
  dialog.showModal();
}

onAction(root, {
  nav: ({ view }) => {
    if (view === "schedule") { state.view = state.mode ? "mode" : "day"; if (!state.mode) state.dayIdx = todayIdx; } else state.view = view;
    renderView({ scroll: true });
  },
  go: ({ view }) => { state.view = view; renderView({ scroll: true }); },
  openDay: ({ day }) => { state.dayIdx = Number(day); state.view = "day"; renderView({ scroll: true }); },
  open: ({ slug, from }) => { state.exId = slug; state.from = from; state.view = "exercise"; renderView({ scroll: true }); },
  back: () => { state.view = { day: "day", mode: "mode", library: "library" }[state.from] || "home"; renderView({ scroll: true }); },
  start: ({ day }) => startMode(Number(day)),
  resume: () => { state.view = "mode"; renderView({ scroll: true }); },
  completeSet,
  nextExercise,
  jump: ({ index }) => { setMode({ ...state.mode, idx: Number(index) }); stopRest(); state.curWeight = ""; state.curReps = ""; renderView(); },
  addRest: () => { startRest(state.restLeft + 30); renderView(); },
  skipRest: () => { stopRest(); renderView(); },
  exitMode: () => { state.dayIdx = state.mode.dayIdx; state.view = "day"; stopRest(); renderView({ scroll: true }); },
  filter: ({ key, value }) => {
    const current = state.filters[key];
    state.filters[key] = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value];
    renderView();
  },
  clearFilters: () => { state.filters = { muscle: [], level: [], equip: [], type: [] }; state.search = ""; renderView(); },
  resetData: async () => {
    if (!confirm(user ? "Delete every logged workout and measurement from your account? This cannot be undone." : "Delete every logged workout and measurement on this device?")) return;
    try {
      if (user) { await api.delete("/api/training"); store.remove(PENDING_KEY); } else store.remove(LOCAL_KEY);
      state.history = []; state.measurements = [];
      renderView();
    } catch (error) { toast(error.message, { error: true }); }
  },
  swap: ({ index }) => openSwap(Number(index)),
  closeSwap: () => $("#swapDialog").close(),
  doSwap: async ({ index, slug }) => {
    try {
      const { plan: updated } = await api.patch(`/api/training/plan/days/${week[state.dayIdx].weekday}/items/${index}`, { exercise: slug });
      plan = updated;
      buildWeek();
      $("#swapDialog").close();
      renderView();
      toast(`Swapped for ${ex(slug).name}`);
    } catch (error) { toast(error.message, { error: true }); }
  },
});

window.addEventListener("online", flushPending);

Promise.all([loadCatalog(), loadMe()])
  .then(async ([data, me]) => {
    catalog = data;
    user = me;
    await loadTraining();
    if (!plan) return showFatal(root, "No training plan is published yet.");
    render();
    flushPending();
  })
  .catch(() => showFatal(root, "The training app could not be loaded. Check your connection and refresh."));
