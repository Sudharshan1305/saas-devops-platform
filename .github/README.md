# CI/CD Pipeline Documentation

## Workflows

### 1. Lint and Test
- **Trigger**: Push to main/develop, Pull requests
- **Purpose**: Code quality checks and testing
- **Steps**:
  - Lint all services
  - Run automated tests
  - Check code formatting

### 2. Docker Build
- **Trigger**: Push to main, Pull requests
- **Purpose**: Build and push Docker images
- **Steps**:
  - Build Docker images for all services
  - Push to Docker Hub (on main branch only)
  - Tag with commit SHA and latest

### 3. Security Scan
- **Trigger**: Push, Pull requests, Weekly schedule
- **Purpose**: Security vulnerability scanning
- **Steps**:
  - NPM dependency audit
  - Secret scanning with TruffleHog
  - Container vulnerability scan with Trivy

### 4. Code Quality
- **Trigger**: Push, Pull requests
- **Purpose**: Code formatting and linting
- **Steps**:
  - Prettier format check
  - ESLint validation

## GitHub Secrets Required

- `DOCKERHUB_USERNAME` - Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token
- `STRIPE_SECRET_KEY` - Stripe API key (for tests)

## Badge Status

Add these to your main README.md:
```markdown
![Lint and Test](https://github.com/YOUR_USERNAME/saas-devops-platform/actions/workflows/lint-and-test.yml/badge.svg)
![Docker Build](https://github.com/YOUR_USERNAME/saas-devops-platform/actions/workflows/docker-build.yml/badge.svg)
![Security Scan](https://github.com/YOUR_USERNAME/saas-devops-platform/actions/workflows/security-scan.yml/badge.svg)
```