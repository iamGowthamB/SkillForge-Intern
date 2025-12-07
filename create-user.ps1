$body = '{"email":"test@test.com","password":"test123","name":"Test User","role":"STUDENT"}'
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Sample user created!" -ForegroundColor Green
    Write-Host "Email: test@test.com"
    Write-Host "Password: test123"
}
catch {
    Write-Host "User may already exist. Try logging in with:" -ForegroundColor Yellow
    Write-Host "Email: test@test.com"
    Write-Host "Password: test123"
}
