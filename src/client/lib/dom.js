const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

// Escapes a value for use inside HTML text or a quoted attribute.
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ESCAPES[char]);

export const $ = (selector, root = document) => root.querySelector(selector);

// Joins template fragments, dropping false/null/undefined so `cond && html` works inline.
export const join = (parts, separator = "") => parts.filter((part) => part !== false && part != null).join(separator);

// Runs a handler for clicks on [data-action] elements inside root.
export function onAction(root, handlers) {
  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target || !root.contains(target)) return;
    const handler = handlers[target.dataset.action];
    if (!handler) return;
    event.preventDefault();
    handler(target.dataset, target, event);
  });
}

let toastTimer = null;
export function toast(message, { error = false } = {}) {
  let node = document.getElementById("toast");
  if (!node) {
    node = Object.assign(document.createElement("div"), { id: "toast", role: "status" });
    node.setAttribute("aria-live", "polite");
    document.body.append(node);
  }
  node.className = `toast${error ? " error" : ""}`;
  node.textContent = message;
  node.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.add("hidden"), 4000);
}

// localStorage can throw (private mode, blocked storage): every access is wrapped.
export const store = {
  get(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw == null ? fallback : JSON.parse(raw); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
  },
};

export const todayISO = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
