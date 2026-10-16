// Royalty-free barbershop interior photography (Unsplash License — free for
// commercial use, no attribution required, no watermarks). Swap any of these
// for your own photos later by just changing the URL here.
function unsplash(id, w = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const IMAGES = {
  // Shared by Login and Criar Conta (client)
  auth: unsplash("photo-1675599193990-33d71150902b"),
  // Barber-only login screen
  authBarbeiro: unsplash("photo-1621607512026-ba3e0857c6f4"),
  // Home hero
  home: unsplash("photo-1593702275687-f8b402bf1fb5"),
  // Public services page banner
  servicos: unsplash("photo-1759142449398-89357aa1bb36"),
  // Booking flow banner
  agendamento: unsplash("photo-1759134248487-e8baaf31e33e"),
  // Admin barbeiros banner
  adminBarbeiros: unsplash("photo-1770253980732-dfed1cfdfa43"),
  // Admin servicos banner — barber tools table (scissors)
  adminServicos: unsplash("photo-1621605817839-63b391c22aef"),
  // Admin agendamentos banner — calendar
  adminAgendamentos: unsplash("photo-1633526543814-9718c8922b7a"),
};
