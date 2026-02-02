# Script para crear estructura de backend para Sistema de Gestión Hotelera
# Ejecútalo en PowerShell: .\crear-backend.ps1 (ajusta el path si es necesario)

# Crear carpeta raíz si no existe
if (-not (Test-Path -Path "backend")) {
    New-Item -ItemType Directory -Path "backend"
}
Set-Location -Path "backend"

# Crear subcarpetas
$folders = @("config", "controllers", "services", "routes", "middleware")
foreach ($folder in $folders) {
    if (-not (Test-Path -Path $folder)) {
        New-Item -ItemType Directory -Path $folder
    }
}

# Crear archivos en config
New-Item -ItemType File -Path "config/db.js" -Force

# Crear archivos en controllers
$controllers = @("authController.js", "hotelController.js", "habitacionController.js", "clienteController.js", "reservaController.js", "reporteController.js")
foreach ($file in $controllers) {
    New-Item -ItemType File -Path "controllers/$file" -Force
}

# Crear archivos en services
New-Item -ItemType File -Path "services/dbService.js" -Force

# Crear archivos en routes
$routes = @("authRoutes.js", "hotelRoutes.js", "habitacionRoutes.js", "clienteRoutes.js", "reservaRoutes.js", "reporteRoutes.js")
foreach ($file in $routes) {
    New-Item -ItemType File -Path "routes/$file" -Force
}

# Crear archivos en middleware
New-Item -ItemType File -Path "middleware/authMiddleware.js" -Force

# Crear archivos raíz
New-Item -ItemType File -Path ".env" -Force
New-Item -ItemType File -Path "server.js" -Force

# Crear package.json básico
$packageJsonContent = @'
{
  "name": "hotelera-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mssql": "^10.0.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.4.5",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  }
}
'@
Set-Content -Path "package.json" -Value $packageJsonContent

Write-Host "Estructura creada exitosamente en ./backend/ 🚀"
Write-Host "Próximos pasos: cd backend; npm install; (luego llena los archivos con código)"