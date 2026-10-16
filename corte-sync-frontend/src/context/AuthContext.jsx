import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "").toLowerCase();
const ADMIN_TELEFONE = import.meta.env.VITE_ADMIN_TELEFONE || "";

function readStoredAuth() {
  const raw = localStorage.getItem("bc_auth");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.expireAt && Date.now() > parsed.expireAt) {
      localStorage.removeItem("bc_auth");
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  useEffect(() => {
    if (auth) {
      localStorage.setItem("bc_auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("bc_auth");
    }
  }, [auth]);

  // `loginAs`: 'usuario' (default) or 'barbeiro' — decides which screen the
  // person used to sign in. This only controls which UI the front shows;
  // real permissions are always enforced server-side by Spring Security.
  const login = useCallback(async (identifier, senha, loginAs = "usuario") => {
    const { token, expireIn, id } = await loginUser({ identifier, senha });

    const normalized = identifier.trim().toLowerCase();
    const isAdmin =
      normalized === ADMIN_EMAIL || identifier.trim() === ADMIN_TELEFONE;

    const role = isAdmin ? "ADMIN" : loginAs === "barbeiro" ? "BARBEIRO" : "USUARIO";

    const nextAuth = {
      token,
      id,
      role,
      isAdmin,
      isBarbeiro: role === "BARBEIRO",
      identifier,
      expireAt: Date.now() + (expireIn || 3600000),
    };
    setAuth(nextAuth);
    return nextAuth;
  }, []);

  const register = useCallback(async (payload) => {
    await registerUser(payload);
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, isAuthenticated: !!auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
