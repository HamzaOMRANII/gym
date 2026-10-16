import { Capacitor } from "@capacitor/core";

// True inside the Android app, false in the browser.
export const isNativeApp = Capacitor.isNativePlatform();

// In the browser the pages and the API share gym.omranisystems.com. The app bundles the pages,
// so it calls the API by its full address and signs in with a token instead of the cookie.
export const SERVER_ORIGIN = isNativeApp ? "https://gym.omranisystems.com" : "";
export const serverUrl = (path) => (path.startsWith("/") ? `${SERVER_ORIGIN}${path}` : path);

const TOKEN_KEY = "groundwork.session";
export const appToken = {
  get() { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set(token) { try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage unavailable */ } },
  clear() { try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ } },
};

// The server maps /plans to plans.html; the app's bundled files need the real file names.
const PAGES = new Set(["category", "plans", "app", "account", "admin"]);
export function pageUrl(href) {
  if (!isNativeApp) return href;
  const url = new URL(href, location.origin);
  const name = url.pathname.replace(/^\/|\/$/g, "");
  if (PAGES.has(name)) url.pathname = `/${name}.html`;
  return url.pathname + url.search + url.hash;
}
export const go = (href) => { location.href = pageUrl(href); };

if (isNativeApp) {
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.('a[href^="/"]');
    if (!link || link.hasAttribute("download")) return;
    const href = link.getAttribute("href");
    const target = pageUrl(href);
    if (target !== href) { event.preventDefault(); location.href = target; }
  });
}
