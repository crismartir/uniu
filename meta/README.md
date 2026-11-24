# Supervisão meta do UNIU

`unio-watchdog.ps1` é um supervisor local do runtime. Ele verifica `GET /api/health` periodicamente e inicia `server.js` somente quando a porta configurada não responde e não existe outro processo `server.js` associado à mesma porta.

Execução manual:

```powershell
powershell -ExecutionPolicy Bypass -File .\meta\unio-watchdog.ps1 -Port 4216
```

O supervisor não apaga dados, não encerra processos existentes e registra eventos em `meta-watchdog.log`.

## Loop operacional

`unio-meta-loop.ps1` é a camada de observabilidade do supervisor. Em cada ciclo ele registra:

- saúde do servidor local (`/api/health`);
- resolução DNS de `uniu.love`;
- existência e limpeza do repositório Git;
- presença da configuração do Supabase e a exigência de isolamento por tenant.

Ele grava `meta-loop.log` e o snapshot atual em `meta-status.json`.

Execução:

```powershell
powershell -ExecutionPolicy Bypass -File .\meta\unio-meta-loop.ps1 -Port 4216 -PublicDomain uniu.love
```

Este loop não declara produção pronta só porque o servidor local está saudável. `publicReady` só pode ser tratado como sinal operacional depois que houver uma origem pública, DNS delegado e Supabase/RLS/migrations validados.

## Loop AGB autônomo

`unio-agb-loop.ps1` executa a rotina contínua de validação do produto: saúde HTTP, páginas de autenticação e app, asset do Mimo, presença dos módulos sociais e sintaxe dos scripts críticos. Ele grava `agb-loop.log` e `agb-status.json`. O AGB não inventa correções nem declara produção pronta; falhas de runtime ficam sob responsabilidade do watchdog, enquanto falhas de código ficam registradas para intervenção segura.

Execução:

```powershell
powershell -ExecutionPolicy Bypass -File .\meta\unio-agb-loop.ps1 -Port 4216
```
