@echo off
echo ====================================
echo Starting SaaS Platform with Docker
echo ====================================

echo.
echo Building Docker images...
docker-compose build

echo.
echo Starting containers...
docker-compose up -d

echo.
echo Waiting for services to be ready...
timeout /t 10

echo.
echo Seeding database...
docker-compose exec billing-service node src/config/seedPlans.js

echo.
echo Creating admin user...
docker-compose exec auth-service node src/config/createAdmin.js

echo.
echo ====================================
echo Setup complete!
echo ====================================
echo.
echo Access your application:
echo Frontend: http://localhost:3000
echo API Gateway: http://localhost:5000
echo API Docs: http://localhost:5000/api-docs
echo.
echo Admin credentials:
echo Email: admin@saas.com
echo Password: admin123
echo ====================================