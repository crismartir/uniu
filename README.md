# unio — aplicação executável

Demo independente de um produto de relacionamento. Não usa código, licença ou validação do pacote analisado.

## Executar

Requer Node.js 18 ou superior:

```powershell
node server.js
```

Em outro terminal, com o servidor ativo, execute `node test.js` para validar saúde, perfis, mensagens válidas e rejeição de mensagem vazia.

Abra `http://localhost:4173/` para ver a landing page pública. Use `http://localhost:4173/auth.html` para entrar ou criar uma conta. Depois do login, a área privada fica em `http://localhost:4173/app.html`. A área Descobrir contém 30 personas fictícias geradas por IA, com fotos locais dentro do app. Endpoints disponíveis:

O toggle do cabeçalho alterna entre a experiência clássica e `http://localhost:4173/magic.html`, que apresenta a Lumi, feed com comentários e estados por emoji e criação de comunidades. A animação da Lumi respeita `prefers-reduced-motion`.

- `GET /api/health`
- `POST /api/auth/register` com `{ "email": "voce@exemplo.com", "password": "minha-senha" }`
- `POST /api/auth/login` com `{ "email": "voce@exemplo.com", "password": "minha-senha" }`
- `GET /api/profiles`
- `GET /api/likes`
- `POST /api/likes` com `{ "profileId": 1 }`
- `GET /api/messages`
- `POST /api/messages` com `{ "text": "Olá!" }`
- `GET /api/feed` e `POST /api/feed` para publicações
- `POST /api/reports` para denúncias e `POST /api/blocks` para bloqueios
- `GET /api/plan`, `POST /api/plan/trial` e `POST /api/plan/cancel` para o plano demonstrativo
- `GET /api/admin/reports` e `PATCH /api/admin/reports/:id` para moderação autenticada

O trial premium é demonstrativo, dura sete dias e só pode ser ativado uma vez por conta. O acesso administrativo local é concedido quando o servidor é iniciado com `ADMIN_EMAIL=...`; pagamentos reais ainda exigem integração com um gateway.

## Fase 2 e Fase 3

A Fase 2 consolida perfis, comunidades, feed, comentários, reações emocionais da Lumi e estados de UX. O contrato de execução da próxima etapa está em `PROMPT-MASTER-FASE-3.md`, cobrindo amizades, notificações e messenger protegido.

As funções inteligentes recuperadas da engenharia reversa do REA estão documentadas em `INTELLIGENCE-REA.md` e expostas pelos endpoints autenticados de compatibilidade explicável, concierge opcional e revisão de confiança.

## Etapa 1 — schema social aditivo

O contrato PostgreSQL da primeira etapa está em `db/migrations/001_social_core.sql`. Ele prepara tenants, perfis enriquecidos, comunidades, feed, amizades, conversas e mensagens sem alterar o runtime atual. O guia de execução e validação está em `db/README.md`; a aplicação só deve trocar o `data.json` depois de validar a migração em staging.

Os dados locais são gravados em `data.json`, criado automaticamente na primeira alteração. Em `NODE_ENV=production`, o endpoint de recuperação de senha falha fechado até que um adaptador de entrega de e-mail seja configurado; o modo local usa `reset-delivery.log` somente para teste.

## Docker

```powershell
docker build -t vertice-demo .
docker run --rm -p 4173:4173 -v "${PWD}/data:/app/data" vertice-demo
```

## Configuração

Use `.env.example` como referência. O servidor lê `PORT`, `DATA_FILE` e `ADMIN_EMAIL` do ambiente. Os tokens de verificação e reset são demonstrativos; em produção devem ser enviados por um provedor de e-mail. O trial premium é local; cobrança real requer um gateway.
