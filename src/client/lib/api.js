export async function request(url, options = {}) {
  const { body, ...rest } = options;
  const response = await fetch(url, {
    credentials: "same-origin",
    ...rest,
    headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(rest.headers || {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
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
  try { return (await api.get("/api/auth/me")).user; } catch { return null; }
}
