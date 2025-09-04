# LLOMS Account Setup & URL Guide

## 🔑 **Default Accounts (Already Created)**

### **Owner Account (Full Access)**

- **Username:** `owner`
- **Password:** `owner123`
- **Email:** `owner@lloms.com`
- **Role:** `OWNER` (Full system permissions)
- **Access:** All features, user management, system configuration

### **Database Accounts (Already Configured)**

- **MySQL Root:** `root` / `lloms_prod_password_2024`
- **MySQL User:** `lloms_user` / `lloms_user_password_2024`
- **Redis:** Password protected with `lloms_redis_password_2024`

## 🌐 **Application URLs**

### **Frontend Applications**

- **POS System:** http://localhost:5174
- **User Website:** http://localhost:5173

### **Backend Services**

- **BFF API:** http://localhost:3000
- **API Gateway:** http://localhost:8080
- **Discovery Service:** http://localhost:8761

### **Microservices**

- **User Service:** http://localhost:8088
- **Product Service:** http://localhost:8087
- **Outlet Service:** http://localhost:8089
- **Reporting Service:** http://localhost:8090

### **Database Connections**

- **MySQL:** localhost:3307
- **Redis:** localhost:6380
- **PostgreSQL:** localhost:5432

## 🚀 **How to Start the System**

### **Option 1: Quick Start (Recommended)**

```powershell
.\start-production.ps1
```

### **Option 2: Manual Start**

```powershell
# Start databases
docker-compose -f docker-compose.production.yml up -d mysql redis

# Start services (in separate terminals)
cd services\discovery-service && mvn spring-boot:run
cd services\user-service && mvn spring-boot:run
cd services\product-service && mvn spring-boot:run
cd services\outlet-service && mvn spring-boot:run
cd services\reporting-service && mvn spring-boot:run
cd services\api-gateway && mvn spring-boot:run
cd bff && npm start
cd frontend\pos-system && npm run dev
cd frontend\user-website && npm run dev
```

## 👥 **Creating Additional User Accounts**

### **Through the Application**

1. Login as `owner` (owner123)
2. Go to User Management
3. Create new users with different roles:
   - **MANAGER:** Can manage outlets and products
   - **CASHIER:** Can process orders and sales
   - **CUSTOMER:** Can place orders

### **Through Database (Advanced)**

```sql
-- Connect to MySQL on port 3307
-- Username: root, Password: lloms_prod_password_2024

USE userDb;

-- Create a new manager
INSERT INTO users (username, email, password, first_name, last_name, role)
VALUES ('manager1', 'manager@lloms.com', '$2a$10$encrypted_password', 'John', 'Manager', 'MANAGER');

-- Create a new cashier
INSERT INTO users (username, email, password, first_name, last_name, role)
VALUES ('cashier1', 'cashier@lloms.com', '$2a$10$encrypted_password', 'Jane', 'Cashier', 'CASHIER');
```

## 🔧 **Environment Configuration**

### **Production Environment (.env.production)**

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=lloms_prod_password_2024
MYSQL_DATABASE=lloms_production
MYSQL_USER=lloms_user
MYSQL_PASSWORD=lloms_user_password_2024

# JWT Configuration
JWT_SECRET=lloms_jwt_secret_key_2024_production_secure
JWT_EXPIRATION=86400

# Service Ports
DISCOVERY_SERVICE_PORT=8761
API_GATEWAY_PORT=8080
USER_SERVICE_PORT=8088
PRODUCT_SERVICE_PORT=8087
OUTLET_SERVICE_PORT=8089
REPORTING_SERVICE_PORT=8090
BFF_PORT=3000
POS_FRONTEND_PORT=5174
USER_WEBSITE_PORT=5173
```

## 🛡️ **Security Notes**

1. **Change Default Passwords** in production
2. **Use HTTPS** for production deployment
3. **Configure proper firewall** rules
4. **Regular database backups**
5. **Monitor system logs**

## 📱 **Mobile/External Access**

To access from other devices on your network:

1. Find your computer's IP address: `ipconfig`
2. Replace `localhost` with your IP address
3. Example: `http://192.168.1.100:5174`

## 🔍 **Troubleshooting**

### **Check if services are running:**

```powershell
netstat -an | findstr ":5174\|:5173\|:3000\|:8080"
```

### **Check database connectivity:**

```powershell
docker ps | findstr "mysql\|redis"
```

### **View service logs:**

```powershell
docker logs lloms-mysql-prod
docker logs lloms-redis-prod
```

## ✅ **Ready to Use!**

Your LLOMS system is now ready with:

- ✅ Default owner account created
- ✅ All databases configured
- ✅ All services configured
- ✅ Production-ready setup

**Just run `.\start-production.ps1` and start using the system!**
