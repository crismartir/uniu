# UNIU — Implementação da Fase 1

## Entregas

- Migração social PostgreSQL aditiva em `db/migrations/001_social_core.sql`.
- Catálogo de reações da Lumi/Luno (`reactions_catalog`).
- Notificações e trilha de auditoria (`notifications`, `audit_logs`).
- Compatibilidade retroativa do runtime JSON.
- Sessões com expiração de 24 horas para novas autenticações.
- Invalidação de sessões após logout, redefinição de senha e exclusão de conta.
- Recuperação de senha não enumerável, com token único e temporário.
- Guard de amizade no endpoint de mensagens e no WebSocket.
- Separação de responsabilidades entre descoberta, feed, conversas e experiências.
- Documentação de auditoria, rotas e critérios de aceite.

## Validação executada

Em uma instância limpa na porta 4221:

- `API_TESTS_OK`
- `RESET_WEBHOOK_SMOKE delivery=ok auth=ok no_local_log=ok reset=ok login=ok`
- `WS_SMOKE blocked=HTTP/1.1 403 Forbidden accepted=ACCEPTED open=HTTP/1.1 101 Switching Protocols`

## Limites conhecidos

- O runtime local permanece em JSON até a validação de staging PostgreSQL.
- Entrega real de e-mail depende de `RESET_EMAIL_WEBHOOK` em produção.
- O catálogo contém o contrato de dados; os assets finais de todas as emoções serão conectados na Fase 2.
