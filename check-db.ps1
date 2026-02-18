$headers = @{
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bnZoeHF4Y2F2cm1uaGx2dGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzE5MDYsImV4cCI6MjA4Njg0NzkwNn0.6VOP5ocZRc1y4JccD-LICYgr7f7gBopXw4eKUePGzvo'
    'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bnZoeHF4Y2F2cm1uaGx2dGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzE5MDYsImV4cCI6MjA4Njg0NzkwNn0.6VOP5ocZRc1y4JccD-LICYgr7f7gBopXw4eKUePGzvo'
}

# Check collections
try {
    $result = Invoke-RestMethod -Uri 'https://aunvhxqxcavrmnhlvtfn.supabase.co/rest/v1/collections?select=*' -Method GET -Header $headers
    Write-Host "Collections count: $($result.Count)"
    $result | ForEach-Object { Write-Host $_.title }
} catch {
    Write-Host "Error: $_"
}
