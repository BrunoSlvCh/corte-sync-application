import { api } from './api';

/**
 * POST /v1/auth/register
 * Body: { nome, email, senha }
 */
export async function registerRequest(nome, email, senha) {
  const { data } = await api.post(
    '/v1/auth/register',
    { nome, email, senha },
    { skipAuth: true }
  );
  return data;
}

/**
 * POST /v1/auth/login
 * Body: { email, senha }
 * Retorno: { token, expireIn, id } — expireIn em milissegundos.
 *
 * "id" é o ID numérico (Long) do usuário, usado como {idUsuario} em
 * todas as rotas de arquivo (confirmado: POST /v1/arquivos/novoArquivo/
 * idUsuario/2 usa Long). Aceitamos alguns nomes de campo alternativos
 * (idUsuario, usuarioId, userId) para o caso de você nomear diferente
 * no backend — ajuste ID_FIELD_CANDIDATES abaixo se precisar de outro.
 */
const ID_FIELD_CANDIDATES = ['id', 'idUsuario', 'usuarioId', 'userId'];

export async function loginRequest(email, senha) {
  const { data } = await api.post(
    '/v1/auth/login',
    { email, senha },
    { skipAuth: true }
  );

  let userId;
  for (const key of ID_FIELD_CANDIDATES) {
    if (data?.[key] !== undefined && data?.[key] !== null) {
      userId = data[key];
      break;
    }
  }

  if (userId === undefined) {
    console.warn(
      '[authService] Não encontrei o ID do usuário na resposta do login. Campos esperados:',
      ID_FIELD_CANDIDATES,
      '— resposta recebida:',
      data
    );
  }

  return {
    token: data?.token,
    expireIn: data?.expireIn,
    userId,
    raw: data,
  };
}
