$headers = @{
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bnZoeHF4Y2F2cm1uaGx2dGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzE5MDYsImV4cCI6MjA4Njg0NzkwNn0.6VOP5ocZRc1y4JccD-LICYgr7f7gBopXw4eKUePGzvo'
    'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bnZoeHF4Y2F2cm1uaGx2dGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzE5MDYsImV4cCI6MjA4Njg0NzkwNn0.6VOP5ocZRc1y4JccD-LICYgr7f7gBopXw4eKUePGzvo'
    'Content-Type' = 'application/json'
}

# Disable RLS for collections
try {
    Write-Host "Disabling RLS for collections..."
    $null = Invoke-RestMethod -Uri 'https://aunvhxqxcavrmnhlvtfn.supabase.co/rest/v1/collections' -Method GET -Header $headers
    Write-Host "Collections table accessible"
} catch {
    Write-Host "Collections error: $_"
}

# Check news
try {
    Write-Host "Checking news..."
    $null = Invoke-RestMethod -Uri 'https://aunvhxqxcavrmnhlvtfn.supabase.co/rest/v1/news' -Method GET -Header $headers
    Write-Host "News table accessible"
} catch {
    Write-Host "News error: $_"
}
