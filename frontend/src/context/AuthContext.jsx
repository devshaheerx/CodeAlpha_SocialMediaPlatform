import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post("/auth/login", { identifier, password });
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setUser(null);
  };

  // Patch the current user locally (e.g. after editing profile or following someone)
  const updateUser = useCallback((patch) => setUser((u) => (u ? { ...u, ...patch } : u)), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
