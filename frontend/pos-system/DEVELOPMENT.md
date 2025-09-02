# Development Setup - Authentication Bypassed

## 🚀 **Quick Start for Development**

The authentication system has been temporarily bypassed to allow direct access to all pages for development purposes.

### **Direct Page Access:**
- **`/owner`** - Owner Dashboard (default landing page)
- **`/outlet`** - Outlet Management Page  
- **`/factory-staff`** - Factory Staff Page

### **Development Navigation:**
- **Top-left corner**: Quick navigation buttons to switch between pages
- **Bottom-right corner**: Performance monitor showing optimization status
- **No login required**: All routes are directly accessible

### **What's Commented Out:**
- ✅ `AuthProvider` wrapper in `main.jsx`
- ✅ `AuthContext` usage in `App.jsx`
- ✅ `PrivateRoute` components
- ✅ Login route protection
- ✅ Role-based access control

### **To Re-enable Authentication:**
1. Uncomment `AuthProvider` in `src/main.jsx`
2. Uncomment authentication logic in `src/App.jsx`
3. Uncomment `PrivateRoute` components
4. Update route paths to use constants

### **Current Benefits:**
- 🚀 **Faster Development** - No need to login for each test
- 🔄 **Easy Navigation** - Quick switch between features
- 📱 **Direct Testing** - Test each page independently
- ⚡ **Performance** - Code splitting and lazy loading still active

### **Development Workflow:**
1. Start server: `npm run dev`
2. Navigate directly to any page
3. Use dev navigation panel to switch between features
4. Focus on component development without auth overhead

### **Remember:**
- This setup is **ONLY for development**
- **Never deploy** with authentication bypassed
- Re-enable auth before production builds
- Test authentication flow before final deployment

---
**Happy Coding! 🎉**
