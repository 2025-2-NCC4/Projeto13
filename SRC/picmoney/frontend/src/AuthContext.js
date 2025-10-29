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
    const { access_token } = await api.login({ username, password });
    localStorage.setItem("access_token", access_token);
    setAuthed(true);
    return true;
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
