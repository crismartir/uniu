# Prompt Master — Fase 3: Amizades, notificações e messenger seguro

Atue como Engenheiro de Software Sênior, Arquiteto Full-Stack, Especialista em Segurança, Realtime e UX.

## Objetivo

Implementar amizades recíprocas, notificações e messenger em tempo real sem remover recursos das Fases 0, 1 e 2.

## Amizades

Implementar os estados `PENDING`, `ACCEPTED`, `DECLINED` e `BLOCKED`.

- Permitir pedido a partir de perfil, publicação, comunidade e recomendação.
- Impedir autoamizade e duplicidade.
- Aceite somente pelo destinatário.
- Bloqueio impede novas interações e encerra acesso à conversa.
- Registrar transições relevantes em `audit_logs`.

## Notificações

Criar notificações para novo pedido, aceite, recusa, bloqueio, comentário, reação, entrada em comunidade e mensagem recebida.

Adicionar:

```text
GET /api/notifications
PATCH /api/notifications/:id/read
POST /api/notifications/read-all
```

O runtime local também deve gerar notificações de pedido e mudança de estado da amizade, mantendo o formato persistente compatível com a tabela `notifications`.

## Messenger

Implementar lista de amizades aceitas, histórico, envio, presença online/offline, indicador de digitação, reconexão e estados de erro.

## Trava obrigatória

O chat somente será permitido se existir amizade com `status === 'ACCEPTED'`.

A validação deve ocorrer no frontend, em endpoints HTTP, no handshake WebSocket, antes do envio, antes da entrega e no repositório/banco.

Não confiar apenas na interface.

## Segurança

- Autenticar o handshake.
- Validar usuário e destinatário.
- Aplicar expiração de sessão.
- Encerrar salas após bloqueio.
- Limitar tamanho e frequência das mensagens.
- Isolar tenants.
- Nunca expor tokens em mensagens.
- Evitar duplicidade durante reconexão.

## UX

Conversas deve mostrar apenas mensagens e amizades aceitas. Exibir claramente por que uma conversa está bloqueada, como enviar pedido, quando a amizade foi aceita, quando alguém está digitando, quando uma mensagem falhou e quando não existem amizades.

Lumi pode aparecer em estados vazios, amizade aceita, primeira conversa e bloqueio, sem interromper a tarefa.

## Critérios de aceite

- Pedidos podem ser enviados, aceitos, recusados e bloqueados.
- Duplicidades são rejeitadas.
- Notificações são persistidas e marcadas como lidas.
- HTTP e WebSocket rejeitam conversa sem amizade aceita.
- Mensagens funcionam com amizade aceita.
- Presença, digitação e reconexão funcionam.
- Bloqueio encerra o acesso.
- Histórico respeita autorização e tenant.
- Usuários antigos continuam funcionando.
- Estados de UX e acessibilidade estão cobertos.

## Fora de escopo

Não implementar nesta fase gamificação avançada, painel SaaS completo ou integração externa de IA.

## Entrega

Apresentar arquivos alterados, endpoints, migrações, testes, riscos e itens prontos para validação antes da Fase 4.
