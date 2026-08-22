import { api } from './api';

// idUsuario é o ID numérico (Long) do usuário — confirmado pela rota
// real (.../idUsuario/2) e pelo backend (usuarioRepository.findById).

/**
 * POST /v1/arquivos/novoArquivo/idUsuario/{idUsuario}
 * multipart/form-data
 *
 * Resposta de sucesso confirmada: { "mensagem": "Arquivo enviado..." }
 *
 * @param {number|string} idUsuario
 * @param {File} file
 * @param {(percent: number) => void} [onProgress]
 */
export async function uploadArquivo(idUsuario, file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post(
    `/v1/arquivos/novoArquivo/idUsuario/${idUsuario}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    }
  );
  return data;
}

/**
 * GET /v1/arquivos/idUsuario/{idUsuario}/arquivos
 * Lista todos os arquivos do usuário autenticado.
 *
 * Formato real de cada item (confirmado com a API):
 * { id, nome, hashNome, caminho, tamanho, tipoMime, dataCriacao }
 *
 * "id" e "hashNome" vêm null nessa API — por isso todas as ações
 * (excluir, renomear, buscar) usam "nome" como identificador, que é
 * único no banco.
 */
export async function listarArquivos(idUsuario) {
  const { data } = await api.get(`/v1/arquivos/idUsuario/${idUsuario}/arquivos`);
  const lista = Array.isArray(data) ? data : data?.arquivos ?? data?.content ?? [];

  return lista.map((item, index) => ({
    id: item?.id ?? null,
    // fallback local só para o React ter uma "key" estável na lista,
    // mesmo que o backend não tenha enviado um id de verdade
    _key: item?.id ?? item?.hashNome ?? index,
    nome: pick(item, ['nome', 'nomeArquivo', 'fileName']) ?? 'arquivo-sem-nome',
    hashNome: item?.hashNome,
    caminho: item?.caminho,
    tamanho: pick(item, ['tamanho', 'size']),
    dataUpload: pick(item, ['dataCriacao', 'dataUpload', 'createdAt']),
    tipo: pick(item, ['tipoMime', 'tipo', 'contentType']),
    raw: item,
  }));
}

/**
 * GET /v1/arquivos/download/idUsuario/{idUsuario}/{nomeArquivo}
 * Devolve o arquivo em binário — confirmado com a API real.
 */
export async function downloadArquivo(idUsuario, nomeArquivo) {
  const response = await api.get(
    `/v1/arquivos/download/idUsuario/${idUsuario}/${encodeURIComponent(nomeArquivo)}`,
    { responseType: 'blob' }
  );

  const blob = response.data;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * DELETE /v1/arquivos/idUsuario/{idUsuario}/nome/{nome}
 *
 * Excluímos por NOME em vez de ID porque a API está devolvendo
 * "id: null" na listagem — e o nome é único no banco (confirmado).
 */
export async function deletarArquivo(nomeArquivo, idUsuario) {
  const { data } = await api.delete(
    `/v1/arquivos/idUsuario/${idUsuario}/nome/${encodeURIComponent(nomeArquivo)}`
  );
  return data;
}

/**
 * GET /v1/arquivos/nomeArquivo/{nomeArquivo}/idUsuario/{idUsuario}
 * Busca detalhes de um arquivo por nome.
 */
export async function buscarArquivoPorNome(nomeArquivo, idUsuario) {
  const { data } = await api.get(
    `/v1/arquivos/nomeArquivo/${encodeURIComponent(nomeArquivo)}/idUsuario/${idUsuario}`
  );
  return data;
}

/**
 * PATCH /v1/arquivos/idUsuario/{idUsuario}/{nomeAntigo}/para/{nomeNovo}
 * Renomeia o arquivo.
 */
export async function renomearArquivo(idUsuario, nomeAntigo, nomeNovo) {
  const { data } = await api.patch(
    `/v1/arquivos/idUsuario/${idUsuario}/${encodeURIComponent(
      nomeAntigo
    )}/para/${encodeURIComponent(nomeNovo)}`
  );
  return data;
}

function pick(obj, candidates) {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const key of candidates) {
    if (obj[key] !== undefined) return obj[key];
  }
  return undefined;
}
