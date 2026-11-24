# Prompt Master — Fase 4: Comunidades e Feed Social do UNIU

Atue como Engenheiro de Software Sênior, Arquiteto Full-Stack e Especialista em UX Social. Evolua o núcleo social do UNIU sem remover, sobrescrever ou quebrar funcionalidades existentes.

## Objetivo

Transformar comunidades e feed em um espaço seguro, vivo e compreensível para compartilhar interesses, encontrar pessoas e iniciar conexões. O mascote atual é Mimo, o gato; reações devem usar os estados visuais do Mimo, nunca a Lumi/vagalume.

## Analisar antes de implementar

- Fluxo de descoberta, criação, entrada, permanência e saída de comunidades.
- Clareza dos formulários e qualidade mínima das publicações.
- Estados vazio, carregando, erro e sucesso.
- Moderação, denúncias, bloqueios e ferramentas do administrador.
- Ordenação e relevância do feed por recentes, comunidade, interesses e conexões.
- Consistência dos contadores entre API, banco e interface.

## Implementar

1. Comunidades: listar, criar, editar pelo proprietário, entrar, sair e exibir membros.
2. Publicações: texto e imagem opcional, limite de texto, URL segura e associação opcional à comunidade.
3. Feed: paginação, filtros por recentes/comunidades/interesses/conexões e ordenação estável.
4. Interações: reações do Mimo com toggle, contador consistente e comentários.
5. Segurança: autenticação em todas as mutações, isolamento por tenant quando o banco estiver conectado, validação de entrada e rate limit.
6. Moderação: denúncia de publicação/comentário/comunidade, fila administrativa e estados open/reviewing/resolved/dismissed.

## UX obrigatória

- O botão de reação abre uma barra horizontal discreta ao aproximar o cursor ou tocar.
- A reação escolhida permanece visível no post.
- O feed informa claramente quando não há conteúdo e oferece a próxima ação.
- Comunidades mostram se o usuário é membro e oferecem uma ação principal inequívoca.
- Imagens quebradas têm fallback; carregamentos têm estado visual; erros são compreensíveis.
- Não usar reação em publicação para criar match: match só nasce de curtida mútua de perfil.

## Critérios de aceite

- Criar, editar, entrar e sair de comunidade funcionam sem duplicar membros.
- Publicar texto/imagem valida limites e rejeita URL inválida.
- Feed retorna `page`, `limit`, `hasMore`, `total` e `filters` coerentes.
- Reações e comentários atualizam o contador e o estado selecionado.
- Denúncias chegam à área administrativa.
- AGB smoke test valida saúde, rotas, asset do Mimo e sintaxe após cada mudança.

Execute em etapas: auditoria, API/migração aditiva, UI/UX, moderação, testes e documentação. Não declare produção pronta sem banco, RLS/tenant e origem pública validados.
