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
    // se o backend usa cookie de sessão, mantenha:
    credentials: options.credentials ?? "omit",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }
  return res.json();
}

// helper de querystring
function qs(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
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
  players: (params = {}) => http(`/api/players${qs(params)}`),
  transactions: (params = {}) => http(`/api/transactions${qs(params)}`),
  merchants: (params = {}) => http(`/api/merchants${qs(params)}`),

  // 🔹 novos: KPIs por perfil
  kpisCeo: (params = {}) => http(`/api/kpis/ceo${qs(params)}`),
  kpisCfo: (params = {}) => http(`/api/kpis/cfo${qs(params)}`),
};
