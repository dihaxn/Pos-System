const axios = require('axios');
const {userUrl} = require('../config');

// Mock user data for authentication
const mockUsers = [
  {
    userId: 1,
    userName: "outlet_staff",
    password: "outlet123",
    roleId: 1,
    outletID: 1
  },
  {
    userId: 2,
    userName: "factory_staff", 
    password: "factory123",
    roleId: 2,
    outletID: 1
  },
  {
    userId: 3,
    userName: "owner",
    password: "owner123",
    roleId: 3,
    outletID: 1
  }
];

const authenticateUser = async (username, password) => {
    try {
        // First try to authenticate with the real user service
        const loginData = {
            userName: username,
            password: password,
        };     

        try {
            const response = await axios.post(`${userUrl}/api/v1/user/login`, loginData, { 
                headers: { 'Content-Type': 'application/json' } 
            });
            return response.data.data;
        } catch (serviceError) {
            // If user service is not available, fall back to mock authentication
            console.log('User service not available, using mock authentication');
            
            const mockUser = mockUsers.find(user => 
                user.userName === username && user.password === password
            );
            
            if (mockUser) {
                return mockUser;
            }
            
            return null;
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
};

module.exports = { authenticateUser };
