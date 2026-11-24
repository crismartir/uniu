# Auditoria de propósito, produto e UX — UNIU

Data: 2026-11-23

## Propósito avaliado

O UNIU deve facilitar conexões seguras, gentis e intencionais. A descoberta apresenta pessoas com contexto; a comunidade cria pertencimento; a amizade cria reciprocidade; e o messenger só abre depois de uma amizade aceita. Lumi deve orientar e dar calor à jornada, sem substituir a clareza do produto.

## Referência de marca

Os guias visuais fornecidos definem Lumi como uma guia acolhedora, inteligente, positiva e elegante. As expressões, poses, asas, brilho e movimentos devem aparecer em estados de orientação, vazio, sucesso, reação e celebração. A presença da mascote deve ser contextual: o feed continua sendo um feed, e o chat continua sendo uma conversa.

## Evidências encontradas no app

- O app já possui autenticação, feed, comunidades, reações, comentários, amizades, guard de amizade no messenger, inteligência explicável e perfil enriquecido.
- A tela `app.html` possui navegação por hash, mas os módulos eram injetados globalmente na mesma página.
- O feed tinha duas experiências simultâneas: o feed original e o feed social aprimorado.
- Messenger, amizades e inteligência apareciam fora da sua área de tarefa, criando a sensação de que “Conversas” não abre e que o feed não é apenas feed.
- A rota `#experiencias` não tinha uma superfície própria de decisão; a promessa de experiência mágica ficava reduzida a um convite lateral.

## Achados priorizados

### P0 — Segurança e confiança

O chat deve continuar condicionado a `ACCEPTED` no servidor e no WebSocket. A UI pode explicar o bloqueio, mas nunca autorizar sozinha. Esse princípio já está documentado no código e deve ser preservado nos próximos incrementos.

### P1 — Separação de tarefas

Feed, Conversas, Descobrir, Perfil e Experiências precisam ter uma responsabilidade principal cada. O controlador de rota agora oculta os módulos fora do contexto e cria uma tela real para Experiências. Isso reduz carga cognitiva e torna a navegação previsível.

### P1 — Feed duplicado

O feed original e o aprimorado competiam pelo mesmo espaço. A visualização aprimorada passa a ser a superfície de interação social da rota `#feed`; a publicação original é preservada no HTML e na API, mas fica fora dessa rota para evitar duplicidade visual.

### P1 — Conversas sem entrada clara

Messenger aparece apenas em `#conversas`, com indicação de que a amizade aceita é pré-requisito. O próximo refinamento recomendado é substituir o campo manual de ID por uma lista de amizades aceitas.

### P1 — Experiência mágica sem prova de valor

Agora `#experiencias` explica a diferença entre clássico e mágico e oferece ação direta para ativar a Lumi. A mágica deve usar estados animados em feedback, vazio, publicação, reação e conquista; não deve animar cada elemento permanentemente.

### P2 — Reações ainda genéricas

A API já aceita estados nomeados, mas a interface do feed ainda precisa trocar emojis genéricos pela biblioteca visual de estados da Lumi/Luno. O catálogo recomendado é `codigo_emocao`, `nome_exibicao`, `asset_url`, `pontos_afinidade` e `animacao`; a migração deve ser aditiva.

### P2 — Contagem inicial de reações

A API retorna `reactionCount` e `userReacted`. A UI precisa inicializar o contador com esses dados e refletir o estado ativo, evitando que um post existente apareça sempre como “0”.

## Veredito de propósito

Parcialmente atingido. O núcleo de conexão segura existe e há diferenciais claros — reciprocidade, inteligência explicável e Lumi. A experiência ainda precisava de arquitetura de informação mais explícita; sem separar as rotas, os recursos pareciam ausentes ou quebrados mesmo quando existiam no código.

## Próximos testes de aceite

1. Entrar em `#feed`: ver apenas publicação, reações, comentários e comunidades/conexões relacionadas.
2. Entrar em `#conversas`: ver apenas o messenger e testar bloqueio antes de amizade aceita.
3. Entrar em `#experiencias`: escolher clássico ou mágico e ver uma explicação clara.
4. Entrar em `#descobrir`: ver perfis e recomendações explicáveis.
5. Ativar redução de movimento: a Lumi deve reduzir animações sem perder informação.
