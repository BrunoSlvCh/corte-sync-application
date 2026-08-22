import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

// URL base vinda do .env (VITE_API_BASE_URL). Ver .env.example.
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
});

// --- Interceptor de requisição ---------------------------------------
// Injeta o header "Authorization: Bearer <token>" em toda chamada,
// exceto quando a rota explicitamente marcar { skipAuth: true }.
api.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Tratamento centralizado de erros ---------------------------------
// Qualquer componente pode "escutar" esses eventos (ex.: para disparar
// toasts) sem precisar duplicar lógica de status HTTP em cada chamada.
const AUTH_EXPIRED_EVENT = 'cloudbox:auth-expired';

export function onAuthExpired(callback) {
  window.addEventListener(AUTH_EXPIRED_EVENT, callback);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, callback);
}

/**
 * Extrai uma mensagem legível do erro do Axios, cobrindo os formatos mais
 * comuns que uma API Spring Boot costuma devolver.
 *
 * Ajuste esta função se o seu backend padronizar o corpo de erro de forma
 * diferente (ex.: { erro: "..." } ou { errors: [...] }).
 */
export function getErrorMessage(error, fallback = 'Ocorreu um erro inesperado.') {
  const data = error?.response?.data;

  // Formato real do Cloud Box: { "erro": "Erro interno no servidor: ..." }
  if (data?.erro) return data.erro;
  if (typeof data === 'string' && data.trim().length > 0) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.message ?? e).join(' | ');
  }
  if (error?.message === 'Network Error') {
    return 'Não foi possível conectar à API. Verifique sua conexão ou o CORS do servidor.';
  }
  return fallback;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Sessão expirada ou sem permissão: limpa credenciais locais e avisa
      // o app (AuthContext escuta esse evento para redirecionar ao login).
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
      window.dispatchEvent(
        new CustomEvent(AUTH_EXPIRED_EVENT, {
          detail: { status, message: getErrorMessage(error, 'Sessão expirada.') },
        })
      );
    }

    return Promise.reject(error);
  }
);
