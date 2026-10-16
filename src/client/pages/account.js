import "../styles.css";
import { api, loadCatalog, loadMe } from "../lib/api.js";
import { $, esc, onAction, toast } from "../lib/dom.js";
import { header, showFatal } from "../lib/site.js";

const root = $("#root");
const NOTIFICATIONS = [
  ["reminders", "Workout reminders", "On your training days, at a time you choose"],
  ["digest", "Weekly progress digest", "Sunday evening summary of the week"],
  ["newContent", "New exercises and plans", "When the library gains something relevant"],
  ["product", "Product and account email", "Security notices are always sent"],
];
const CM_PER_IN = 2.54;
const LB_PER_KG = 2.20462;

let user = null;
let exerciseCount = 0;
let screen = "login";
let busy = false;

const round1 = (value) => Math.round(value * 10) / 10;
const imperial = () => user.profile.units === "imperial";

function authScreen() {
  const isRegister = screen === "register";
  const fields = isRegister
    ? [["name", "Display name", "text", "Sam", "name"], ["email", "Email", "email", "you@example.com", "email"], ["password", "Password", "password", "At least 10 characters", "new-password"]]
    : [["email", "Email", "email", "you@example.com", "email"], ["password", "Password", "password", "••••••••", "current-password"]];
  const sell = [
    `${exerciseCount || "Dozens of"} exercises with cues, mistakes and no-equipment alternatives.`,
    "A week built around the days you can actually train.",
    "Rest timer and set logging that work without signal.",
    "Progress charts you own — export or delete them any time.",
  ];
  return `<div class="auth-shell">
    <div class="auth-form-side">
      <form class="auth-form" id="authForm" novalidate>
        <div>
          <h1>${isRegister ? "Create your account" : "Welcome back"}</h1>
          <p class="muted" style="font-size:15px;line-height:1.5">${isRegister ? "Free, no card, no ads. Takes about thirty seconds." : "Pick up where your last session left off."}</p>
        </div>
        <div class="stack">${fields.map(([name, label, type, placeholder, autocomplete]) => `<label class="field"><span class="label">${label}</span><input class="input" name="${name}" type="${type}" placeholder="${placeholder}" autocomplete="${autocomplete}" required${name === "password" && isRegister ? ' minlength="10"' : ""}>${name === "password" && isRegister ? '<span class="hint">Ten characters minimum. A passphrase beats a complicated short password.</span>' : ""}</label>`).join("")}</div>
        ${isRegister ? `<label class="check check-box"><input type="checkbox" name="acceptDisclaimer" required><span>I have read the training disclaimer, the terms and the privacy policy. I understand this is general fitness education, not medical advice.</span></label>` : ""}
        <label class="check" style="align-items:center;font-size:13.5px"><input type="checkbox" name="keep" style="width:18px;height:18px"${isRegister ? "" : " checked"}>Keep me signed in</label>
        <div id="authError" class="alert alert-error hidden" role="alert"></div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" style="justify-content:center"${busy ? " disabled" : ""}>${isRegister ? "Create account" : "Sign in"}</button>
        <div style="font-size:14px;color:var(--dim);text-align:center">${isRegister ? "Already have an account? " : "New here? "}<button type="button" class="link-btn" data-action="screen" data-screen="${isRegister ? "login" : "register"}">${isRegister ? "Sign in" : "Create an account"}</button></div>
        ${isRegister ? "" : `<p class="hint" style="text-align:center">Forgot your password? Contact the site administrator to reset it.</p>`}
      </form>
    </div>
    <div class="auth-sell"><div class="auth-sell-in">
      <span class="glass-tag">Free forever</span>
      <div class="auth-sell-title">Your plan, your progress, on every device you own.</div>
      <div class="stack">${sell.map((point) => `<div class="sell-point">${esc(point)}</div>`).join("")}</div>
    </div></div>
  </div>`;
}

function accountScreen() {
  const since = new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const height = user.profile.heightCm ? (imperial() ? round1(user.profile.heightCm / CM_PER_IN) : user.profile.heightCm) : "";
  const weight = user.profile.weightKg ? (imperial() ? round1(user.profile.weightKg * LB_PER_KG) : user.profile.weightKg) : "";
  return `<main class="wrap" style="padding-top:34px;padding-bottom:60px">
    <h1 style="font-size:clamp(28px,4.4vw,40px);letter-spacing:-0.03em;margin-bottom:6px">My account</h1>
    <p class="muted" style="font-size:15px;margin-bottom:26px">Signed in as ${esc(user.email)} · member since ${esc(since)}</p>
    <div class="grid" style="--min:300px;--gap:16px;align-items:start">
      <form class="card card-pad stack" id="profileForm" style="--gap:16px">
        <div class="card-title">Profile</div>
        <div class="row" style="gap:14px"><span class="avatar" aria-hidden="true">${esc(user.name.slice(0, 1).toUpperCase())}</span><span class="badge badge-blue">${esc(user.role === "member" ? "Member" : user.role === "editor" ? "Editor" : "Administrator")}</span></div>
        <label class="field"><span class="label">Display name</span><input class="input" name="name" value="${esc(user.name)}" maxlength="80" required autocomplete="name"></label>
        <label class="field"><span class="label">Email</span><input class="input" value="${esc(user.email)}" readonly></label>
        <label class="field"><span class="label">Timezone</span><input class="input" name="timezone" value="${esc(user.timezone)}" list="timezones" autocomplete="off"></label>
        <datalist id="timezones">${(Intl.supportedValuesOf?.("timeZone") || []).map((zone) => `<option value="${esc(zone)}"></option>`).join("")}</datalist>
        <button type="submit" class="btn btn-primary btn-block btn-lg" style="justify-content:center">Save changes</button>
      </form>

      <div class="stack" style="--gap:16px">
        <div class="card card-pad stack" style="--gap:16px">
          <div class="card-title">Training preferences</div>
          <div><div class="label" style="margin-bottom:9px">Units</div>
            <div class="seg" role="group" aria-label="Units">${[["metric", "kg / cm"], ["imperial", "lb / in"]].map(([value, label]) => `<button type="button" class="${user.profile.units === value ? "is-on" : ""}" data-action="units" data-value="${value}" aria-pressed="${user.profile.units === value}">${label}</button>`).join("")}</div>
          </div>
          <form id="bodyForm" class="grid" style="--min:130px;--gap:12px">
            <label class="field"><span class="label">Height (${imperial() ? "in" : "cm"})</span><input class="input" name="height" inputmode="decimal" value="${esc(height)}"></label>
            <label class="field"><span class="label">Weight (${imperial() ? "lb" : "kg"})</span><input class="input" name="weight" inputmode="decimal" value="${esc(weight)}"></label>
          </form>
          <div><div class="label" style="margin-bottom:9px">Sessions per week</div>
            <div class="row" style="--gap:8px">${[2, 3, 5].map((count) => `<button type="button" class="chip${user.profile.sessionsPerWeek === count ? " is-on" : ""}" data-action="sessions" data-value="${count}" style="min-height:40px;padding:9px 16px" aria-pressed="${user.profile.sessionsPerWeek === count}">${count}</button>`).join("")}</div>
          </div>
        </div>
        <div class="card card-pad stack">
          <div class="card-title">Notifications</div>
          ${NOTIFICATIONS.map(([key, title, sub]) => `<div class="notif-row"><span><span style="display:block;font-size:14.5px;font-weight:600">${title}</span><span class="hint" style="display:block;margin-top:2px">${sub}</span></span><button type="button" class="switch" role="switch" aria-checked="${Boolean(user.notifications[key])}" aria-label="${title}" data-action="notify" data-key="${key}"></button></div>`).join("")}
          <p class="hint">Email delivery is being set up; your choices are saved for when it starts.</p>
        </div>
      </div>

      <div class="stack" style="--gap:16px">
        <div class="card card-pad stack">
          <div class="card-title">Security</div>
          <button type="button" class="btn btn-secondary btn-block" data-action="openPassword">Change password</button>
          <button type="button" class="btn btn-secondary btn-block" data-action="signout">Sign out</button>
          <div class="hint">Signed in on another device? <button type="button" class="link-btn" data-action="signoutEverywhere" style="font-size:12.5px">Sign out everywhere</button></div>
        </div>
        <div class="card card-pad stack">
          <div class="card-title">Your data</div>
          <a class="btn btn-secondary btn-block" href="/api/account/export" download>Export everything (JSON)</a>
          <div class="hint">Your account, plans, logged sets and measurements, downloaded right away.</div>
        </div>
        ${["editor", "admin"].includes(user.role) ? `<a class="card card-pad" href="/admin" style="gap:6px"><span class="card-title">Back office</span><span class="hint">Edit exercises, categories and plans.</span></a>` : ""}
        <div class="danger-card">
          <div class="card-title">Delete account</div>
          <div style="font-size:13.5px;color:var(--dim);line-height:1.55">Permanently removes your plans, training history and measurements. This cannot be undone.</div>
          <button type="button" class="btn btn-danger btn-block" data-action="openDelete" style="justify-content:center">Delete my account</button>
        </div>
      </div>
    </div>
  </main>
  <dialog id="passwordDialog" class="dialog" aria-labelledby="passwordTitle">
    <form id="passwordForm" class="stack">
      <h2 id="passwordTitle" class="card-title">Change password</h2>
      <label class="field"><span class="label">Current password</span><input class="input" type="password" name="currentPassword" autocomplete="current-password" required></label>
      <label class="field"><span class="label">New password</span><input class="input" type="password" name="newPassword" autocomplete="new-password" minlength="10" required><span class="hint">Ten characters minimum. Other devices are signed out.</span></label>
      <div id="passwordError" class="alert alert-error hidden" role="alert"></div>
      <div class="row"><button type="submit" class="btn btn-primary">Update password</button><button type="button" class="btn btn-secondary" data-action="closeDialog">Cancel</button></div>
    </form>
  </dialog>
  <dialog id="deleteDialog" class="dialog" aria-labelledby="deleteTitle">
    <form id="deleteForm" class="stack">
      <h2 id="deleteTitle" class="card-title" style="color:var(--red)">Delete your account?</h2>
      <p class="muted" style="font-size:14px;line-height:1.55">Your plans, logged workouts and measurements are deleted immediately. Enter your password to confirm.</p>
      <label class="field"><span class="label">Password</span><input class="input" type="password" name="password" autocomplete="current-password" required></label>
      <div id="deleteError" class="alert alert-error hidden" role="alert"></div>
      <div class="row"><button type="submit" class="btn btn-danger">Delete permanently</button><button type="button" class="btn btn-secondary" data-action="closeDialog">Cancel</button></div>
    </form>
  </dialog>`;
}

function render() {
  const links = [["Exercises", "/#library"], ["Plans", "/plans"]];
  root.innerHTML = `${header({ user, links, current: "/account" })}${user ? accountScreen() : authScreen()}`;
  bindForms();
}

function showError(id, message) {
  const node = $(id);
  node.textContent = message;
  node.classList.remove("hidden");
}

async function saveProfile(patch, message = "Saved") {
  try {
    user = (await api.patch("/api/account", patch)).user;
    toast(message);
    return true;
  } catch (error) {
    toast(error.message, { error: true });
    return false;
  }
}

function bindForms() {
  $("#authForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const body = { ...data, keep: Boolean(data.keep), acceptDisclaimer: Boolean(data.acceptDisclaimer) };
    busy = true;
    form.querySelector('[type="submit"]').disabled = true;
    try {
      await api.post(screen === "register" ? "/api/auth/register" : "/api/auth/signin", body);
      const next = new URLSearchParams(location.search).get("next");
      location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/app";
    } catch (error) {
      busy = false;
      form.querySelector('[type="submit"]').disabled = false;
      showError("#authError", error.message);
    }
  });

  $("#profileForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    if (await saveProfile({ name: data.name, timezone: data.timezone })) render();
  });

  $("#bodyForm")?.addEventListener("change", async (event) => {
    const value = event.target.value.trim();
    const number = value === "" ? "" : Number(value);
    if (value !== "" && !(number > 0)) { toast("Enter a positive number", { error: true }); return; }
    const profile = event.target.name === "height"
      ? { heightCm: number === "" ? "" : round1(imperial() ? number * CM_PER_IN : number) }
      : { weightKg: number === "" ? "" : round1(imperial() ? number / LB_PER_KG : number) };
    await saveProfile({ profile });
  });

  $("#passwordForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api.post("/api/account/password", Object.fromEntries(new FormData(event.target)));
      $("#passwordDialog").close();
      toast("Password updated. Other devices are signed out.");
    } catch (error) { showError("#passwordError", error.message); }
  });

  $("#deleteForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api.post("/api/account/delete", Object.fromEntries(new FormData(event.target)));
      location.href = "/";
    } catch (error) { showError("#deleteError", error.message); }
  });
}

onAction(root, {
  screen: ({ screen: next }) => { screen = next; history.replaceState(null, "", next === "register" ? "#register" : "#signin"); render(); $("input")?.focus(); },
  units: async ({ value }) => { if (await saveProfile({ profile: { units: value } })) render(); },
  sessions: async ({ value }) => { if (await saveProfile({ profile: { sessionsPerWeek: Number(value) } })) render(); },
  notify: async ({ key }, button) => {
    const next = button.getAttribute("aria-checked") !== "true";
    button.setAttribute("aria-checked", String(next));
    if (!(await saveProfile({ notifications: { [key]: next } }))) button.setAttribute("aria-checked", String(!next));
  },
  openPassword: () => { $("#passwordForm").reset(); $("#passwordError").classList.add("hidden"); $("#passwordDialog").showModal(); },
  openDelete: () => { $("#deleteForm").reset(); $("#deleteError").classList.add("hidden"); $("#deleteDialog").showModal(); },
  closeDialog: (_data, button) => button.closest("dialog").close(),
  signout: async () => { await api.post("/api/auth/signout").catch(() => {}); location.href = "/"; },
  signoutEverywhere: async () => {
    if (!confirm("Sign out on every device, including this one?")) return;
    try { await api.post("/api/account/signout-everywhere"); location.href = "/account"; } catch (error) { toast(error.message, { error: true }); }
  },
});

screen = location.hash === "#register" ? "register" : "login";
Promise.all([loadMe(), loadCatalog().catch(() => null)])
  .then(([me, catalog]) => { user = me; exerciseCount = catalog?.exercises.length || 0; render(); })
  .catch(() => showFatal(root, "Your account could not be loaded. Refresh the page to try again."));
