# CorteSync — Front-end

Front-end em React + Vite do sistema de agendamento da barbearia CorteSync.
Consome a API Spring Boot (`/v1/...`).

## Stack
React, Vite, React Router, Tailwind CSS v4, Axios, lucide-react.

## Configuração
O `.env` fica na raiz deste projeto:

```
VITE_API_BASE_URL=http://52.207.33.184:8082/v1
VITE_ADMIN_EMAIL=adminprincipal@barbearia.com
VITE_ADMIN_TELEFONE=11983451234
```

> O Vite grava essas variáveis dentro do JavaScript **na hora do build**. Mudou o `.env`?
> Rode `npm run build` de novo (ou `docker compose build --no-cache`).

## Rodar
```bash
npm install
npm run dev        # desenvolvimento
npm run build      # gera a pasta dist/
```

## Docker
O `Dockerfile` faz o build com Node e serve com Nginx (porta 80). O `nginx.conf` tem o
fallback para `index.html`, necessário para o React Router funcionar ao dar F5.
O `docker-compose.yml` (na raiz do backend) mapeia `3000:80`.

Para conferir qual build está no ar, abra `/version.txt` no navegador.

## Telas por perfil
- **Público/cliente:** Início, Serviços, Agendamento (4 etapas), Meus agendamentos, Meu perfil, Criar conta, Login.
- **Barbeiro:** login próprio em `/login-barbeiro`; tela **Meus agendamentos** (`/barbeiro`) com só os
  atendimentos dele e o campo de status (Confirmado / Concluído / Cancelado) ao lado de cada um;
  Meu perfil (nome, e-mail, telefone, senha e foto).
- **Admin:** Dashboard, Barbeiros (cadastro em passo a passo, status, descrição, remoção),
  Serviços (cadastro, edição, status, remoção) e Agendamentos (todos, via `GET /v1/agendamento/all`,
  com filtro por status e troca de status).

## Como o front identifica o perfil
O login não devolve a role. O admin é reconhecido pelo e-mail/telefone do `.env`; o barbeiro, pela tela de login
usada (`/login-barbeiro`). Isso só decide **qual tela mostrar** — as permissões de verdade são validadas pelo
backend (`@PreAuthorize`) em cada requisição.
