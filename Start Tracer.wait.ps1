param(
  [int]$Port = 3000,
  [int]$MaxWaitSeconds = 20
)

$deadline = (Get-Date).AddSeconds($MaxWaitSeconds)
while ((Get-Date) -lt $deadline) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing "http://localhost:$Port/health" -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
      exit 0
    }
  } catch {
  }
  Start-Sleep -Seconds 1
}

exit 1
