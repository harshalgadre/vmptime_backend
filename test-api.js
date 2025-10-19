const BASE_URL = 'https://vm-prime-ewmh.onrender.com/api';

// Test fetching products
async function testProductsAPI() {
  try {
    console.log('Testing products API...');
    
    // Fetch all products
    const response = await fetch(`${BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    console.log('Products fetched successfully:', products);
    
    // Test creating a product (admin only)
    const newProduct = {
      name: "Test Watch",
      price: 2999,
      originalPrice: 3999,
      image: "/placeholder.svg",
      category: "Test",
      gender: "Unisex",
      description: "A test watch for API testing",
      features: ["Water Resistant", "Stainless Steel"],
      colors: [{ name: "Silver", color: "#C0C0C0" }]
    };
    
    const createResponse = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-auth': 'admin-secret-key'
      },
      body: JSON.stringify(newProduct)
    });
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.log('Note: Product creation failed (expected if not admin):', errorText);
    } else {
      const result = await createResponse.json();
      console.log('Product created successfully:', result);
      
      // Test deleting the product (admin only)
      const deleteResponse = await fetch(`${BASE_URL}/products/${result._id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-auth': 'admin-secret-key'
          }
      });
      
      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.log('Note: Product deletion failed (expected if not admin):', errorText);
      } else {
        console.log('Product deleted successfully');
      }
    }
    
    return products;
  } catch (error) {
    console.error('API test failed:', error);
    throw error;
  }
}

// Test submitting contact form
async function testContactAPI() {
  try {
    console.log('Testing contact API...');
    
    const contactData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "1234567890",
      subject: "API Test",
      message: "This is a test message from the API test script"
    };
    
    const response = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Contact form submitted successfully:', result);
    return result;
  } catch (error) {
    console.error('Contact API test failed:', error);
    throw error;
  }
}

// Run tests
async function runTests() {
  try {
    await testProductsAPI();
    await testContactAPI();
    console.log('All API tests completed successfully!');
  } catch (error) {
    console.error('API tests failed:', error);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testProductsAPI, testContactAPI, runTests };