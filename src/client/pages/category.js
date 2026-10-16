import "../styles.css";
import "../lib/muscle-map.js";
import { loadCatalog, loadMe } from "../lib/api.js";
import { $, esc, onAction } from "../lib/dom.js";
import { header, disclaimer, exerciseArt, dose, showFatal } from "../lib/site.js";

const root = $("#root");
const state = { cat: new URLSearchParams(location.search).get("cat") || "", kit: "all", level: "all" };
let catalog = null;

const KITS = [["all", "All"], ["tools", "With equipment"], ["bodyweight", "No equipment"]];
const LEVELS = [["all", "Any level"], ["LOW", "Low"], ["MEDIUM", "Medium"]];

function exerciseCard(exercise, index) {
  return `<article class="card lib-card" style="overflow:hidden;display:flex;flex-direction:column">
    ${exerciseArt(exercise, { num: index + 1 })}
    <div class="ex-card-body" style="padding:16px 18px 18px">
      <h3 class="ex-card-name" style="font-size:17px">${esc(exercise.name)}</h3>
      <div class="ex-card-meta">${esc(exercise.muscles)}</div>
      <div class="dose"><strong>${esc(dose(exercise.sets, exercise.reps))}</strong><span class="dot-sep"></span><span>${esc(exercise.rest)} rest</span></div>
      <div style="font-size:13px;color:var(--dim)">${esc(exercise.equipment)}</div>
      <div class="stack" style="--gap:7px;padding-top:4px">${exercise.cues.map((cue) => `<div class="cue"><span>${esc(cue)}</span></div>`).join("")}</div>
    </div>
  </article>`;
}

function listHtml(all) {
  const pass = (exercise) => (state.kit === "all" || exercise.kit === state.kit) && (state.level === "all" || exercise.level === state.level);
  const tools = all.filter((exercise) => exercise.kit === "tools" && pass(exercise));
  const body = all.filter((exercise) => exercise.kit === "bodyweight" && pass(exercise));
  const group = (title, sub, items) => `<section class="wrap" style="padding-top:34px">
    <div class="row" style="align-items:baseline;gap:8px 14px;margin-bottom:16px"><h2 class="h3">${title}</h2><span class="sub-note">${items.length} exercises · ${sub}</span></div>
    ${items.length ? `<div class="grid" style="--min:260px">${items.map(exerciseCard).join("")}</div>` : `<div class="empty">Nothing in this group matches the current filter.</div>`}
  </section>`;
  return `<div class="wrap" style="padding-top:26px">
      <div class="row" style="gap:10px 18px">
        <div class="pills rail">${KITS.map(([key, label]) => `<button type="button" class="pill${state.kit === key ? " is-on" : ""}" data-action="kit" data-key="${key}">${label}</button>`).join("")}</div>
        <div class="pills rail">${LEVELS.map(([key, label]) => `<button type="button" class="pill${state.level === key ? " is-on" : ""}" data-action="level" data-key="${key}">${label}</button>`).join("")}</div>
        <span class="spacer"></span>
        <span class="sub-note">${tools.length + body.length} of ${all.length} shown</span>
      </div>
    </div>
    ${group("With equipment", "machines, dumbbells, cables", tools)}
    ${group("No equipment", "floor, wall, chair, stairs", body)}`;
}

function render(user) {
  const { categories, exercises } = catalog;
  const index = Math.max(0, categories.findIndex((category) => category.slug === state.cat));
  const category = categories[index];
  if (!category) return showFatal(root, "No body parts are published yet.");
  state.cat = category.slug;
  document.title = `${category.name} exercises · Groundwork`;
  const all = exercises.filter((exercise) => exercise.category === category.slug);

  root.innerHTML = `
  ${header({ user, links: [["All body parts", "/#library"], ["Plans", "/plans"]] })}
  <main>
    <div class="wrap" style="padding-top:24px">
      <nav class="row rail" style="--gap:8px" aria-label="Body parts">${categories.map((entry) => `<a class="tab-link${entry.slug === category.slug ? " is-on" : ""}" href="/category?cat=${esc(entry.slug)}"${entry.slug === category.slug ? ' aria-current="page"' : ""}>${esc(entry.name)}</a>`).join("")}</nav>
    </div>
    <div class="wrap" style="padding-top:22px">
      <div class="cat-hero">
        <div class="cat-hero-body">
          <span class="kicker">Body part ${String(index + 1).padStart(2, "0")}</span>
          <h1>${esc(category.name)}</h1>
          <p class="muted" style="font-size:16px;line-height:1.55;max-width:44ch">${esc(category.blurb)}</p>
          <div class="row" style="--gap:8px;margin-top:4px">
            <span class="badge badge-neutral" style="color:var(--ink);padding:7px 13px;font-size:12.5px">${all.length} exercises</span>
            <span class="badge badge-blue" style="padding:7px 13px;font-size:12.5px">${all.filter((e) => e.kit === "tools").length} with equipment</span>
            <span class="badge badge-gold" style="padding:7px 13px;font-size:12.5px">${all.filter((e) => e.kit === "bodyweight").length} no equipment</span>
          </div>
        </div>
        ${category.image
          ? `<span class="art has-img cover"><img src="${esc(category.image)}" alt=""></span>`
          : `<span class="art"><muscle-map group="${esc(category.slug)}"></muscle-map></span>`}
      </div>
    </div>
    <div id="list">${listHtml(all)}</div>
    <div class="wrap" style="padding-top:48px">
      <div class="gradient-panel cta-band">
        <div><div class="cta-band-title">Put these into a week</div><p>Pick a recommended plan and these exercises land on real days, with rest already placed.</p></div>
        <a class="btn btn-dark" href="/plans">Choose a plan →</a>
      </div>
    </div>
  </main>
  ${disclaimer()}`;
}

const rerenderList = () => { $("#list").innerHTML = listHtml(catalog.exercises.filter((exercise) => exercise.category === state.cat)); };
onAction(root, {
  kit: ({ key }) => { state.kit = key; rerenderList(); },
  level: ({ key }) => { state.level = key; rerenderList(); },
});

Promise.all([loadCatalog(), loadMe()])
  .then(([data, user]) => { catalog = data; render(user); })
  .catch(() => showFatal(root, "The exercise library could not be loaded. Refresh the page to try again."));
