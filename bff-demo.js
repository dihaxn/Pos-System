// BFF Data Flow Demonstration
// This script demonstrates how the BFF (Backend for Frontend) works

const axios = require('axios');

console.log('🚀 LLOMS BFF Data Flow Demonstration');
console.log('=====================================\n');

// Mock data that the BFF would return
const mockProducts = [
  {
    id: 1,
    name: "Traditional Curry Powder",
    description: "Authentic Sri Lankan curry powder blend",
    price: 15.99,
    stockQuantity: 150,
    status: "ACTIVE",
    category: "Spices",
    outletId: 1
  },
  {
    id: 2,
    name: "Ceylon Tea",
    description: "Premium black tea from Sri Lanka",
    price: 12.50,
    stockQuantity: 200,
    status: "ACTIVE",
    category: "Beverages",
    outletId: 1
  },
  {
    id: 3,
    name: "Coconut Oil",
    description: "Pure virgin coconut oil",
    price: 8.99,
    stockQuantity: 75,
    status: "ACTIVE",
    category: "Oils",
    outletId: 1
  }
];

// Simulate BFF API calls
async function demonstrateBFFDataFlow() {
  console.log('📦 1. GET /api/products - Retrieve all products');
  console.log('Response:', JSON.stringify(mockProducts, null, 2));
  console.log('\n');

  console.log('🔍 2. GET /api/products/1 - Get specific product');
  const product = mockProducts.find(p => p.id === 1);
  console.log('Response:', JSON.stringify(product, null, 2));
  console.log('\n');

  console.log('🔎 3. GET /api/products/search/tea - Search products');
  const searchResults = mockProducts.filter(p => 
    p.name.toLowerCase().includes('tea') || 
    p.description.toLowerCase().includes('tea')
  );
  console.log('Response:', JSON.stringify(searchResults, null, 2));
  console.log('\n');

  console.log('➕ 4. POST /api/products - Create new product');
  const newProduct = {
    id: 4,
    name: "Test Product",
    description: "A test product created via BFF",
    price: 9.99,
    stockQuantity: 50,
    status: "ACTIVE",
    category: "Test",
    outletId: 1
  };
  console.log('Request Body:', JSON.stringify(newProduct, null, 2));
  console.log('Response: Product created successfully with ID 4');
  console.log('\n');

  console.log('✏️ 5. PUT /api/products/1 - Update product');
  const updatedProduct = { ...product, price: 19.99, stockQuantity: 100 };
  console.log('Request Body:', JSON.stringify({ price: 19.99, stockQuantity: 100 }, null, 2));
  console.log('Response:', JSON.stringify(updatedProduct, null, 2));
  console.log('\n');

  console.log('🎉 BFF Data Flow Demonstration Complete!');
  console.log('\n📋 Summary:');
  console.log('- BFF acts as a single entry point for frontend applications');
  console.log('- It aggregates data from multiple microservices');
  console.log('- Provides a consistent API interface for frontend');
  console.log('- Handles authentication, rate limiting, and data transformation');
  console.log('- Reduces complexity for frontend developers');
}

// Run the demonstration
demonstrateBFFDataFlow().catch(console.error);
