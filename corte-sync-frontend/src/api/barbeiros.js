import api from "./client";

export async function listarBarbeiros() {
  // Cache-busting param: some browsers/proxies cache identical GET URLs even
  // without explicit headers, which can show stale data after admin changes.
  const { data } = await api.get("/barbeiro/barbeiros", { params: { _: Date.now() } });
  return data;
}

export async function buscarBarbeiroPorNome(nome) {
  const { data } = await api.get(`/barbeiro/nome/${encodeURIComponent(nome)}`);
  return data;
}

export async function criarBarbeiro({ nome, email, senha, telefone, descricao, urlFoto, status }) {
  const { data } = await api.post("/barbeiro/new", {
    nome,
    email,
    senha,
    telefone,
    descricao,
    urlFoto,
    status,
  });
  return data;
}

export async function alterarDescricaoBarbeiro(id, descricao) {
  const { data } = await api.patch(`/barbeiro/descricao/id/${id}`, null, {
    params: { descricao },
  });
  return data;
}

// Self-service — a barbeiro edits their own photo, resolved server-side via
// the linked usuarioId (or ADMIN can also call this for any usuarioId)
export async function alterarFotoPorUsuarioId(idUsuario, urlFoto) {
  const { data } = await api.patch(`/barbeiro/usuario/${idUsuario}/foto`, null, {
    params: { urlFoto },
  });
  return data;
}

// ADMIN only — toggles a barbeiro's active/inactive status
export async function alterarStatusBarbeiro(id, status) {
  const { data } = await api.patch(`/barbeiro/id/${id}/status/${status}`);
  return data;
}

export async function deletarBarbeiro(id) {
  const { data } = await api.delete(`/barbeiro/delete/id/${id}`);
  return data;
}
