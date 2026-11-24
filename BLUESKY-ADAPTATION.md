# Decisão arquitetural — adaptação do Bluesky no UNIU

## Decisão

Não copiar o repositório inteiro `bluesky-social/social-app` para dentro do UNIU.
O Bluesky é uma referência excelente para a experiência de rede social e para padrões de frontend, mas o seu modelo de identidade, feed e backend é o AT Protocol. O UNIU possui regras próprias e mais sensíveis: compatibilidade de perfis, reciprocidade de match, amizades, bloqueios, moderação, multi-instância e o catálogo emocional do Mimo.

A estratégia segura é adaptar padrões de interface e infraestrutura de cliente em uma camada de integração, mantendo um único backend canônico do UNIU.

## O que reaproveitar do Bluesky

- Shell de rede social: navegação, feed, composer, perfil, notificações e mensagens como referências de organização.
- Padrão de query/cache para feed, paginação, atualização otimista e invalidação após curtir, comentar ou publicar.
- Separação entre componentes visuais, estado de tela, cliente de API e regras de domínio.
- Manipulação de feed: deduplicação, agrupamento de respostas, carregamento incremental e estados de carregamento/vazio.
- Padrões de composição de post e upload de mídia.
- Design system e acessibilidade como referência para responsividade, foco por teclado e `prefers-reduced-motion`.

## O que permanece exclusivo do UNIU

- Autenticação, recuperação de senha e isolamento multi-tenant.
- Perfil enriquecido, compatibilidade e match somente quando os dois perfis demonstram interesse.
- Amizade com estados `PENDING`, `ACCEPTED`, `DECLINED` e `BLOCKED`.
- Trava de mensageria: sem amizade aceita, não há sala nem envio de mensagem.
- Moderação, denúncias, antifraude, proteção contra abuso e administração SaaS.
- Reações emocionais do Mimo, com catálogo próprio e ativos visuais do produto.
- Convites, mimos, jornadas gamificadas e recursos para fortalecer relacionamentos.

## Mapa de adaptação

| Padrão do Bluesky | Adaptação no UNIU | Regra |
|---|---|---|
| Feed query/cache | Cliente do `/api/feed` | Não criar um segundo feed ou outro banco |
| Composer | `feed.js` + upload de mídia | Texto, imagem e validação do UNIU |
| Reações | Catálogo `/api/reactions/catalog` | Mimo substitui emojis genéricos |
| Perfis | `profile-enrichment.js` | Compatibilidade e privacidade são do UNIU |
| Mensagens | `messenger.js` + `/api/conversations` | Guard de amizade no servidor |
| Moderação | `/api/reports` + área administrativa | Denúncia e bloqueio não dependem só da UI |
| Navegação | `app.html`/controlador de rotas | Migrar gradualmente, sem quebrar rotas atuais |

## Plano técnico

1. Manter a implementação pública atual como baseline e preservar os contratos de API existentes.
2. Criar uma camada `social-client` com tipos e adaptadores para feed, perfis, comunidades, reações e mensagens.
3. Fazer um spike isolado do shell React/TypeScript inspirado no Bluesky, em worktree/pacote separado; não substituir a aplicação em produção durante o spike.
4. Migrar primeiro a experiência de feed e composer, com testes de contrato contra o backend atual.
5. Migrar perfis, comunidades e mensagens apenas após validar a mesma regra de match, amizade e bloqueio.
6. Remover somente duplicações comprovadas depois que a nova camada passar pelo smoke test e pela inspeção visual pública.

## Critério de sucesso

O UNIU deve parecer uma rede social madura, mas continuar sendo uma rede de afinidade e relacionamento. A aparência pode seguir padrões familiares do Bluesky; as decisões de confiança, compatibilidade, segurança e Mimo devem continuar sendo do UNIU.

## Referência oficial

O repositório oficial `bluesky-social/social-app` é licenciado sob MIT e reúne o aplicativo web, iOS e Android. A documentação do projeto descreve uma stack React/React Native/Expo/TypeScript, TanStack Query e um design system próprio. Esses padrões são adequados para referência e adaptação seletiva, não para duplicação do domínio do UNIU.

## Auditoria da cópia de referência

Foi feita uma cópia rasa do repositório oficial em:

```text
C:\Users\TecnoFenix\Documents\Codex\bluesky-social-app-reference
```

Commit auditado: `06f10a6`.

Os pontos confirmados no código são:

- `src/App.web.tsx` organiza providers de composer, mensagens e shell da aplicação;
- `AGENTS.md` recomenda TanStack Query para estado remoto e ALF como design system;
- `src/lib/api/feed-manip.ts` concentra manipulação/deduplicação do feed;
- `src/view/com/composer/state/composer.ts` concentra o estado do composer;
- a estrutura separa `screens`, `view`, `state`, `components` e `lib`, uma divisão útil para a futura migração do frontend do UNIU.

Essa auditoria confirma que o valor principal a reaproveitar está no frontend e nos padrões de estado, não no modelo de dados. O repositório de referência permanece fora do diretório de produção do UNIU para evitar cópia acidental de rotas, dependências ou tabelas.
