# Docker Setup Guide

## Prerequisites

- Docker Desktop installed
- Docker Compose v2.x
- Ports available: 3000, 5000-5004, 6379, 27017

## Quick Start

### 1. Build and Start
```bash
# From project root
docker-compose build
docker-compose up -d
```

### 2. Seed Database
```bash
docker-compose exec billing-service node src/config/seedPlans.js
docker-compose exec auth-service node src/config/createAdmin.js
docker-compose exec billing-service node src/config/updatePriceIds.js
```

### 3. Access Application

- Frontend: http://localhost:3000
- API Gateway: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

## Useful Commands

### View Status
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f auth-service
```

### Restart Service
```bash
docker-compose restart auth-service
```

### Stop All
```bash
docker-compose down
```

### Fresh Start (deletes data)
```bash
docker-compose down -v
docker-compose up -d
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5000

# Stop that process or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs auth-service

# Rebuild
docker-compose build auth-service
docker-compose up -d auth-service
```

### Database Connection Issues
```bash
# Check MongoDB health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB
docker-compose restart mongodb
```

## Architecture
```
Frontend (3000) → API Gateway (5000) → Services (5001-5004)
                                          ↓
                                    MongoDB (27017)
                                    Redis (6379)
```

## Volumes

- `mongodb-data`: Persists database
- `redis-data`: Persists cache

To reset all data:
```bash
docker-compose down -v
```
```

---

## ✅ PHASE 2 COMPLETE! 🎉

---

## 🏆 PHASE 2 SUMMARY - WHAT WE'VE BUILT

### ✅ Docker Implementation

1. **Dockerfiles Created**
   - Multi-stage builds for optimization
   - Non-root users for security
   - Health checks for all services
   - Alpine Linux for smaller images

2. **Docker Compose Setup**
   - Complete orchestration
   - Service dependencies managed
   - Network isolation
   - Volume persistence
   - Environment variable management

3. **Container Architecture**
```
   Frontend Container (Nginx)
           ↓
   API Gateway Container
           ↓
   ┌───────┼───────┬───────┬────────┐
   Auth    Billing  Usage   Admin
   Container Container Container Container
           ↓
   MongoDB Container
   Redis Container