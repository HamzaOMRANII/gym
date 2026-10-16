import "../styles.css";
import "../lib/muscle-map.js";
import { api, loadCatalog, loadMe } from "../lib/api.js";
import { $, esc, onAction, store, toast } from "../lib/dom.js";
import { header, disclaimer, levelTag, dose, showFatal, WEEKDAYS } from "../lib/site.js";

const PLAN_KEY = "groundwork.plan";
const KITS = [["all", "All"], ["tools", "With equipment"], ["bodyweight", "No equipment"]];

const root = $("#root");
const state = { plan: location.hash.slice(1) || null, swapCat: "", swapKit: "all", busy: false };
let catalog = null;
let user = null;
let adoptedSlug = null;

function dayTarget(focus, names, rest) {
  const text = `${focus} ${names.join(" ")}`.toLowerCase();
  if (rest) return "fullbody";
  if (/leg|squat|quad|calf/.test(text)) return "legs";
  if (/pull|back|row|lat|bicep/.test(text)) return "back";
  if (/push|chest|press|shoulder|tricep/.test(text)) return "chest";
  return "fullbody";
}

function dayCard({ day, focus, items, rest }) {
  const target = dayTarget(focus, items, rest);
  return `<div class="card day-card${rest ? " is-rest" : ""}" style="overflow:hidden;display:flex;flex-direction:column">
    <span class="art"><muscle-map group="${target}"></muscle-map></span>
    <div class="day-card-body">
      <div class="row" style="justify-content:space-between;gap:8px"><span style="font-size:17px;font-weight:800;letter-spacing:-0.02em">${esc(day)}</span><span style="font-size:11.5px;font-weight:700;color:${rest ? "var(--faint)" : "var(--gold)"}">${rest ? "Recovery" : "Training"}</span></div>
      <div style="font-size:13.5px;font-weight:700;color:var(--dim)">${esc(focus)}</div>
      <div class="day-card-items">${items.map((item) => `<div>${esc(item)}</div>`).join("")}</div>
    </div>
  </div>`;
}

function weekCards(plan) {
  const days = [...plan.days].sort((a, b) => a.weekday - b.weekday).map((day) => day.isRest || !day.items.length
    ? { day: WEEKDAYS[day.weekday], focus: day.focus || "Rest", items: day.notes, rest: true }
    : { day: WEEKDAYS[day.weekday], focus: day.focus, rest: false, items: day.items.map((item) => `${catalog.bySlug[item.exercise]?.name || item.exercise} ${dose(item.sets, item.reps)}`) });
  if (plan.days.length < 7 && plan.restNote?.items?.length) days.push({ day: plan.restNote.label, focus: "Rest", items: plan.restNote.items, rest: true });
  return days.map(dayCard).join("");
}

function actionNote() {
  if (user) return adoptedSlug ? "Your account follows a plan. Choosing another replaces it; your logged sessions stay." : "Saved to your account, so the training app opens on it on every device.";
  return `Saved on this device. <a href="/account" style="color:var(--blue)">Sign in</a> to keep it on every device.`;
}

function planHtml() {
  const { templates } = catalog;
  const active = templates.find((plan) => plan.slug === state.plan) || templates[1] || templates[0];
  const isCurrent = (slug) => slug === (adoptedSlug || store.get(PLAN_KEY, null));
  return `<div class="wrap" style="padding-top:26px">
      <div class="grid" style="--min:260px">${templates.map((plan) => {
        const on = plan.slug === active.slug;
        return `<button type="button" id="${esc(plan.slug)}" class="plan-card${on ? " is-on" : ""}" data-action="pick" data-slug="${esc(plan.slug)}" aria-pressed="${on}">
          <span class="plan-card-meta"><span class="nowrap">${esc(plan.commitment)}</span><span class="plan-card-dot"></span></span>
          <span class="plan-card-name">${esc(plan.name)}</span>
          <span class="plan-card-who">${esc(plan.who)}</span>
          <span class="plan-card-action">${on ? "Selected — shown below" : "Choose this week →"}${isCurrent(plan.slug) ? " · your current plan" : ""}</span>
        </button>`;
      }).join("")}</div>
    </div>
    <section class="wrap" style="padding-top:44px">
      <div class="row" style="align-items:baseline;gap:10px 18px;margin-bottom:18px">
        <h2 class="h3" style="font-size:clamp(22px,3.2vw,32px)">${esc(active.name)}</h2>
        <span class="sub-note" style="font-size:14px">${esc(active.commitment)}</span>
        <span class="spacer"></span>
        ${levelTag(active.level)}
      </div>
      <div class="grid" style="--min:250px">${weekCards(active)}</div>
      <div class="row" style="margin-top:18px;gap:12px 16px">
        <button type="button" class="btn btn-primary" data-action="adopt" data-slug="${esc(active.slug)}"${state.busy ? " disabled" : ""}>${isCurrent(active.slug) ? "Open this week in the app →" : "Use this week →"}</button>
        <span class="hint">${actionNote()}</span>
      </div>
    </section>`;
}

function swapHtml() {
  const swaps = catalog.exercises.filter((exercise) => exercise.category === state.swapCat && (state.swapKit === "all" || exercise.kit === state.swapKit));
  return `<div class="row" style="align-items:baseline;gap:10px 18px;margin-bottom:16px"><h2 class="h3">Swap an exercise</h2><span class="sub-note">${swaps.length} options in this body part</span></div>
    <div class="row" style="gap:10px 16px;margin-bottom:16px">
      <div class="pills rail" style="flex-wrap:wrap">${catalog.categories.map((category) => `<button type="button" class="pill${category.slug === state.swapCat ? " is-on" : ""}" data-action="swapCat" data-slug="${esc(category.slug)}">${esc(category.name)}</button>`).join("")}</div>
      <div class="pills rail">${KITS.map(([key, label]) => `<button type="button" class="pill${state.swapKit === key ? " is-on" : ""}" data-action="swapKit" data-key="${key}">${label}</button>`).join("")}</div>
    </div>
    <div class="grid" style="--min:230px;--gap:12px">${swaps.map((exercise) => `<div class="card swap-card">
      <span class="row" style="justify-content:space-between;align-items:flex-start"><span style="font-size:16px;font-weight:800;line-height:1.25;letter-spacing:-0.015em">${esc(exercise.name)}</span>${levelTag(exercise.level)}</span>
      <span style="font-size:13px;color:var(--faint)">${esc(exercise.equipment)}</span>
      <span style="font-size:14.5px;font-weight:800;margin-top:2px">${esc(dose(exercise.sets, exercise.reps))}</span>
    </div>`).join("")}</div>
    <p class="hint" style="margin-top:12px">To swap inside your own week, open the day in the training app and choose “Swap” on any exercise.</p>`;
}

function render() {
  if (!catalog.templates.length) return showFatal(root, "No weekly plans are published yet.");
  state.swapCat ||= catalog.categories[0]?.slug || "";
  root.innerHTML = `
  ${header({ user, current: "/plans", links: [["Exercises", "/#library"], ["Progress", "/#progress"]] })}
  <main>
    <div class="wrap" style="padding-top:40px">
      <span class="kicker" style="margin-bottom:14px">Create your own plan</span>
      <h1 class="h1" style="margin-bottom:14px">Pick the week you can keep</h1>
      <p class="lead">Three recommended weeks, sorted by how much time you have. Choose one, then swap any exercise for another from the same body part — with or without equipment.</p>
    </div>
    <div id="plan">${planHtml()}</div>
    <section class="wrap" style="padding-top:44px" id="swap">${swapHtml()}</section>
    <div class="wrap" style="padding-top:48px">
      <div class="gradient-panel cta-band">
        <div><div class="cta-band-title">Run it in the app</div><p>Your week is loaded with a rest timer, set logging and progress charts. Free, and it works without an account.</p></div>
        <a class="btn btn-dark" href="/app">Open training app →</a>
      </div>
    </div>
  </main>
  ${disclaimer()}`;
}

const rerenderPlan = () => { $("#plan").innerHTML = planHtml(); };
const rerenderSwap = () => { $("#swap").innerHTML = swapHtml(); };

onAction(root, {
  pick: ({ slug }) => { state.plan = slug; history.replaceState(null, "", `#${slug}`); rerenderPlan(); },
  swapCat: ({ slug }) => { state.swapCat = slug; rerenderSwap(); },
  swapKit: ({ key }) => { state.swapKit = key; rerenderSwap(); },
  adopt: async ({ slug }) => {
    const current = slug === (adoptedSlug || store.get(PLAN_KEY, null));
    if (current) { location.href = "/app"; return; }
    if (!user) { store.set(PLAN_KEY, slug); location.href = "/app"; return; }
    state.busy = true; rerenderPlan();
    try {
      await api.post("/api/training/plan", { template: slug });
      location.href = "/app";
    } catch (error) {
      state.busy = false; rerenderPlan();
      toast(error.message, { error: true });
    }
  },
});

Promise.all([loadCatalog(), loadMe()])
  .then(async ([data, me]) => {
    catalog = data;
    user = me;
    if (user) {
      try { adoptedSlug = (await api.get("/api/training")).plan?.slug || null; } catch { /* plan state is optional here */ }
    }
    render();
  })
  .catch(() => showFatal(root, "The plans could not be loaded. Refresh the page to try again."));
