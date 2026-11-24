param(
  [int]$Port = 4216,
  [int]$IntervalSeconds = 60
)

$ErrorActionPreference = 'Continue'
$Root = Split-Path -Parent $PSScriptRoot
$Log = Join-Path $Root 'agb-loop.log'
$Report = Join-Path $Root 'agb-status.json'

function Write-AgbLog([string]$Message) {
  Add-Content -LiteralPath $Log -Value ("{0} {1}" -f (Get-Date -Format o), $Message)
}

function Check-Http([string]$Path) {
  try {
    $r = Invoke-WebRequest -Uri ("http://127.0.0.1:{0}{1}" -f $Port,$Path) -UseBasicParsing -TimeoutSec 5
    [pscustomobject]@{ ok = ($r.StatusCode -eq 200); status = $r.StatusCode }
  } catch {
    [pscustomobject]@{ ok = $false; status = $null; error = $_.Exception.Message }
  }
}

function Check-File([string]$Name) {
  $path = Join-Path $Root $Name
  [pscustomobject]@{ name = $Name; ok = (Test-Path -LiteralPath $path); path = $path }
}

function Check-NodeSyntax([string]$Name) {
  $path = Join-Path $Root $Name
  if (-not (Test-Path -LiteralPath $path)) { return [pscustomobject]@{ name=$Name; ok=$false; error='missing_file' } }
  node --check $path 2>&1 | Out-Null
  [pscustomobject]@{ name=$Name; ok=($LASTEXITCODE -eq 0) }
}

Write-AgbLog "AGB loop started port=$Port interval=${IntervalSeconds}s"
while ($true) {
  $health = Check-Http '/api/health'
  $checks = @(
    (Check-Http '/auth.html'),
    (Check-Http '/app.html'),
    (Check-File 'mimo-reactions.png'),
    (Check-File 'feed.js'),
    (Check-File 'server.js'),
    (Check-NodeSyntax 'server.js'),
    (Check-NodeSyntax 'feed.js')
  )
  $failed = @($checks | Where-Object { -not $_.ok })
  $snapshot = [pscustomobject]@{
    timestamp = (Get-Date).ToUniversalTime().ToString('o')
    mode = 'AGB-autonomous'
    local = $health
    checks = $checks
    healthy = ($health.ok -and $failed.Count -eq 0)
    action = if ($failed.Count -eq 0) { 'observe_and_continue' } else { 'watchdog_owns_runtime_recovery' }
  }
  $snapshot | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $Report -Encoding UTF8
  Write-AgbLog ("healthy={0} failedChecks={1} action={2}" -f $snapshot.healthy,$failed.Count,$snapshot.action)
  Start-Sleep -Seconds $IntervalSeconds
}
