# UNIO — auditoria de prontidão

## Implementado e verificado localmente

- Landing page, autenticação, área privada e 30 personas demonstrativas.
- Separação de contas por sessão e isolamento de dados por usuário.
- Perfil, privacidade, likes, mensagens, feed, comentários, reações e bloqueios.
- Comunidades: listar, criar, entrar e excluir com autorização de proprietário/master.
- Experiência clássica e experiência mágica com toggle persistente.
- Lumi, asset local, animação suave e respeito a `prefers-reduced-motion`.
- Trial premium de sete dias, ativação única e cancelamento demonstrativo.
- Exportação e exclusão da própria conta.
- Logout real com invalidação de token.
- Verificação de e-mail e recuperação de senha demonstrativas com tokens expiráveis.
- Denúncias, moderação, métricas administrativas e autorização master.
- Headers HTTP básicos, rate limiting local e validação de entrada.
- Testes automatizados executados com `API_TESTS_OK`.

## Demonstrativo, não produção

- Armazenamento atual em `data.json`.
- Sessões e rate limiting em memória/local.
- `devToken` para fluxos de e-mail.
- Trial sem cobrança financeira.
- Personas e fotos fictícias/geradas por IA.
- Moderação sem operação humana contínua.

## Necessário antes de produção

1. Substituir `data.json` por banco persistente com migrações e backup.
2. Usar cookies/sessões ou tokens rotacionados com armazenamento seguro.
3. Integrar provedor de e-mail e remover `devToken` das respostas.
4. Integrar gateway de pagamentos e webhooks idempotentes.
5. Mover rate limiting para Redis ou serviço equivalente.
6. Adicionar verificação de idade, consentimentos, termos e política de privacidade.
7. Adicionar observabilidade, alertas, auditoria imutável e moderação operacional.
8. Executar revisão de segurança, testes de carga e validação visual em navegadores reais.

## Comandos de verificação

```powershell
npm test
node server.js
```

O pacote local entregue é uma reconstrução funcional e demonstrativa. Não deve ser apresentado como serviço de produção até os itens acima serem concluídos.
