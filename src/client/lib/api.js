import { appToken, isNativeApp, serverUrl } from "./native.js";

// Requests that end the session: the app forgets its token when they succeed.
const ENDS_SESSION = ["/api/auth/signout", "/api/account/signout-everywhere", "/api/account/delete"];

function appHeaders() {
  if (!isNativeApp) return {};
  const token = appToken.get();
  return { "X-Client": "android", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export async function request(url, options = {}) {
  const { body, ...rest } = options;
  const response = await fetch(serverUrl(url), {
    credentials: isNativeApp ? "omit" : "same-origin",
    ...rest,
    headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...appHeaders(), ...(rest.headers || {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (isNativeApp) {
    if (data.token) appToken.set(data.token);
    if (response.ok && ENDS_SESSION.includes(url)) appToken.clear();
  }
  if (!response.ok) throw Object.assign(new Error(data.error || "Request failed"), { status: response.status, body: data });
  return data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body = {}) => request(url, { method: "POST", body }),
  patch: (url, body = {}) => request(url, { method: "PATCH", body }),
  delete: (url, body) => request(url, { method: "DELETE", body }),
};

let catalogPromise = null;
// Categories, exercises and plan templates: shared by every public page, fetched once per page load.
export function loadCatalog() {
  catalogPromise ||= api.get("/api/catalog").then((data) => {
    const bySlug = Object.fromEntries(data.exercises.map((exercise) => [exercise.slug, exercise]));
    return { ...data, bySlug };
  });
  return catalogPromise;
}

export async function loadMe() {
  try {
    const { user } = await api.get("/api/auth/me");
    if (!user && isNativeApp) appToken.clear(); // expired or revoked token
    return user;
  } catch { return null; }
}
