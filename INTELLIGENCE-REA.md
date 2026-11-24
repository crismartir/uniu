# Inteligência recuperada da engenharia reversa do REA

O pacote `outputs/rea-love` documentou quatro capacidades de produto que foram incorporadas ao UNIU como uma primeira camada local e explicável:

1. **Compatibilidade explicável** — calcula afinidade declarada por interesses do perfil e retorna os motivos, sem diagnóstico ou promessa de compatibilidade perfeita.
2. **Concierge identificado como IA** — sugere perguntas e respostas gentis por intenção textual, sempre opcional e pausável.
3. **Sugestões de conversa** — transforma interesses, rotina e limites em próximos passos de baixa pressão.
4. **Revisão de confiança** — detecta sinais básicos de dados pessoais e possível assédio antes de uma publicação ou mensagem, orientando revisão, denúncia ou bloqueio.

## Contratos locais

- `GET /api/intelligence/recommendations`
- `POST /api/intelligence/coach` com `{ "text": "..." }`
- `POST /api/intelligence/safety-check` com `{ "text": "..." }`

Os contratos exigem autenticação, não chamam provedor externo e identificam a inteligência como local/demonstrativa. A implementação é determinística para permitir auditoria e testes. Uma futura IA externa só poderá ser conectada atrás de um adapter com consentimento, minimização de dados, logs e limites de segurança.
