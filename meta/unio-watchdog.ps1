param(
  [int]$Port = 4216,
  [int]$IntervalSeconds = 10,
  [string]$DataFile = 'data.json'
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Log = Join-Path $Root 'meta-watchdog.log'

function Write-GuardianLog([string]$Message) {
  Add-Content -LiteralPath $Log -Value ("{0} {1}" -f (Get-Date -Format o), $Message)
}

function Get-ServerProcess {
  $listeners = @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
  foreach ($listener in $listeners) {
    $process = Get-CimInstance Win32_Process -Filter ("ProcessId={0}" -f $listener.OwningProcess)
    if ($process -and $process.CommandLine -match 'server\.js') { $process }
  }
}

function Start-UnioServer {
  $env:PORT = [string]$Port
  $env:DATA_FILE = $DataFile
  $process = Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -WorkingDirectory $Root -WindowStyle Hidden -PassThru
  Write-GuardianLog "server started pid=$($process.Id) port=$Port"
}

Write-GuardianLog "watchdog started port=$Port interval=${IntervalSeconds}s"
while ($true) {
  $healthy = $false
  try {
    $response = Invoke-WebRequest -Uri ("http://127.0.0.1:{0}/api/health" -f $Port) -UseBasicParsing -TimeoutSec 5
    $healthy = $response.StatusCode -eq 200
  } catch {
    $healthy = $false
  }

  if (-not $healthy) {
    $existing = @(Get-ServerProcess)
    if ($existing.Count -eq 0) {
      Write-GuardianLog 'health check failed; starting server'
      Start-UnioServer
    } else {
      Write-GuardianLog "health check failed; existing server pid=$($existing[0].ProcessId) left untouched"
    }
  }

  Start-Sleep -Seconds $IntervalSeconds
}
