# Register test user for SkillForge
$body = @{
    email    = "test@test.com"
    password = "test123"
    name     = "Test User"
    role     = "STUDENT"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✓ Sample user created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login credentials:" -ForegroundColor Cyan
    Write-Host "Email: test@test.com" -ForegroundColor White
    Write-Host "Password: test123" -ForegroundColor White
    Write-Host ""
    Write-Host "User ID: $($response.userId)" -ForegroundColor Yellow
    Write-Host "Role: $($response.role)" -ForegroundColor Yellow
}
catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "User already exists! You can login with:" -ForegroundColor Yellow
        Write-Host "Email: test@test.com" -ForegroundColor White
        Write-Host "Password: test123" -ForegroundColor White
    }
    else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
