param(
  [int]$Port = 4216,
  [int]$IntervalSeconds = 30,
  [string]$PublicDomain = 'uniu.love',
  [string]$SupabaseUrl = $env:SUPABASE_URL
)

$ErrorActionPreference = 'Continue'
$Root = Split-Path -Parent $PSScriptRoot
$Log = Join-Path $Root 'meta-loop.log'
$Report = Join-Path $Root 'meta-status.json'

function Write-MetaLog([string]$Message) {
  Add-Content -LiteralPath $Log -Value ("{0} {1}" -f (Get-Date -Format o), $Message)
}

function Get-Health {
  try {
    $response = Invoke-WebRequest -Uri ("http://127.0.0.1:{0}/api/health" -f $Port) -UseBasicParsing -TimeoutSec 5
    return [pscustomobject]@{ ok = ($response.StatusCode -eq 200); status = $response.StatusCode }
  } catch {
    return [pscustomobject]@{ ok = $false; status = $null; error = $_.Exception.Message }
  }
}

function Get-DnsState {
  try {
    $records = @(Resolve-DnsName -Name $PublicDomain -ErrorAction Stop | Where-Object { $_.Type -in @('A','CNAME') })
    $values = @($records | ForEach-Object {
      if ($_.IPAddress) { $_.IPAddress } else { $_.NameHost }
    })
    return [pscustomobject]@{ ok = ($records.Count -gt 0); records = $values }
  } catch {
    return [pscustomobject]@{ ok = $false; records = @(); error = $_.Exception.Message }
  }
}

function Get-GitState {
  try {
    $rootCandidate = (Resolve-Path $Root).Path
    $inside = git -C $rootCandidate rev-parse --is-inside-work-tree 2>$null
    if ([string]::IsNullOrWhiteSpace(($inside -join '')) -or (($inside -join '').Trim() -ne 'true')) {
      return [pscustomobject]@{ initialized = $false; clean = $false }
    }
    $changes = @(git -C $rootCandidate status --short)
    return [pscustomobject]@{ initialized = $true; clean = ($changes.Count -eq 0); changes = $changes }
  } catch {
    return [pscustomobject]@{ initialized = $false; clean = $false; error = $_.Exception.Message }
  }
}

function Get-SupabaseState {
  $configured = -not [string]::IsNullOrWhiteSpace($SupabaseUrl)
  $migration = Test-Path (Join-Path $Root 'db\migrations\001_social_core.sql')
  return [pscustomobject]@{ configured = $configured; migrationPresent = $migration; tenantIsolationRequired = $true; note = 'A URL presente não substitui a validação de RLS, migrations e isolamento por tenant.' }
}

function Ensure-Watchdog {
  $running = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -match 'powershell|pwsh' -and $_.CommandLine -match 'unio-watchdog\.ps1'
  })
  if ($running.Count -eq 0) {
    $watchdog = Join-Path $PSScriptRoot 'unio-watchdog.ps1'
    Start-Process powershell.exe -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File',$watchdog,'-Port',[string]$Port -WorkingDirectory $Root -WindowStyle Hidden | Out-Null
    Write-MetaLog "watchdog started by meta loop port=$Port"
  }
}

function Ensure-AgbLoop {
  $running = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -match 'powershell|pwsh' -and $_.CommandLine -match 'unio-agb-loop\.ps1'
  })
  if ($running.Count -eq 0) {
    $agb = Join-Path $PSScriptRoot 'unio-agb-loop.ps1'
    Start-Process powershell.exe -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File',$agb,'-Port',[string]$Port -WorkingDirectory $Root -WindowStyle Hidden | Out-Null
    Write-MetaLog "AGB loop started by meta loop port=$Port"
  }
}

Write-MetaLog "meta loop started port=$Port domain=$PublicDomain interval=${IntervalSeconds}s"
while ($true) {
  Ensure-Watchdog
  Ensure-AgbLoop
  $health = Get-Health
  $dns = Get-DnsState
  $git = Get-GitState
  $supabase = Get-SupabaseState
  $snapshot = [pscustomobject]@{
    timestamp = (Get-Date).ToUniversalTime().ToString('o')
    local = $health
    dns = $dns
    git = $git
    supabase = $supabase
    publicReady = ($dns.ok -and $supabase.configured -and $supabase.migrationPresent)
  }
  $snapshot | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $Report -Encoding UTF8
  Write-MetaLog ("health={0} dns={1} gitInitialized={2} supabaseConfigured={3} publicReady={4}" -f $health.ok, $dns.ok, $git.initialized, $supabase.configured, $snapshot.publicReady)
  if (-not $health.ok) {
    $watchdog = Join-Path $PSScriptRoot 'unio-watchdog.ps1'
    Write-MetaLog "local health failed; watchdog remains the recovery owner: $watchdog"
  }
  Start-Sleep -Seconds $IntervalSeconds
}
