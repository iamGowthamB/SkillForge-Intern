$body = '{"email":"test@test.com","password":"test123"}'
$response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "LOGIN SUCCESSFUL!" -ForegroundColor Green
$response | ConvertTo-Json -Depth 3
