# UNIU — Fase 0: Auditoria técnica, produto e UX

Data da auditoria: 2026-11-23

## Propósito do produto

O UNIU facilita conexões seguras, gentis e intencionais. A jornada principal é: descobrir pessoas, participar de comunidades, criar reciprocidade e conversar somente quando houver amizade aceita. Lumi orienta a jornada sem substituir a autonomia do usuário.

## Escopo auditado

- Aplicação privada e landing page.
- Autenticação, sessão, logout e recuperação de senha.
- Descoberta de perfis e enriquecimento de perfil.
- Feed, comentários, reações, denúncias e bloqueios.
- Comunidades.
- Amizades e messenger protegido.
- Experiência clássica e experiência mágica.
- Inteligência explicável recuperada da engenharia reversa do REA.
- Schema PostgreSQL planejado e runtime JSON local.

## Fontes primárias consultadas

- `README.md`
- `PRODUCTION_READINESS.md`
- `INTELLIGENCE-REA.md`
- `db/README.md`
- `db/migrations/001_social_core.sql`
- `server.js`
- `app.html`, `magic.html`, `experience.js`, `feed.js`, `messenger.js`, `social.js`, `profile-enrichment.js`
- `rea-love/FEATURE-MAP.md`, `PRD.md`, `INTEGRATION-ROADMAP.md`, `ACCESSIBILITY-AUDIT.md` e `SECURITY-BOUNDARY.md`

## Inventário encontrado

### Preservar

- Autenticação e sessões existentes.
- Recuperação de senha com token temporário.
- APIs legadas de mensagens, likes e perfis.
- Feed e comunidades existentes.
- Guard de amizade no fluxo de mensagens.
- Experiência clássica/mágica.
- Dados locais `data.json`.

### Conflitos encontrados

- Módulos sociais eram injetados em todas as rotas hash.
- Feed original e feed aprimorado eram renderizados juntos.
- Conversas não possuíam uma superfície exclusiva.
- A rota de experiências precisava de uma decisão clara entre clássico e mágico.
- O runtime JSON e o schema PostgreSQL ainda não possuem adapter comum.

### Lacunas da Fase 1

- Catálogo persistente de reações emocionais.
- Notificações e auditoria no contrato SQL.
- Documento formal de critérios de aceite.
- Verificação automatizada em instância limpa.

## Decisões de UX

- Descobrir mostra perfis e recomendações.
- Feed mostra publicações, reações, comentários e contexto de comunidade.
- Conversas mostra somente o messenger.
- Experiências explica clássico versus mágico.
- Perfil concentra dados pessoais, privacidade e compatibilidade.
- Lumi aparece em orientação, estados vazios, sucesso e celebração; não bloqueia tarefas.
- Animações respeitam `prefers-reduced-motion`.

## Riscos e limites

- A entrega de e-mail real depende de webhook/provedor configurado em produção.
- O banco PostgreSQL está preparado por migração, mas o runtime local continua em JSON até validação de staging.
- O guard de amizade precisa permanecer aplicado no servidor e no WebSocket durante a migração de storage.

## Veredito

Fase 0 concluída como auditoria documental e de código. A Fase 1 pode avançar com migrações aditivas, contratos de segurança e validação em instância limpa.
