import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { api } from "./services/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setAuthed] = useState(Boolean(localStorage.getItem("access_token")));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.me().then((data) => setUser(data.user)).catch(() => {
      localStorage.removeItem("access_token");
      setAuthed(false);
      setUser(null);
    });
  }, [isAuthenticated]);

  async function login(username, password) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Falha ao fazer login");
  }

  const data = await res.json();
  localStorage.setItem("access_token", data.access_token);
  setAuthed(true);
  return data;
}


  function logout() {
    localStorage.removeItem("access_token");
    setAuthed(false);
    setUser(null);
  }

  const value = useMemo(() => ({ isAuthenticated, user, login, logout }), [isAuthenticated, user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
