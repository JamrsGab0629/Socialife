// Centralized Fetch API helper.
// - Uses HTTP-only cookies for auth (credentials: "include")
// - Never stores JWTs in localStorage/sessionStorage
// - Parses JSON automatically and normalizes errors

const BASE_URL = ""; // set to your API origin, e.g. "https://api.socialife.app"

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const apiFetch = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),

  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: "DELETE" })
};
