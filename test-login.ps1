$body = '{"email":"test@test.com","password":"test123"}'
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "LOGIN SUCCESSFUL!" -ForegroundColor Green
    Write-Host "Token: $($response.accessToken.substring(0,50))..."
    Write-Host "User: $($response.name)"
    Write-Host "Role: $($response.role)"
}
catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
}
