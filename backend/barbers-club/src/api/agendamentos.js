import api from "./client";

export async function criarAgendamento({ dataInicio, clienteId, barbeiroId, servicosIds }) {
  const { data } = await api.post("/agendamento/new", {
    dataInicio,
    clienteId,
    barbeiroId,
    servicosIds,
  });
  return data;
}

export async function buscarAgendamento(idAgendamento, idUsuario) {
  const { data } = await api.get(`/agendamento/idAgendamento/${idAgendamento}/idUsuario/${idUsuario}`);
  return data;
}

// data: "AAAA-MM-DD"
export async function buscarHorariosDisponiveis(barbeiroId, data, duracaoMinutos) {
  const { data: response } = await api.get(
    `/agendamento/barbeiroId/${barbeiroId}/data/${data}`,
    { params: duracaoMinutos ? { duracaoMinutos } : {} }
  );
  return response;
}

export async function cancelarAgendamento(idAgendamento, idUsuario) {
  const { data } = await api.patch(`/agendamento/idAgendamento/${idAgendamento}/idUsuario/${idUsuario}`);
  return data;
}
