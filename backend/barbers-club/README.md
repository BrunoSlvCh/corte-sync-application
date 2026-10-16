# Barber's Club — Front-end

Front-end em React (Vite) para consumir a API Spring Boot da barbearia, seguindo o
modelo de telas enviado (tema escuro + dourado).

## Stack

- React + Vite
- React Router (rotas e proteção por autenticação/role)
- Tailwind CSS v4
- Axios (camada de API)
- lucide-react (ícones)

## Como rodar

```bash
npm install
npm run dev
```

O projeto sobe em `http://localhost:5173`.

## Configuração da API

O endereço da API fica em `.env`:

```
VITE_API_BASE_URL=http://18.212.218.215:8082/v1
VITE_ADMIN_EMAIL=adminprincipal@barbearia.com
VITE_ADMIN_TELEFONE=11983451234
```

Troque `VITE_API_BASE_URL` se a API mudar de endereço.

## Como a autenticação/role funciona

O `TokenResponseDTO` da API não retorna a role do usuário — só `token`, `expireIn`
e `id`. Como só existe um único usuário ADMIN pré-cadastrado (sem endpoint para
criar outros), o front reconhece o admin comparando o e-mail/telefone digitado no
login com `VITE_ADMIN_EMAIL` / `VITE_ADMIN_TELEFONE`. Qualquer outro login é
tratado como usuário comum.

Se no futuro você adicionar a role como *claim* no JWT (no `TokenProvider`) ou
criar um endpoint `/v1/user/me`, dá pra trocar essa lógica em
`src/context/AuthContext.jsx` por uma verificação real, mais robusta.

## Estrutura

```
src/
  api/            chamadas HTTP por recurso (auth, barbeiros, servicos, agendamentos)
  components/
    layout/        navbar pública, sidebar admin, guards de rota, hero de auth
    ui/             Button, Input, Badge, Modal (design system básico)
    booking/        Stepper e resumo do fluxo de agendamento
  context/        AuthContext (login/role) e ToastContext (feedback)
  pages/
    public/         Home, Login, Register, Servicos, Agendamento (fluxo 4 etapas)
    admin/          Dashboard, Barbeiros, Servicos, Agendamentos
  utils/          formatação de moeda, data e hora
```

## Limitações conhecidas da API (herdadas do backend atual)

Essas telas/ações do mockup **não puderam ser implementadas por completo** porque
a API ainda não expõe os endpoints necessários:

1. **Dashboard admin — "Agendamentos hoje" e "Clientes"**: não existe endpoint
   para listar todos os agendamentos nem todos os usuários. Os cards ficam com
   `—` e uma explicação ao invés de um número.
2. **"Agendamentos recentes" no dashboard**: mesma causa acima. A tela
   `/admin/agendamentos` permite apenas *consultar um agendamento específico*
   pelo par (ID do agendamento + ID do cliente), que é o único endpoint de
   leitura disponível (`GET /v1/agendamento/idAgendamento/{id}/idUsuario/{id}`).
3. **Menu "Usuários" (admin)**: removido do front. Não existe endpoint para
   listar usuários nem para promover alguém a ADMIN — combinado com você.
4. **Status ativo/inativo do barbeiro**: a listagem `GET /v1/barbeiro/barbeiros`
   não retorna o campo `status`, e não existe endpoint para alterá-lo. A tabela
   do admin mostra "Ativo" fixo até o backend expor isso.
5. **Status ativo/inativo do serviço**: é possível ver o status (a listagem
   retorna o campo), mas **não há endpoint para alterá-lo** depois de criado.
6. **Editar nome do barbeiro**: só existem endpoints para editar descrição e
   foto — o nome não pode ser alterado depois do cadastro.
7. **Avaliações/estrelas e "especialidade" do barbeiro**: removidos do design
   por não existirem no modelo de dados (`BarbeiroEntity` só tem
   nome/descrição/foto/status), conforme combinado.
8. **Upload de foto**: `S3Config` está com credenciais fake, então a URL da
   foto do barbeiro é um campo de texto (cole uma URL já hospedada), não um
   upload de arquivo. Quando o S3 estiver configurado de verdade, dá pra trocar
   por um input de upload real.

Nenhuma dessas limitações trava o funcionamento do site — só reduz o que essas
telas específicas conseguem mostrar/fazer até o backend evoluir.
