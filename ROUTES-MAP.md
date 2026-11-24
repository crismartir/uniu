# UNIU — Mapa de rotas e responsabilidades

| Rota | Responsabilidade | Conteúdo principal |
|---|---|---|
| `/` | Landing | Proposta de valor e entrada |
| `/auth.html` | Autenticação | Login, cadastro e recuperação |
| `/app.html` | Área privada | Descobrir, feed, conversas, experiências e perfil por hash |
| `/magic.html` | Experiência mágica | Lumi, estados, comunidades e celebrações |
| `/admin.html` | Administração | Moderação e plano demonstrativo |

## Hashes da área privada

- `#descobrir`: perfis e recomendações.
- `#feed`: publicações, comentários, reações e conexões relacionadas.
- `#conversas`: messenger protegido.
- `#experiencias`: seleção entre clássico e mágico.
- `#perfil`: perfil e preferências.

O controlador de rota deve esconder módulos fora do contexto, preservando as APIs legadas.
