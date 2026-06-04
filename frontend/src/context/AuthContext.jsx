import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");

  return {
    token,
    user: rawUser ? JSON.parse(rawUser) : null
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);
  const [authLoading, setAuthLoading] = useState(false);

  const persistAuth = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  };

  const register = async (payload) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      persistAuth(data);
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (payload) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      persistAuth(data);
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      authLoading,
      register,
      login,
      logout
    }),
    [auth, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
