import api from "./client";

export async function alterarNome(idUsuario, novoNome) {
  const { data } = await api.patch(`/user/idUsuario/${idUsuario}/alterar-nome`, { novoNome });
  return data;
}

export async function alterarEmail(idUsuario, emailAntigo, novoEmail) {
  const { data } = await api.patch(`/user/idUsuario/${idUsuario}/alterar-email`, {
    emailAntigo,
    novoEmail,
  });
  return data;
}

export async function alterarTelefone(idUsuario, telefoneAntigo, novoTelefone) {
  const { data } = await api.patch(`/user/idUsuario/${idUsuario}/alterar-telefone`, {
    telefoneAntigo,
    novoTelefone,
  });
  return data;
}

export async function alterarSenha(idUsuario, senhaAntiga, novaSenha) {
  const { data } = await api.patch(`/user/idUsuario/${idUsuario}/alterar-senha`, {
    senhaAntiga,
    novaSenha,
  });
  return data;
}
