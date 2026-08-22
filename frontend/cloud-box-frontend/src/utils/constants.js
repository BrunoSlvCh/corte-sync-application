// Chaves usadas no localStorage.
// Centralizadas aqui para nao espalhar strings magicas pelo projeto.
export const STORAGE_KEYS = {
  TOKEN: 'cloudbox_token',
  USER_ID: 'cloudbox_user_id',
  USER_EMAIL: 'cloudbox_user_email',
  TOKEN_EXPIRES_AT: 'cloudbox_token_expires_at',
  THEME: 'cloudbox_theme',
};

// Precisa ficar em sincronia com o limite do backend
// (spring.servlet.multipart.max-file-size / max-request-size = 50MB).
// Validar no front evita gastar tempo de upload de um arquivo que o
// backend certamente vai rejeitar com 413 Payload Too Large.
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
