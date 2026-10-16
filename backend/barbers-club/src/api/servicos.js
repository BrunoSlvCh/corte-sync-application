import api from "./client";

export async function listarServicos() {
  const { data } = await api.get("/servico/servicos");
  return data;
}

export async function buscarServicoPorNome(nome) {
  const { data } = await api.get(`/servico/nome/${encodeURIComponent(nome)}`);
  return data;
}

export async function criarServico({ nomeServico, precoServico, duracaoServico, status, categoria }) {
  const { data } = await api.post("/servico/new", {
    nomeServico,
    precoServico,
    duracaoServico,
    status,
    categoria,
  });
  return data;
}

export async function alterarNomeServico(nomeServico, novoNome) {
  const { data } = await api.patch(
    `/servico/nomeServico/${encodeURIComponent(nomeServico)}/nome`,
    null,
    { params: { novoNome } }
  );
  return data;
}

export async function alterarPrecoServico(nomeServico, novoPreco) {
  const { data } = await api.patch(
    `/servico/nomeServico/${encodeURIComponent(nomeServico)}/preco`,
    null,
    { params: { novoPreco } }
  );
  return data;
}

export async function alterarDuracaoServico(nomeServico, novaDuracao) {
  const { data } = await api.patch(
    `/servico/nomeServico/${encodeURIComponent(nomeServico)}/duracao`,
    null,
    { params: { novaDuracao } }
  );
  return data;
}

export async function alterarCategoriaServico(nomeServico, novaCategoria) {
  const { data } = await api.patch(
    `/servico/nomeServico/${encodeURIComponent(nomeServico)}/categoria`,
    null,
    { params: { novaCategoria } }
  );
  return data;
}

export async function deletarServico(nomeServico) {
  const { data } = await api.delete(`/servico/delete/nomeServico/${encodeURIComponent(nomeServico)}`);
  return data;
}
