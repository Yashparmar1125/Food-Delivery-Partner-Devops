<#
.SYNOPSIS
    Automated Deployment Smoke Test Script for Food Delivery Partner Portal.
.PARAMETER TargetHost
    Base URL of the running portal instance (default: http://localhost:8080).
.PARAMETER MaxRetries
    Maximum number of poll attempts before timing out (default: 15).
.PARAMETER RetryIntervalSec
    Interval in seconds between retries (default: 2).
#>
param(
    [string]$TargetHost = "http://localhost:8080",
    [int]$MaxRetries = 15,
    [int]$RetryIntervalSec = 2
)

$ErrorActionPreference = "Continue"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Starting Automated Smoke Test against target: $TargetHost" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

function Test-Endpoint {
    param(
        [string]$Endpoint,
        [string]$ExpectedKeyword
    )

    $url = "$TargetHost$Endpoint"
    Write-Host "Testing endpoint: $url" -ForegroundColor Yellow

    for ($i = 1; $i -le $MaxRetries; $i++) {
        try {
            $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 5 -ErrorAction Stop
            $json = $response | ConvertTo-Json -Depth 5

            if ($json -match $ExpectedKeyword) {
                Write-Host "SUCCESS: Endpoint $Endpoint responded with keyword '$ExpectedKeyword' on attempt $i." -ForegroundColor Green
                return $true
            }
        }
        catch {
            # Retry on exception
        }

        Write-Host "Attempt $i/$MaxRetries failed. Retrying in $($RetryIntervalSec)s..." -ForegroundColor DarkGray
        Start-Sleep -Seconds $RetryIntervalSec
    }

    Write-Error "ERROR: Endpoint $Endpoint failed smoke test after $MaxRetries attempts."
    return $false
}

$p1 = Test-Endpoint -Endpoint "/actuator/health" -ExpectedKeyword "UP"
$p2 = Test-Endpoint -Endpoint "/api/v1/health" -ExpectedKeyword "UP"
$p3 = Test-Endpoint -Endpoint "/api-docs" -ExpectedKeyword "openapi"

if ($p1 -and $p2 -and $p3) {
    Write-Host "======================================================================" -ForegroundColor Green
    Write-Host "ALL SMOKE TESTS PASSED! Target deployment is healthy and operational." -ForegroundColor Green
    Write-Host "======================================================================" -ForegroundColor Green
    exit 0
} else {
    Write-Host "SMOKE TESTS FAILED! Rollback triggered." -ForegroundColor Red
    exit 1
}
