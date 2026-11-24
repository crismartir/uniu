# UNIU — Critérios de aceite da Fase 1

- Migrações são aditivas e executáveis mais de uma vez.
- Usuários existentes continuam podendo autenticar.
- Campos novos de perfil são opcionais.
- Recuperação de senha usa token temporário, único e não enumerável.
- Sessões antigas são invalidadas após redefinição.
- O messenger exige amizade `ACCEPTED` no servidor e no WebSocket.
- Feed, conversas, descoberta e experiências têm responsabilidades separadas.
- O modo clássico continua funcional sem assets mágicos.
- O modo mágico pode ser ativado e desativado sem perda de dados.
- Estados vazios, erros e carregamentos possuem feedback compreensível.
- Reações emocionais possuem catálogo persistente e extensível.
- Acessibilidade inclui foco visível, labels, alt text e redução de movimento.
- Testes passam em uma instância limpa, sem depender de `data.json` do usuário.
