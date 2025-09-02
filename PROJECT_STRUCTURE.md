# LLOMS Project Structure

This document describes the organized structure of the Little Lanka Order Management System (LLOMS) project.

## 📁 Directory Structure

```
LLOMS/
├── 📁 frontend/                    # React frontend application
│   ├── 📁 src/                     # Source code
│   ├── 📁 public/                  # Static assets
│   ├── package.json                # Frontend dependencies
│   └── vite.config.js              # Vite configuration
│
├── 📁 bff/                         # Node.js BFF service
│   ├── 📁 src/                     # Source code
│   │   ├── 📁 controllers/         # API controllers
│   │   ├── 📁 middlewares/         # Express middlewares
│   │   ├── 📁 routes/              # API routes
│   │   ├── 📁 services/            # Business logic
│   │   └── 📁 utils/               # Utility functions
│   ├── package.json                # BFF dependencies
│   └── server.js                   # Entry point
│
├── 📁 services/                    # Spring Boot microservices
│   ├── 📁 product-service/         # Product management service
│   │   ├── 📁 src/main/java/       # Java source code
│   │   ├── 📁 src/main/resources/  # Configuration files
│   │   ├── pom.xml                 # Maven configuration
│   │   └── Dockerfile              # Container configuration
│   │
│   ├── 📁 user-service/            # User management service
│   │   ├── 📁 src/main/java/       # Java source code
│   │   ├── 📁 src/main/resources/  # Configuration files
│   │   ├── pom.xml                 # Maven configuration
│   │   └── Dockerfile              # Container configuration
│   │
│   └── 📁 outlet-service/          # Outlet operations service
│       ├── 📁 src/main/java/       # Java source code
│       ├── 📁 src/main/resources/  # Configuration files
│       ├── pom.xml                 # Maven configuration
│       └── Dockerfile              # Container configuration
│
├── 📁 mysql/                       # Database initialization
│   └── 📁 init/                    # SQL initialization scripts
│       └── 01-init-databases.sql   # Database setup script
│
├── 📄 package.json                 # Root package.json with scripts
├── 📄 docker-compose.yml           # Docker services configuration
├── 📄 start-project.ps1            # PowerShell startup script
├── 📄 start-project.bat            # CMD startup script
├── 📄 setup-env.ps1                # Environment setup script
├── 📄 health-check.ps1             # Health check script
├── 📄 build.bat                    # Build script for Windows
├── 📄 README.md                    # Main project documentation
├── 📄 PROJECT_STRUCTURE.md         # This file
└── 📄 .gitignore                   # Git ignore rules
```

## 🏗️ Architecture Overview

### Frontend Layer
- **Technology**: React + Vite + Material-UI + Tailwind CSS
- **Purpose**: User interface for the order management system
- **Port**: 5173
- **Build Tool**: Vite

### BFF Layer (Backend for Frontend)
- **Technology**: Node.js + Express + JWT
- **Purpose**: API gateway and authentication service
- **Port**: 3000
- **Features**: 
  - JWT authentication
  - Request routing
  - Service aggregation

### Microservices Layer
- **Product Service**: Product catalog and inventory management
- **User Service**: User management and authentication
- **Outlet Service**: Outlet operations and order processing

### Infrastructure Layer
- **Database**: MySQL 8.0 for data persistence
- **Cache**: Redis for session management
- **Containerization**: Docker for all services

## 🔄 Data Flow

```
User → Frontend → BFF → Microservices → Database
  ↑                                    ↓
  ←────────── Response ────────────────←
```

## 🚀 Development Workflow

### 1. Environment Setup
```bash
# Run environment setup script
.\setup-env.ps1
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm run install-all
```

### 3. Start Services
```bash
# Start all services
.\start-project.ps1

# Or manually
npm run start-all
```

### 4. Health Check
```bash
# Check service health
.\health-check.ps1
```

## 🛠️ Available Commands

### Root Level
- `npm run install-all` - Install all dependencies
- `npm run start-all` - Start all services
- `npm run build-all` - Build all services
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run clean` - Clean build artifacts
- `npm run reset` - Reset everything

### Individual Services
- `npm run start:frontend` - Start frontend only
- `npm run start:bff` - Start BFF only
- `npm run start:product` - Start product service only
- `npm run start:user` - Start user service only
- `npm run start:outlet` - Start outlet service only

## 📊 Service Ports

| Service | Port | Protocol | Description |
|---------|------|----------|-------------|
| Frontend | 5173 | HTTP | React application |
| BFF | 3000 | HTTP | API gateway |
| Product Service | 8087 | HTTP | Product management |
| User Service | 8088 | HTTP | User management |
| Outlet Service | 8089 | HTTP | Outlet operations |
| MySQL | 3306 | TCP | Database |
| Redis | 6379 | TCP | Cache |

## 🔧 Configuration Files

### Environment Files
- `.env` - Root environment variables
- `frontend/.env` - Frontend configuration
- `bff/.env` - BFF service configuration
- `services/*/.env` - Individual service configurations

### Docker Configuration
- `docker-compose.yml` - Multi-service container orchestration
- `*/Dockerfile` - Individual service container definitions

## 📝 Development Guidelines

### Code Organization
- Keep services loosely coupled
- Use consistent naming conventions
- Follow language-specific best practices
- Document API endpoints

### Database Design
- Each service has its own database
- Use consistent naming conventions
- Implement proper indexing
- Follow normalization principles

### API Design
- RESTful API design
- Consistent error handling
- Proper HTTP status codes
- API versioning strategy

## 🚀 Deployment

### Development
- Local development with hot reload
- Docker containers for infrastructure
- Environment-specific configurations

### Production
- Container orchestration (Kubernetes)
- Load balancing
- Monitoring and logging
- CI/CD pipeline integration

## 🔍 Monitoring and Debugging

### Health Checks
- Service health endpoints
- Database connectivity checks
- Container status monitoring

### Logging
- Structured logging
- Log aggregation
- Error tracking

### Performance
- Response time monitoring
- Resource usage tracking
- Bottleneck identification

---

**Note**: This structure follows microservices best practices and provides a scalable foundation for the LLOMS project.
