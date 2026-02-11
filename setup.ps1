# LMS Setup and Start Script for Windows
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LMS - Learning Management System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install Backend Dependencies
Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location -Path "backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing backend dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green

# Create Admin User
Write-Host ""
Write-Host "Creating admin user..." -ForegroundColor Yellow
node createAdmin.js
Write-Host ""

# Go back to root and install Frontend Dependencies
Set-Location -Path ".."
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location -Path "frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing frontend dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green

# Go back to root
Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "1. Open a terminal and run: cd backend && npm start" -ForegroundColor White
Write-Host "2. Open another terminal and run: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "Admin credentials:" -ForegroundColor Yellow
Write-Host "Username: admin" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
