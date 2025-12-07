Write-Host "SkillForge Servers Status" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check Backend
$backend = netstat -ano | Select-String ":8081" | Select-String "LISTENING"
if ($backend) {
    Write-Host "✓ Backend: RUNNING on http://localhost:8081" -ForegroundColor Green
}
else {
    Write-Host "✗ Backend: NOT RUNNING" -ForegroundColor Red
}

# Check Frontend
$frontend = netstat -ano | Select-String ":5173" | Select-String "LISTENING"
if ($frontend) {
    Write-Host "✓ Frontend: RUNNING on http://localhost:5173" -ForegroundColor Green
}
else {
    Write-Host "✗ Frontend: NOT RUNNING" -ForegroundColor Red
}

Write-Host ""
Write-Host "Opening SkillForge in your browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Cyan
Write-Host "Email: test@test.com" -ForegroundColor White
Write-Host "Password: test123" -ForegroundColor White
