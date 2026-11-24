# Prompt Master — Fase 5: Reações emocionais visuais

Atue como Engenheiro de Software Sênior, Product Designer e especialista em acessibilidade do UNIU. Evolua o núcleo de reações emocionais sem quebrar rotas, dados, autenticação, comunidades, feed, match ou conversas existentes.

## Contexto de produto

As reações do feed não devem usar emojis genéricos como ação principal. Devem usar estados visuais do mascote oficial atual, Mimo, o gato. Lumi/Luno são referências legadas de direção de arte e só podem permanecer em assets antigos quando isso for necessário para compatibilidade. O match continua sendo exclusivamente recíproco entre perfis; uma reação em publicação nunca cria match.

## 1. Analisar antes de alterar

- Auditar a planilha/catálogo de emoções e os assets disponíveis.
- Identificar expressões, poses, asas/elementos visuais, estilos e animações por contexto.
- Verificar formato dos assets: PNG/SVG, Lottie, Rive ou sprite sheet.
- Mapear reações existentes, contadores, persistência, endpoints e componentes do feed.
- Confirmar quais estados são adequados para publicação, comentário, perfil, match, convite, mimo e celebração.
- Auditar acessibilidade: teclado, foco, rótulos, contraste e `prefers-reduced-motion`.

## 2. Catálogo de emoções

Criar ou migrar para um catálogo versionado com:

`id`, `codigo_emocao`, `nome_exibicao`, `asset_url`, `tipo_asset`, `animacao`, `pontos_afinidade`, `contexto`, `ordem`, `ativo`, `created_at`, `updated_at`.

Catálogo inicial:

- `alegre` — Alegre
- `carinhoso` — Carinhoso
- `surpreso` — Surpreso
- `empatico` — Empático
- `inspirado` — Inspirado
- `apoiando` — Apoiando
- `celebrando` — Celebrando
- `curioso` — Curioso
- `curti` — Curti
- `abraco` — Um abraço

Os nomes podem ser ajustados ao catálogo visual final, sem alterar códigos já persistidos. Nunca excluir reações antigas sem migração compatível.

## 3. Experiência de interação

- Clique/toque rápido: aplica ou remove a reação padrão.
- Pressionar, passar o mouse ou abrir o botão: mostra menu horizontal de emoções.
- A reação selecionada fica marcada e atualiza o contador sem recarregar a página.
- Após a escolha, executar animação curta do Mimo, sem animação contínua no feed.
- Em foto ou publicação com imagem, a reação deve ser aplicada à publicação inteira e continuar visível junto dela.
- Em perfis, usar reações de interesse separadas das reações de publicação; somente dois interesses recíprocos podem gerar match.
- Em convite ou mimo, usar estados apropriados ao contexto e registrar o evento.

## 4. Backend e persistência

- Garantir uma reação por usuário por alvo, com toggle e troca de emoção.
- Persistir `target_type`, `target_id`, `user_id`, `codigo_emocao`, timestamps e tenant/organização quando aplicável.
- Manter contadores consistentes entre API, banco e interface.
- Validar se o código está ativo no catálogo.
- Impedir que reação de post, comentário ou foto altere match de perfil.
- Aplicar autenticação, rate limit, autorização e isolamento multi-tenant.
- Preservar compatibilidade com registros antigos de `like`.

## 5. Frontend e assets

- Criar componente reutilizável `EmotionalReactionPicker`.
- Renderizar PNG/SVG, sprite, Lottie ou Rive conforme `tipo_asset`.
- Usar lazy loading e fallback visual quando o asset estiver indisponível.
- Adicionar estados: carregando, vazio, erro, selecionado, desabilitado e sem movimento.
- Respeitar `prefers-reduced-motion`: substituir animação por transição discreta ou estado estático.
- Não depender de links externos para assets enviados pelo usuário; fotos devem usar upload controlado e URL interna/objeto armazenado.

## 6. UX writing e acessibilidade

- Botão padrão: “Reagir”.
- Cada estado precisa de nome acessível, por exemplo: “Reagir com Empático”.
- Não comunicar que reação em publicação criou match.
- Após aplicar: “Você reagiu com Empático.”
- Em erro: “Não foi possível registrar sua reação. Tente novamente.”
- Menu utilizável por teclado e leitor de tela.
- Não usar apenas cor ou movimento para indicar seleção.

## 7. Testes e aceite

Testar:

- reação rápida e remoção;
- troca de emoção;
- contagem concorrente;
- reação em publicação com foto;
- reação em comentário;
- reação em perfil e match somente recíproco;
- catálogo inválido/inativo;
- usuário não autenticado;
- limite de requisições;
- fallback de asset;
- `prefers-reduced-motion`;
- responsividade mobile/desktop;
- persistência após refresh;
- isolamento entre usuários e tenants.

## Entrega incremental

1. Auditoria do catálogo, banco, rotas e assets; sem alterar arquivos.
2. Migração aditiva e catálogo inicial.
3. API de reações compatível com dados existentes.
4. Componente visual e integração no feed, fotos e comentários.
5. Contextos de perfil, convite e mimo.
6. Acessibilidade, animações reduzidas, testes e auditoria final.

Critério de conclusão: o usuário consegue expressar uma emoção visualmente, entende o que aconteceu, vê a reação persistida e não confunde reação social com match romântico.
