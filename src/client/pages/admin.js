import "../styles.css";
import { api, loadMe } from "../lib/api.js";
import { go as goToPage } from "../lib/native.js";
import { $, esc, onAction, toast } from "../lib/dom.js";
import { brand, levelTag, showFatal } from "../lib/site.js";

const PAGES = {
  dashboard: { title: "Dashboard", sub: "Last 14 days" },
  exercises: { title: "Exercises", sub: "The public exercise library", action: ["New exercise", "newExercise"] },
  categories: { title: "Categories", sub: "Body-part groupings", action: ["New category", "newCategory"] },
  plans: { title: "Plan templates", sub: "Published weeks members can adopt" },
  users: { title: "Users", sub: "Accounts and roles" },
  editor: { title: "Edit exercise", sub: "", action: ["Save changes", "saveExercise"] },
};
const FILTERS = {
  exercises: ["All", "With equipment", "No equipment", "Unpublished"],
  users: ["All", "Members", "Staff", "Disabled"],
};
const LISTS = [["cues", "Form cues", "Add cue"], ["instructions", "How to perform (steps)", "Add step"], ["mistakes", "Common mistakes", "Add mistake"]];

const root = $("#root");
const state = { page: "dashboard", filter: "All", search: "", editing: null };
const data = { stats: null, exercises: null, categories: null, templates: null, users: null };
let user = null;

const ago = (value) => {
  const minutes = Math.round((Date.now() - new Date(value)) / 60000);
  if (minutes < 60) return minutes <= 1 ? "Just now" : `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : days < 30 ? `${days} days ago` : new Date(value).toLocaleDateString();
};
const statusBadge = (on, yes = "Published", no = "Draft") => `<span class="badge ${on ? "badge-green" : "badge-neutral"}" style="font-size:11px;font-weight:800">${on ? yes : no}</span>`;
const matches = (...values) => !state.search || values.join(" ").toLowerCase().includes(state.search.toLowerCase());
const row = (initial, title, sub, cells, actions, thumbClass = "") => `<tr>
  <td><div class="row" style="flex-wrap:nowrap;gap:12px"><span class="thumb ${thumbClass}">${esc(initial)}</span><span style="min-width:0"><span style="display:block;font-weight:700">${esc(title)}</span><span style="display:block;font-size:12px;color:var(--faint);margin-top:1px">${esc(sub)}</span></span></div></td>
  ${cells.map((cell) => `<td style="color:var(--dim);white-space:nowrap">${cell}</td>`).join("")}
  <td style="text-align:right;white-space:nowrap">${actions}</td>
</tr>`;
const table = (cols, rows, total) => `${filtersHtml(rows.length, total)}
  <div class="table-card"><table class="table"><thead><tr>${cols.map((col) => `<th>${col}</th>`).join("")}<th></th></tr></thead>
  <tbody>${rows.join("") || `<tr><td colspan="${cols.length + 1}" style="color:var(--faint)">Nothing matches.</td></tr>`}</tbody></table></div>`;

function filtersHtml(shown, total) {
  const filters = FILTERS[state.page] || [];
  return `<div class="row" style="--gap:8px">
    ${filters.map((filter) => `<button type="button" class="chip${state.filter === filter ? " is-on" : ""}" data-action="filter" data-value="${filter}" style="min-height:36px;padding:8px 15px">${filter}</button>`).join("")}
    <span class="spacer"></span><span class="hint nowrap">${shown} of ${total} shown</span>
  </div>`;
}

// ---------- Pages ----------

function dashboardHtml() {
  const { stats, signups, activity } = data.stats;
  const max = Math.max(1, ...signups.map((day) => day.count));
  const total = signups.reduce((sum, day) => sum + day.count, 0);
  return `<div class="grid" style="--min:190px">${[
      ["Members", stats.members, `+${stats.newMembers} this fortnight`, "var(--green)"],
      ["Sessions logged", stats.sessions, `+${stats.newSessions} this fortnight`, "var(--green)"],
      ["Plans adopted", stats.adoptions, "Member-owned copies", "var(--gold)"],
      ["Published exercises", stats.exercises, "In the public library", "var(--faint)"],
    ].map(([label, value, delta, tone]) => `<div class="stat"><div class="stat-label" style="margin:0;font-size:12.5px">${label}</div><div class="stat-value" style="font-size:28px;margin:6px 0 4px">${value.toLocaleString()}</div><div style="font-size:12.5px;font-weight:700;color:${tone}">${delta}</div></div>`).join("")}</div>
    <div class="grid" style="--min:300px;--gap:16px;align-items:start">
      <div class="card" style="padding:20px">
        <div class="row" style="justify-content:space-between;align-items:baseline;margin-bottom:16px"><span class="card-title" style="font-size:16px">Signups, last 14 days</span><span class="hint nowrap">${total} total</span></div>
        <svg class="bars" viewBox="0 0 340 120" preserveAspectRatio="none" role="img" aria-label="Signups per day">${signups.map((day, index) => {
          const height = Math.max(2, Math.round((day.count / max) * 108));
          return `<rect x="${index * 24 + 2}" y="${116 - height}" width="18" height="${height}" rx="3" fill="${index === signups.length - 1 ? "#3b6bff" : "rgba(59,107,255,.35)"}"><title>${day.date}: ${day.count}</title></rect>`;
        }).join("")}</svg>
      </div>
      <div class="card" style="padding:20px">
        <div class="card-title" style="font-size:16px;margin-bottom:10px">Recent activity</div>
        ${activity.length ? activity.map((item) => `<div class="activity-row"><span class="activity-dot ${item.kind}"></span><span style="flex:1;min-width:0"><span style="display:block;font-size:14px">${esc(item.text)}</span><span class="hint" style="display:block;margin-top:2px;font-size:12px">${ago(item.at)}</span></span></div>`).join("") : '<div class="hint">No activity yet.</div>'}
      </div>
    </div>`;
}

function exercisesHtml() {
  const categoryName = Object.fromEntries(data.categories.map((category) => [category.slug, category.name]));
  const pass = (exercise) => ({
    "With equipment": exercise.kit === "tools", "No equipment": exercise.kit === "bodyweight", Unpublished: !exercise.published,
  }[state.filter] ?? true);
  const rows = data.exercises.filter((exercise) => pass(exercise) && matches(exercise.name, exercise.slug, exercise.equipment, categoryName[exercise.category]))
    .map((exercise) => row(exercise.name[0], exercise.name, exercise.equipment, [
      esc(categoryName[exercise.category] || exercise.category), levelTag(exercise.level), statusBadge(exercise.published), esc(ago(exercise.updatedAt)),
    ], `<button type="button" class="btn btn-secondary btn-sm" data-action="editExercise" data-id="${exercise._id}">Edit</button>`));
  return table(["Exercise", "Category", "Difficulty", "Status", "Updated"], rows, data.exercises.length);
}

function categoriesHtml() {
  const rows = data.categories.filter((category) => matches(category.name, category.slug))
    .map((category) => row(category.name[0], category.name, `/${category.slug}`, [
      `${category.exerciseCount} exercises`, statusBadge(category.published), esc(ago(category.updatedAt)),
    ], `<button type="button" class="btn btn-secondary btn-sm" data-action="editCategory" data-id="${category._id}">Edit</button>`));
  return `${table(["Category", "Exercises", "Status", "Updated"], rows, data.categories.length)}
  <dialog id="categoryDialog" class="dialog" aria-labelledby="categoryTitle"></dialog>`;
}

function plansHtml() {
  const rows = data.templates.filter((plan) => matches(plan.name, plan.who))
    .map((plan) => row(plan.name[0], plan.name, `${plan.who.slice(0, 46)}…`, [
      esc(plan.commitment), statusBadge(plan.published), `${plan.adoptedBy} member${plan.adoptedBy === 1 ? "" : "s"}`,
    ], `<button type="button" class="btn btn-secondary btn-sm" data-action="togglePlan" data-id="${plan._id}">${plan.published ? "Unpublish" : "Publish"}</button>`));
  return `${table(["Template", "Commitment", "Status", "Adopted by"], rows, data.templates.length)}
    <p class="hint">Members adopt a copy of a template; unpublishing hides it from the Plans page without touching adopted copies. Template days are defined in <code>src/seed/catalog.js</code>.</p>`;
}

function usersHtml() {
  const pass = (member) => ({
    Members: member.role === "member", Staff: member.role !== "member", Disabled: member.status === "disabled",
  }[state.filter] ?? true);
  const rows = data.users.filter((member) => pass(member) && matches(member.name, member.email, member.role))
    .map((member) => {
      const self = member._id === user._id;
      return row(member.name[0], member.name, member.email, [
        esc(new Date(member.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })),
        `<select class="select" data-role-for="${member._id}" style="min-height:36px;width:auto;padding:0 10px;font-size:13px"${self ? " disabled" : ""}>${["member", "editor", "admin"].map((role) => `<option value="${role}"${member.role === role ? " selected" : ""}>${role[0].toUpperCase() + role.slice(1)}</option>`).join("")}</select>`,
        member.lastLoginAt ? esc(ago(member.lastLoginAt)) : "Never",
      ], self ? '<span class="hint">You</span>' : `<button type="button" class="btn btn-secondary btn-sm" data-action="toggleUser" data-id="${member._id}">${member.status === "active" ? "Disable" : "Enable"}</button>`, "blue");
    });
  return table(["User", "Joined", "Role", "Last active"], rows, data.users.length);
}

function listEditor(key, label, addLabel, items) {
  return `<div class="card stack" style="padding:20px;--gap:12px" data-list="${key}">
    <div class="row" style="justify-content:space-between"><span class="card-title" style="font-size:16px">${label}</span><button type="button" class="btn btn-secondary btn-sm" data-action="addItem" data-list="${key}">${addLabel}</button></div>
    <div class="stack" style="--gap:8px" data-items>${items.map((item) => listRow(item)).join("")}</div>
  </div>`;
}
const listRow = (value = "") => `<div class="list-row"><input value="${esc(value)}" aria-label="Item"><button type="button" class="icon-btn" data-action="removeItem" aria-label="Remove">×</button></div>`;

function editorHtml() {
  const exercise = state.editing;
  const field = (name, label, value, attrs = "") => `<label class="field" style="gap:7px"><span class="label">${label}</span><input class="input" name="${name}" value="${esc(value ?? "")}" ${attrs}></label>`;
  const select = (name, label, options, value) => `<label class="field" style="gap:7px"><span class="label">${label}</span><select class="select" name="${name}">${options.map(([key, text]) => `<option value="${esc(key)}"${key === value ? " selected" : ""}>${esc(text)}</option>`).join("")}</select></label>`;
  return `<form id="exerciseForm" class="grid" style="--min:300px;--gap:16px;align-items:start">
    <div class="stack" style="--gap:16px">
      <div class="card stack" style="padding:20px">
        <div class="card-title" style="font-size:16px">Basics</div>
        ${field("name", "Exercise name", exercise.name, 'required maxlength="100"')}
        ${field("slug", "URL slug", exercise.slug, 'required pattern="[a-z0-9\\-]+" maxlength="80"')}
        <div class="grid" style="--min:140px;--gap:12px">
          ${select("category", "Category", data.categories.map((category) => [category.slug, category.name]), exercise.category)}
          ${select("kit", "Equipment kind", [["tools", "With equipment"], ["bodyweight", "No equipment"]], exercise.kit)}
          ${select("level", "Difficulty", [["LOW", "Low"], ["MEDIUM", "Medium"], ["ADVANCED", "Advanced"]], exercise.level)}
          ${select("trainingType", "Training type", [["Push", "Push"], ["Pull", "Pull"], ["Legs", "Legs"], ["Core", "Core"]], exercise.trainingType)}
        </div>
      </div>
      <div class="card stack" style="padding:20px">
        <div class="card-title" style="font-size:16px">Prescription</div>
        <div class="grid" style="--min:110px;--gap:12px">
          ${field("sets", "Sets", exercise.sets, 'type="number" min="1" max="10"')}
          ${field("reps", "Rep range", exercise.reps)}
          ${field("rest", "Rest (label)", exercise.rest)}
          ${field("restSec", "Rest timer (sec)", exercise.restSec, 'type="number" min="0" max="600"')}
        </div>
        ${field("muscles", "Muscles (shown on cards)", exercise.muscles)}
        <div class="grid" style="--min:140px;--gap:12px">
          ${field("primaryMuscle", "Main muscle", exercise.primaryMuscle)}
          ${field("secondaryMuscles", "Secondary muscles (comma separated)", exercise.secondaryMuscles.join(", "))}
        </div>
        ${field("equipment", "Equipment", exercise.equipment)}
        ${field("equipTags", "Equipment filters (comma separated)", exercise.equipTags.join(", "))}
        ${field("alternatives", "Alternatives (exercise slugs, comma separated)", exercise.alternatives.join(", "))}
      </div>
      ${listEditor(...LISTS[0], exercise.cues)}
      ${listEditor(...LISTS[1], exercise.instructions)}
    </div>
    <div class="stack" style="--gap:16px">
      <div class="card stack" style="padding:20px">
        <div class="card-title" style="font-size:16px">Publishing</div>
        <label class="check" style="padding:13px;border-radius:12px;background:rgba(72,200,140,.08);border:1px solid rgba(72,200,140,.3);align-items:center"><input type="checkbox" name="published"${exercise.published ? " checked" : ""}><span style="flex:1;font-size:14px;font-weight:700;color:var(--green)">Published</span>${exercise._id ? `<span class="hint">v${exercise.version}</span>` : ""}</label>
        ${exercise._id ? `<div class="hint">Last edited${exercise.updatedBy ? ` by ${esc(exercise.updatedBy)}` : ""}, ${esc(ago(exercise.updatedAt))}.</div>` : ""}
        <div class="row">
          <button type="submit" class="btn btn-primary" style="flex:1 1 120px;box-shadow:none">Save changes</button>
          <button type="button" class="btn btn-secondary" data-action="go" data-page="exercises">Cancel</button>
          ${exercise._id ? `<button type="button" class="btn btn-danger" data-action="deleteExercise">Delete</button>` : ""}
        </div>
      </div>
      <div class="card stack" style="padding:20px">
        <div class="card-title" style="font-size:16px">Media</div>
        ${exercise.image ? `<div style="position:relative;height:160px;border-radius:14px;background:#eef0f4;overflow:hidden"><img src="${esc(exercise.image)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:8px"></div>` : `<div class="hint" style="height:120px;border-radius:14px;border:1px dashed var(--line);background:var(--bg2);display:grid;place-items:center;text-align:center;padding:16px">No image: the muscle map is shown instead.</div>`}
        ${field("image", "Image path", exercise.image, 'placeholder="/uploads/exercise-name.jpg"')}
        <span class="hint" style="margin-top:-6px">Put the file in <code>public/uploads/</code> and redeploy. JPG or WebP, at least 1200px wide.</span>
        ${field("imageAlt", "Alt text (required with an image)", exercise.imageAlt, 'placeholder="Describe the movement for screen readers"')}
        ${field("videoUrl", "Video URL (optional)", exercise.videoUrl, 'placeholder="Leave empty if none — never invent a URL"')}
      </div>
      ${listEditor(...LISTS[2], exercise.mistakes)}
      <div class="card stack" style="padding:20px">
        <div class="card-title" style="font-size:16px">Setup and safety</div>
        <label class="field" style="gap:7px"><span class="label">Setup</span><textarea class="textarea" name="setup">${esc(exercise.setup)}</textarea></label>
        <label class="field" style="gap:7px"><span class="label">Safety note</span><textarea class="textarea" name="safetyNotes">${esc(exercise.safetyNotes)}</textarea></label>
      </div>
    </div>
  </form>`;
}

const PAGE_HTML = { dashboard: dashboardHtml, exercises: exercisesHtml, categories: categoriesHtml, plans: plansHtml, users: usersHtml, editor: editorHtml };
const NEEDS = { dashboard: ["stats"], exercises: ["exercises", "categories"], categories: ["categories"], plans: ["templates"], users: ["users"], editor: ["categories"] };
const SOURCES = { stats: "/api/admin/stats", exercises: "/api/admin/exercises", categories: "/api/admin/categories", templates: "/api/admin/templates", users: "/api/admin/users" };

async function ensure(keys, fresh = false) {
  await Promise.all(keys.filter((key) => fresh || !data[key]).map(async (key) => {
    const body = await api.get(SOURCES[key]);
    data[key] = key === "stats" ? body : body[key];
  }));
}

function shell() {
  const nav = [
    ["Overview", [["dashboard", "Dashboard"]]],
    ["Content", [["exercises", "Exercises", data.exercises?.length], ["categories", "Categories", data.categories?.length], ["plans", "Plan templates", data.templates?.length]]],
    ...(user.role === "admin" ? [["People", [["users", "Users", data.users?.length]]]] : []),
  ];
  const active = state.page === "editor" ? "exercises" : state.page;
  const page = PAGES[state.page];
  const sub = state.page === "editor" ? (state.editing._id ? state.editing.name : "New exercise") : page.sub;
  root.innerHTML = `<div class="admin-shell">
    <aside class="admin-side">
      ${brand()}
      <nav class="admin-nav" aria-label="Back office">${nav.map(([title, items]) => `<div class="admin-group"><div class="admin-group-title">${title}</div>${items.map(([id, label, count]) => `<button type="button" class="admin-link${active === id ? " is-on" : ""}" data-action="go" data-page="${id}"${active === id ? ' aria-current="page"' : ""}><span>${label}</span>${count != null ? `<span class="admin-count">${count}</span>` : ""}</button>`).join("")}</div>`).join("")}</nav>
      <div class="admin-who"><span class="avatar" aria-hidden="true">${esc(user.name[0].toUpperCase())}</span><span style="flex:1;min-width:0"><span style="display:block;font-size:13px;font-weight:700">${esc(user.name)}</span><span style="display:block;font-size:11.5px;color:var(--faint)">${user.role === "admin" ? "Administrator" : "Editor"}</span></span></div>
    </aside>
    <div class="admin-main">
      <div class="admin-top">
        <div style="min-width:0"><div class="admin-title">${page.title}</div><div class="hint" style="margin-top:1px">${esc(sub)}</div></div>
        <span class="spacer"></span>
        ${FILTERS[state.page] || ["categories", "plans"].includes(state.page) ? `<input class="input" id="search" type="search" placeholder="Search…" value="${esc(state.search)}" style="max-width:240px;min-height:42px" aria-label="Search">` : ""}
        ${page.action ? `<button type="button" class="btn btn-primary" data-action="${page.action[1]}" style="padding:0 18px;min-height:44px;border-radius:12px;font-size:13.5px;box-shadow:none">${page.action[0]}</button>` : ""}
        <a class="btn btn-secondary" href="/" style="padding:0 16px;min-height:44px;border-radius:12px;font-size:13.5px">View site</a>
      </div>
      <main class="admin-content" id="content">${PAGE_HTML[state.page]()}</main>
    </div>
  </div>`;
  $("#search")?.addEventListener("input", (event) => {
    state.search = event.target.value;
    $("#content").innerHTML = PAGE_HTML[state.page]();
  });
}

async function go(page, { fresh = false } = {}) {
  try {
    await ensure(NEEDS[page], fresh);
    if (page !== state.page) { state.filter = "All"; state.search = ""; }
    state.page = page;
    shell();
    window.scrollTo({ top: 0 });
  } catch (error) { toast(error.message, { error: true }); }
}

function readExerciseForm() {
  const form = $("#exerciseForm");
  const values = Object.fromEntries(new FormData(form));
  const csv = (value) => String(value || "").split(",").map((entry) => entry.trim()).filter(Boolean);
  const list = (key) => [...form.querySelectorAll(`[data-list="${key}"] [data-items] input`)].map((input) => input.value.trim()).filter(Boolean);
  return {
    ...values,
    sets: Number(values.sets), restSec: Number(values.restSec),
    published: form.elements.published.checked,
    secondaryMuscles: csv(values.secondaryMuscles), equipTags: csv(values.equipTags), alternatives: csv(values.alternatives),
    cues: list("cues"), instructions: list("instructions"), mistakes: list("mistakes"),
  };
}

async function saveExercise() {
  const form = $("#exerciseForm");
  if (!form.reportValidity()) return;
  const body = readExerciseForm();
  if (body.image && !body.imageAlt) { toast("Add alt text for the image", { error: true }); return; }
  try {
    const id = state.editing._id;
    const { exercise } = id ? await api.patch(`/api/admin/exercises/${id}`, body) : await api.post("/api/admin/exercises", body);
    state.editing = exercise;
    data.exercises = null;
    toast(`${exercise.name} saved`);
    await go("exercises", { fresh: true });
  } catch (error) { toast(error.message, { error: true }); }
}

function openCategory(category) {
  const dialog = $("#categoryDialog");
  dialog.innerHTML = `<form id="categoryForm" class="stack" style="--gap:12px">
    <h2 id="categoryTitle" class="card-title">${category._id ? `Edit ${esc(category.name)}` : "New category"}</h2>
    <label class="field"><span class="label">Name</span><input class="input" name="name" value="${esc(category.name || "")}" required maxlength="60"></label>
    <label class="field"><span class="label">URL slug</span><input class="input" name="slug" value="${esc(category.slug || "")}" required pattern="[a-z0-9\\-]+" maxlength="60"></label>
    <label class="field"><span class="label">Blurb</span><textarea class="textarea" name="blurb" maxlength="400">${esc(category.blurb || "")}</textarea></label>
    <label class="field"><span class="label">Image path (optional)</span><input class="input" name="image" value="${esc(category.image || "")}" placeholder="/uploads/….jpg"></label>
    <label class="check" style="align-items:center"><input type="checkbox" name="published"${category.published !== false ? " checked" : ""}>Published</label>
    <div class="row"><button type="submit" class="btn btn-primary" style="box-shadow:none">Save</button><button type="button" class="btn btn-secondary" data-action="closeDialog">Cancel</button>${category._id ? `<button type="button" class="btn btn-danger" data-action="deleteCategory" data-id="${category._id}">Delete</button>` : ""}</div>
  </form>`;
  dialog.showModal();
  $("#categoryForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = { ...Object.fromEntries(new FormData(event.target)), published: event.target.elements.published.checked };
    try {
      if (category._id) await api.patch(`/api/admin/categories/${category._id}`, body); else await api.post("/api/admin/categories", body);
      dialog.close();
      data.exercises = null;
      toast("Category saved");
      await go("categories", { fresh: true });
    } catch (error) { toast(error.message, { error: true }); }
  });
}

const BLANK_EXERCISE = { name: "", slug: "", category: "", kit: "tools", level: "LOW", trainingType: "Push", sets: 3, reps: "8-12", rest: "90 sec", restSec: 90, muscles: "", primaryMuscle: "", secondaryMuscles: [], equipment: "", equipTags: [], alternatives: [], cues: [""], instructions: [], mistakes: [], setup: "", safetyNotes: "", image: "", imageAlt: "", videoUrl: "", published: true };

onAction(root, {
  go: ({ page }) => go(page, { fresh: page === "dashboard" }),
  filter: ({ value }) => { state.filter = value; $("#content").innerHTML = PAGE_HTML[state.page](); },
  newExercise: async () => { await ensure(["categories"]); state.editing = { ...BLANK_EXERCISE, category: data.categories[0]?.slug || "" }; go("editor"); },
  editExercise: ({ id }) => { state.editing = structuredClone(data.exercises.find((exercise) => exercise._id === id)); go("editor"); },
  saveExercise,
  deleteExercise: async () => {
    if (!confirm(`Delete ${state.editing.name}? This cannot be undone.`)) return;
    try { await api.delete(`/api/admin/exercises/${state.editing._id}`); toast("Exercise deleted"); await go("exercises", { fresh: true }); } catch (error) { toast(error.message, { error: true }); }
  },
  addItem: ({ list }) => { $(`[data-list="${list}"] [data-items]`).insertAdjacentHTML("beforeend", listRow()); $(`[data-list="${list}"] [data-items] .list-row:last-child input`).focus(); },
  removeItem: (_data, button) => button.closest(".list-row").remove(),
  newCategory: () => openCategory({}),
  editCategory: ({ id }) => openCategory(data.categories.find((category) => category._id === id)),
  deleteCategory: async ({ id }) => {
    if (!confirm("Delete this category?")) return;
    try { await api.delete(`/api/admin/categories/${id}`); $("#categoryDialog").close(); toast("Category deleted"); await go("categories", { fresh: true }); } catch (error) { toast(error.message, { error: true }); }
  },
  closeDialog: (_data, button) => button.closest("dialog").close(),
  togglePlan: async ({ id }) => {
    const plan = data.templates.find((entry) => entry._id === id);
    try { await api.patch(`/api/admin/templates/${id}`, { published: !plan.published }); await go("plans", { fresh: true }); } catch (error) { toast(error.message, { error: true }); }
  },
  toggleUser: async ({ id }) => {
    const member = data.users.find((entry) => entry._id === id);
    const status = member.status === "active" ? "disabled" : "active";
    if (status === "disabled" && !confirm(`Disable ${member.name}? They are signed out and cannot sign in.`)) return;
    try { await api.patch(`/api/admin/users/${id}`, { status }); await go("users", { fresh: true }); } catch (error) { toast(error.message, { error: true }); }
  },
});

root.addEventListener("submit", (event) => {
  if (event.target.id === "exerciseForm") { event.preventDefault(); saveExercise(); }
});
root.addEventListener("change", async (event) => {
  const id = event.target.dataset.roleFor;
  if (!id) return;
  try { await api.patch(`/api/admin/users/${id}`, { role: event.target.value }); toast("Role updated"); await go("users", { fresh: true }); } catch (error) { toast(error.message, { error: true }); }
});

loadMe().then((me) => {
  user = me;
  if (!user) { goToPage("/account?next=/admin"); return; }
  if (!["editor", "admin"].includes(user.role)) return showFatal(root, "Your account does not have access to the back office.");
  go("dashboard");
});
