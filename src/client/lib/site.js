import { esc, join } from "./dom.js";
import { targetFor, BACK_VIEW } from "./muscle-map.js";

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const DISCLAIMER = "This training program is designed for general fitness education. Start with manageable weights, prioritize controlled technique, and stop if you experience sharp or unusual pain. Consult a qualified professional if you have an injury, medical condition, or are unsure whether an exercise is appropriate for you.";

export const brand = (href = "/") => `<a class="brand" href="${href}"><span class="brand-mark" aria-hidden="true">G</span>Groundwork</a>`;

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
