// src/context/AuthContext.jsx

// IMPORTACIONS
import { createContext, useEffect, useState } from "react";
import api from "../services/api";

// CONTEXT
export const AuthContext = createContext();

// PROVIDER
export function AuthProvider({ children }) {
  // ESTATS
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CARREGAR USUARI (CHECK TOKEN)
  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    
    try {
      const res = await api.get("/profile");
      setUser(res.data.data);
    } catch (err) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  // RENDERITZAT
  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}