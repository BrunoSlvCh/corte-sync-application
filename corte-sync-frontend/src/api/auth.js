import api from "./client";

export async function registerUser({ nome, email, telefone, senha }) {
  const { data } = await api.post("/auth/register", { nome, email, telefone, senha });
  return data;
}

// identifier can be an email or a phone number; the API tells them apart itself
export async function loginUser({ identifier, senha }) {
  const isEmail = identifier.includes("@");
  const payload = isEmail
    ? { email: identifier, senha }
    : { telefone: identifier, senha };

  const { data } = await api.post("/auth/login", payload);
  return data; // { token, expireIn, id }
}
