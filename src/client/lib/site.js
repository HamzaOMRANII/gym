import { esc, join } from "./dom.js";
import { isNativeApp } from "./native.js";
import { targetFor, BACK_VIEW } from "./muscle-map.js";

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const DISCLAIMER = "This training program is designed for general fitness education. Start with manageable weights, prioritize controlled technique, and stop if you experience sharp or unusual pain. Consult a qualified professional if you have an injury, medical condition, or are unsure whether an exercise is appropriate for you.";

// Groundwork mark: the Gym logo from the omranisystems.com homepage (white ring, orange S, dumbbell badge).
const MARK = `<svg viewBox="-4 -4 128 128" width="100%" height="100%"><circle cx="60" cy="60" r="46" fill="none" stroke="#FFFFFF" stroke-width="9"/><path d="M116 32H52Q40 32 40 44V48Q40 60 52 60H68Q80 60 80 72V76Q80 88 68 88H4" fill="none" stroke="#0B0D12" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/><path d="M102 32H52Q40 32 40 44V48Q40 60 52 60H68Q80 60 80 72V76Q80 88 68 88H18" fill="none" stroke="#EA580C" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><circle cx="96" cy="96" r="19" fill="#EA580C"/><g fill="#FFFFFF"><rect x="90" y="94" width="12" height="4" rx="2"/><rect x="87" y="90" width="4" height="12" rx="1.6"/><rect x="101" y="90" width="4" height="12" rx="1.6"/><rect x="84" y="92" width="3" height="8" rx="1.4"/><rect x="105" y="92" width="3" height="8" rx="1.4"/></g></svg>`;
export const brand = (href = "/") => `<a class="brand" href="${href}"><span class="brand-mark" aria-hidden="true">${MARK}</span>Groundwork</a>`;

// Sticky site header. `links` are [label, href]; the account link reflects the signed-in user.
export function header({ links = [], cta = ["Training app", "/app"], user = null, current = "" } = {}) {
  const accountLink = user ? ["My account", "/account"] : ["Sign in", "/account"];
  const all = [...links, ...(user && ["editor", "admin"].includes(user.role) ? [["Admin", "/admin"]] : []), accountLink];
  return `<header class="topbar"><div class="topbar-in">
    ${brand()}
    <div class="spacer"></div>
    <nav class="nav rail" aria-label="Main">
      ${all.map(([label, href]) => `<a class="nav-link" href="${esc(href)}"${href === current ? ' aria-current="page"' : ""}>${esc(label)}</a>`).join("")}
      ${cta ? `<a class="nav-cta" href="${esc(cta[1])}">${esc(cta[0])}</a>` : ""}
    </nav>
  </div></header>`;
}

export const disclaimer = () => `<footer class="site-footer"><div class="disclaimer-title">Disclaimer</div><p class="disclaimer-text">${DISCLAIMER}</p></footer>`;

export const levelTag = (level) => `<span class="level lv-${esc(level)}">${esc(level)}</span>`;

// Image on a light plate when the exercise has one, otherwise the muscle map on the dark radial.
export function exerciseArt(exercise, { num = null, level = true, lazy = true } = {}) {
  const target = targetFor(exercise);
  const view = BACK_VIEW.has(target) ? "back" : "front";
  const inner = exercise?.image
    ? `<img src="${esc(exercise.image)}" alt="${esc(exercise.imageAlt || "")}"${lazy ? ' loading="lazy"' : ""}>`
    : `<muscle-map group="${esc(target)}" view="${view}"></muscle-map>`;
  return `<span class="art${exercise?.image ? " has-img" : ""}">${inner}${join([
    num != null && `<span class="art-num">${esc(num)}</span>`,
    level && exercise && levelTag(exercise.level),
  ])}</span>`;
}

export function categoryArt(category) {
  return category.image
    ? `<span class="art has-img cover"><img src="${esc(category.image)}" alt="" loading="lazy"></span>`
    : `<span class="art"><muscle-map group="${esc(category.slug)}"></muscle-map></span>`;
}

export const dose = (sets, reps) => `${sets} × ${reps}`;

export function showFatal(root, message) {
  root.innerHTML = `<div class="wrap section"><div class="empty">${esc(message)}</div></div>`;
}

// "Get the Android app" card (web only). Place appDownloadSlot() in the page, then call mountAppDownload().
export const appDownloadSlot = () => `<div id="appDownload"></div>`;

export async function mountAppDownload() {
  const slot = document.getElementById("appDownload");
  if (!slot || isNativeApp) return;
  let release;
  try {
    const res = await fetch("/download/latest.json", { cache: "no-store" });
    if (!res.ok) return;
    release = await res.json();
  } catch { return; }
  const size = `${Math.round(release.size / (1024 * 1024))} MB`;
  slot.innerHTML = `<div class="card card-pad" style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <img src="/brand/icon.svg?v=2" width="44" height="44" alt="" style="border-radius:12px">
      <div style="flex:1 1 180px;min-width:0">
        <div class="card-title">Groundwork for Android</div>
        <div class="hint">gym.apk · v${esc(release.version)} · ${size}</div>
      </div>
      <a class="btn btn-primary" href="/download/${esc(release.file)}" download style="padding:12px 18px;border-radius:12px;font-size:14px">Download the app</a>
    </div>
    <details class="hint" style="font-size:13.5px;color:var(--dim)">
      <summary style="cursor:pointer;color:var(--accent-text)">How to install without the Play Store</summary>
      <ol style="margin:10px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:6px;line-height:1.5">
        <li>Open this page on your Android phone and tap <strong>Download the app</strong>.</li>
        <li>Open the downloaded file. If Android asks, allow <strong>Install unknown apps</strong> for your browser (Settings → Apps → your browser → Install unknown apps).</li>
        <li>If Play Protect warns about an unknown app, tap <strong>More details → Install anyway</strong>.</li>
        <li>Open Groundwork and sign in with your usual account. You can switch “Install unknown apps” off again afterwards.</li>
      </ol>
      <p style="margin:10px 0 0;word-break:break-all;font-size:11.5px">SHA-256 ${esc(release.sha256)}</p>
    </details>
  </div>`;
}
