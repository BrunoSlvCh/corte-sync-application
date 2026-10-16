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

// ADMIN only — full list of every appointment in the system
export async function listarTodosAgendamentos() {
  const { data } = await api.get("/agendamento/all");
  return data;
}

// ADMIN only — server-side status filter (has a backend quirk: the DTOs it
// returns don't include clienteId/barbeiroId, only entityParaResponseDTO
// fields). Prefer filtering the /all list client-side instead when you need
// those ids (e.g. to cancel from a filtered view).
export async function buscarAgendamentosPorStatus(status) {
  const { data } = await api.get(`/agendamento/agendamentos/status/${status}`);
  return data;
}

// Self (client) or ADMIN — appointments belonging to a given client
export async function buscarAgendamentosPorUsuario(idUsuario) {
  const { data } = await api.get(`/agendamento/agendamentos/usuario/${idUsuario}`);
  return data;
}

// ADMIN or BARBEIRO — marks an appointment as concluded
export async function concluirAgendamento(idAgendamento) {
  const { data } = await api.patch(`/agendamento/concluir/${idAgendamento}`);
  return data;
}

// BARBEIRO (or ADMIN) — the logged-in barber's own appointments, resolved
// server-side from the JWT's email, no id needed
export async function meusAgendamentosBarbeiro() {
  const { data } = await api.get("/agendamento/meus-agendamentos");
  return data;
}

// ADMIN or the BARBEIRO assigned to this appointment — reverts it back to CONFIRMADO
export async function reverterParaConfirmado(idAgendamento) {
  const { data } = await api.patch(`/agendamento/${idAgendamento}/status`);
  return data;
}

// ADMIN only — looks up a barbeiro's id from their user email
export async function buscarIdBarbeiroPorEmail(email) {
  const { data } = await api.get(`/agendamento/barbeiro/email/${encodeURIComponent(email)}/id`);
  return data;
}
