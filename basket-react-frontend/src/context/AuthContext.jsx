import { createContext, useContext, useState, useCallback } from "react";
import { loginUser, registerUser, refreshToken as refreshTokenApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || "");
  const [lastResponse, setLastResponse] = useState(null);

  const persist = (uname, access, refresh) => {
    if (uname) localStorage.setItem("username", uname);
    if (access) localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
    setUsername(uname || "");
    setAccessToken(access || "");
  };

  const register = useCallback(async (uname, pwd) => {
    const res = await registerUser(uname, pwd);
    setLastResponse(res);
    return res;
  }, []);

  const login = useCallback(async (uname, pwd) => {
    const res = await loginUser(uname, pwd);
    setLastResponse(res);
    if (res.ok) {
      persist(uname, res.data?.access_token, res.data?.refrash_token);
    }
    return res;
  }, []);

  const refresh = useCallback(async () => {
    const res = await refreshTokenApi();
    setLastResponse(res);
    if (res.ok) {
      persist(username, res.data?.new_access_token, null);
    }
    return res;
  }, [username]);

  const logout = useCallback(() => {
    localStorage.removeItem("username");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUsername("");
    setAccessToken("");
  }, []);

  return (
    <AuthContext.Provider
      value={{ username, accessToken, lastResponse, register, login, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
