# 🏢 Little Lanka Order Management System - Enterprise Architecture

## 📋 Overview

This document outlines the enterprise-level architecture of the Little Lanka Order Management System (LLOMS), a comprehensive microservices-based solution for bakery and food retail operations.

## 🏗️ System Architecture

### Microservices Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Discovery      │
│   Applications  │◄──►│   (Spring       │◄──►│  Service        │
│   (React)       │    │    Cloud)       │    │  (Eureka)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────────────┐
        │                 Microservices Layer                     │
        ├─────────────────┬─────────────────┬─────────────────────┤
        │  Product        │  User           │  Outlet             │
        │  Service        │  Service        │  Service            │
        │  (PostgreSQL)   │  (MySQL)        │  (MongoDB)          │
        ├─────────────────┼─────────────────┼─────────────────────┤
        │  Reporting      │  Notification   │  Inventory          │
        │  Service        │  Service        │  Service            │
        │  (TimescaleDB)  │  (Redis)        │  (PostgreSQL)       │
        └─────────────────┴─────────────────┴─────────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────────────┐
        │                Infrastructure Layer                     │
        ├─────────────────┬─────────────────┬─────────────────────┤
        │  Message Queue  │  Cache          │  Monitoring         │
        │  (Kafka)        │  (Redis)        │  (Prometheus)       │
        ├─────────────────┼─────────────────┼─────────────────────┤
        │  Logging        │  Security       │  CI/CD              │
        │  (ELK Stack)    │  (JWT + RBAC)   │  (GitHub Actions)   │
        └─────────────────┴─────────────────┴─────────────────────┘
```

## 🔧 Technology Stack

### Backend Services

- **Framework**: Spring Boot 3.3.6
- **Language**: Java 17
- **Build Tool**: Maven
- **API Documentation**: OpenAPI 3 (Swagger)
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL, MySQL, MongoDB, TimescaleDB
- **Message Queue**: Apache Kafka
- **Cache**: Redis
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway

### Frontend Applications

- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: React Context + Custom Hooks
- **UI Library**: Material-UI, Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
LLOMS/
├── services/                          # Microservices
│   ├── api-gateway/                   # API Gateway Service
│   ├── discovery-service/             # Service Discovery (Eureka)
│   ├── product-service/               # Product Management
│   ├── user-service/                  # User & Authentication
│   ├── outlet-service/                # Outlet Management
│   ├── reporting-service/             # Analytics & Reports
│   └── notification-service/          # Notifications
├── frontend/                          # Frontend Applications
│   ├── pos-system/                    # Point of Sale System
│   └── user-website/                  # Customer Website
├── infrastructure/                    # Infrastructure as Code
│   ├── docker/                        # Docker configurations
│   ├── kubernetes/                    # K8s manifests
│   └── monitoring/                    # Monitoring configs
├── docs/                              # Documentation
└── scripts/                           # Deployment scripts
```

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+
- Maven 3.8+

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/lloms.git
   cd lloms
   ```

2. **Start infrastructure services**

   ```bash
   docker-compose up -d postgres redis kafka
   ```

3. **Start microservices**

   ```bash
   # Start discovery service first
   cd services/discovery-service && mvn spring-boot:run

   # Start other services
   cd services/product-service && mvn spring-boot:run
   cd services/user-service && mvn spring-boot:run
   # ... other services
   ```

4. **Start frontend applications**

   ```bash
   # POS System
   cd frontend/pos-system && npm install && npm run dev

   # User Website
   cd frontend/user-website && npm install && npm run dev
   ```

## 🔐 Security Features

### Authentication & Authorization

- **JWT-based Authentication**: Stateless token-based auth
- **Role-Based Access Control (RBAC)**: Admin, Manager, Cashier, Customer roles
- **Multi-Factor Authentication**: TOTP support for admin users
- **Password Policies**: Strong password requirements
- **Session Management**: Secure session handling

### API Security

- **Rate Limiting**: Per-user and per-endpoint rate limits
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## 📊 Monitoring & Observability

### Application Monitoring

- **Health Checks**: Spring Actuator endpoints
- **Metrics**: Prometheus metrics collection
- **Distributed Tracing**: Request tracing across services
- **Performance Monitoring**: Response time and throughput metrics

### Logging

- **Structured Logging**: JSON-formatted logs
- **Log Aggregation**: Centralized logging with ELK stack
- **Log Levels**: Configurable log levels per environment
- **Audit Logging**: Security and business event logging

## 🧪 Testing Strategy

### Backend Testing

- **Unit Tests**: JUnit 5 with Mockito
- **Integration Tests**: TestContainers for database testing
- **Contract Testing**: Pact for service contracts
- **Load Testing**: JMeter for performance testing

### Frontend Testing

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress for E2E testing
- **Visual Regression**: Storybook for component testing

## 🚀 Deployment

### Development Environment

```bash
# Using Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

### Production Environment

```bash
# Using Kubernetes
kubectl apply -f infrastructure/kubernetes/
```

### CI/CD Pipeline

- **Build**: Maven/NPM builds with dependency caching
- **Test**: Automated test execution
- **Security Scan**: OWASP dependency check
- **Deploy**: Blue-green deployment strategy

## 📈 Performance & Scalability

### Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Caching Strategy**: Multi-level caching (Redis, Application, CDN)
- **Connection Pooling**: Optimized database connections
- **Async Processing**: Non-blocking operations for I/O

### Scalability Features

- **Horizontal Scaling**: Stateless services for easy scaling
- **Load Balancing**: Round-robin and weighted load balancing
- **Auto-scaling**: Kubernetes HPA based on metrics
- **Database Sharding**: Horizontal database partitioning

## 🔧 Configuration Management

### Environment Configuration

- **Profiles**: Spring profiles for different environments
- **External Config**: Config Server for centralized configuration
- **Secrets Management**: Kubernetes secrets for sensitive data
- **Feature Flags**: Toggle features without deployment

## 📚 API Documentation

### OpenAPI Specification

- **Interactive Documentation**: Swagger UI at `/swagger-ui.html`
- **API Contracts**: OpenAPI 3.0 specifications
- **Code Generation**: Client SDK generation
- **Versioning**: API versioning strategy

## 🛠️ Development Guidelines

### Code Standards

- **Java**: Google Java Style Guide
- **JavaScript**: ESLint + Prettier configuration
- **Git**: Conventional Commits specification
- **Documentation**: Javadoc and JSDoc standards

### Architecture Patterns

- **Domain-Driven Design**: Clear domain boundaries
- **CQRS**: Command Query Responsibility Segregation
- **Event Sourcing**: Audit trail and event replay
- **Saga Pattern**: Distributed transaction management

## 📞 Support & Maintenance

### Monitoring & Alerting

- **Health Dashboards**: Grafana dashboards for system health
- **Alert Rules**: Prometheus alerting rules
- **Incident Response**: Automated incident response procedures
- **Performance Baselines**: SLA monitoring and reporting

### Backup & Recovery

- **Database Backups**: Automated daily backups
- **Disaster Recovery**: Multi-region deployment strategy
- **Data Retention**: Configurable data retention policies
- **Recovery Testing**: Regular disaster recovery drills

## 🔄 Version History

- **v1.0.0**: Initial enterprise release
- **v1.1.0**: Added advanced reporting features
- **v1.2.0**: Implemented real-time notifications
- **v2.0.0**: Microservices architecture migration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📧 Contact

- **Project Lead**: [Your Name](mailto:your.email@example.com)
- **Technical Lead**: [Technical Lead](mailto:tech.lead@example.com)
- **Project Repository**: [GitHub Repository](https://github.com/your-org/lloms)
