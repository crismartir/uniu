# UNIU — Etapa 1: migrações sociais

Este diretório contém o schema aditivo planejado para PostgreSQL. A aplicação atual continua usando `data.json`; nenhuma rota ou tabela existente foi substituída.

## Ordem

1. Executar `migrations/001_social_core.sql` em um banco de staging.
2. Criar o tenant padrão e associar usuários existentes por uma migração de dados separada.
3. Conferir contagens de usuários, comunidades, posts, comentários e reações.
4. Somente após a validação, implementar o adapter de repositórios e migrar as rotas gradualmente.

## Guard de amizade

O banco preparado aqui não autoriza mensagens sozinho. Na Etapa 4, a criação de conversa e a inserção de mensagem deverão ocorrer em transação que confirme uma amizade `ACCEPTED` entre os membros, no mesmo `tenant_id`. O frontend não será considerado uma camada de segurança.

## Catálogo emocional e auditoria

`reactions_catalog` prepara os estados visuais da Lumi/Luno para a experiência mágica. `notifications` e `audit_logs` preparam feedback e rastreabilidade sem acoplar o runtime atual a um provedor externo.

## Compatibilidade

Os campos de perfil são opcionais ou possuem defaults. O `data.json` permanece preservado como fallback e fonte de comparação durante a migração.
