import api from "./client";

export async function listarBarbeiros() {
  const { data } = await api.get("/barbeiro/barbeiros");
  return data;
}

export async function buscarBarbeiroPorNome(nome) {
  const { data } = await api.get(`/barbeiro/nome/${encodeURIComponent(nome)}`);
  return data;
}

export async function criarBarbeiro({ nome, descricao, status, urlFoto }) {
  const { data } = await api.post("/barbeiro/new", { nome, descricao, status, urlFoto });
  return data;
}

export async function alterarDescricaoBarbeiro(id, descricao) {
  const { data } = await api.patch(`/barbeiro/descricao/id/${id}`, null, {
    params: { descricao },
  });
  return data;
}

export async function alterarFotoBarbeiro(id, urlFoto) {
  const { data } = await api.patch(`/barbeiro/foto/id/${id}`, null, {
    params: { urlFoto },
  });
  return data;
}

export async function deletarBarbeiro(id) {
  const { data } = await api.delete(`/barbeiro/delete/id/${id}`);
  return data;
}
