import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { loginRequest, registerRequest } from '../services/authService';
import { onAuthExpired, getErrorMessage } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // "userId" é o ID numérico (Long) do usuário, devolvido no corpo do
  // login (ver src/services/authService.js) e usado como {idUsuario}
  // em todas as rotas de arquivo.
  const [userId, setUserId] = useState(() => localStorage.getItem(STORAGE_KEYS.USER_ID));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem(STORAGE_KEYS.USER_EMAIL));
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(false);
  const expiryTimer = useRef(null);

  const isAuthenticated = Boolean(token && userId);

  const logout = useCallback((message) => {
    if (expiryTimer.current) clearTimeout(expiryTimer.current);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
    setToken(null);
    setUserId(null);
    setUserEmail(null);
    if (message) toast.error(message);
  }, []);

  // Reage a 401/403 disparados pelo interceptor do Axios em qualquer
  // chamada da aplicação (ex.: token expirou no meio da navegação).
  useEffect(() => {
    return onAuthExpired((e) => {
      logout(e.detail?.message ?? 'Sessão expirada. Faça login novamente.');
    });
  }, [logout]);

  // Agenda o logout automático com base em "expireIn" (ms) devolvido no
  // login, e também recalcula ao recarregar a página (a partir do
  // timestamp salvo no localStorage).
  const scheduleExpiry = useCallback(
    (expiresAt) => {
      if (expiryTimer.current) clearTimeout(expiryTimer.current);
      const msRemaining = expiresAt - Date.now();
      if (msRemaining <= 0) {
        logout('Sua sessão expirou. Faça login novamente.');
        return;
      }
      expiryTimer.current = setTimeout(() => {
        logout('Sua sessão expirou. Faça login novamente.');
      }, msRemaining);
    },
    [logout]
  );

  useEffect(() => {
    const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT));
    if (token && expiresAt) scheduleExpiry(expiresAt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, senha) {
    setLoading(true);
    try {
      const { token: newToken, expireIn, userId: newUserId } = await loginRequest(email, senha);

      if (!newToken) {
        toast.error('A API não retornou um token de acesso válido.');
        return false;
      }
      if (newUserId === undefined) {
        toast.error(
          'Login feito, mas a API não retornou o ID do usuário. Veja o console para depurar.'
        );
        return false;
      }

      const expiresAt = Date.now() + (Number(expireIn) || 15 * 60 * 1000);

      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER_ID, String(newUserId));
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, String(expiresAt));

      setToken(newToken);
      setUserId(String(newUserId));
      setUserEmail(email);
      scheduleExpiry(expiresAt);

      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível entrar. Verifique suas credenciais.'));
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(nome, email, senha) {
    setLoading(true);
    try {
      await registerRequest(nome, email, senha);
      toast.success('Cadastro realizado! Agora faça login.');
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível concluir o cadastro.'));
      return false;
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({ userId, userEmail, token, isAuthenticated, loading, login, register, logout }),
    [userId, userEmail, token, isAuthenticated, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
