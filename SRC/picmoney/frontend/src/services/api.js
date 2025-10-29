const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("access_token");
}

async function http(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }
  return res.json();
}

export const api = {
  // auth
  login: ({ username, password }) =>
    http("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  me: () => http("/api/auth/me"),

  // já existentes
  health: () => http("/api/health"),
  kpisSummary: () => http("/api/kpis/summary"),
  players: (params = {}) => http(`/api/players?${new URLSearchParams(params)}`),
  transactions: (params = {}) =>
    http(`/api/transactions?${new URLSearchParams(params)}`),
  merchants: (params = {}) =>
    http(`/api/merchants?${new URLSearchParams(params)}`),
};
