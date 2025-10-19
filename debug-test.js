// Debug test script for backend API
const BASE_URL = 'https://vm-prime-ewmh.onrender.com/api';

async function debugTest() {
  console.log('Running debug tests...');
  
  try {
    // Test 1: Fetch all products
    console.log('\n1. Testing GET /products');
    const productsResponse = await fetch(`${BASE_URL}/products`);
    console.log('Status:', productsResponse.status);
    const productsData = await productsResponse.json();
    console.log('Products count:', productsData.length);
    
    // Test 2: Try to create a product without auth (should fail)
    console.log('\n2. Testing POST /products without auth (should fail)');
    const postResponse = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Product',
        price: 999,
        category: 'Test',
        gender: 'Unisex',
        image: '/placeholder.svg'
      })
    });
    console.log('Status:', postResponse.status);
    const postData = await postResponse.json();
    console.log('Response:', postData);
    
    // Test 3: Try to create a product with auth (should succeed)
    console.log('\n3. Testing POST /products with auth');
    const authPostResponse = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-auth': 'admin-secret-key'
      },
      body: JSON.stringify({
        name: 'Test Product',
        price: 999,
        category: 'Test',
        gender: 'Unisex',
        image: '/placeholder.svg'
      })
    });
    console.log('Status:', authPostResponse.status);
    const authPostData = await authPostResponse.json();
    console.log('Response:', authPostData);
    
    // Test 4: Try to delete the created product
    if (authPostData._id) {
      console.log('\n4. Testing DELETE /products/:id with auth');
      const deleteResponse = await fetch(`${BASE_URL}/products/${authPostData._id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-auth': 'admin-secret-key'
        }
      });
      console.log('Status:', deleteResponse.status);
      const deleteData = await deleteResponse.json();
      console.log('Response:', deleteData);
    }
    
    console.log('\nDebug tests completed successfully!');
    
  } catch (error) {
    console.error('Debug test failed:', error);
  }
}

// Run the debug test
debugTest();