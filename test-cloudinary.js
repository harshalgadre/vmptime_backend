// Test Cloudinary configuration

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
  console.log('Testing Cloudinary configuration...');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.log('❌ Cloudinary credentials not properly configured');
    return;
  }
  
  try {
    // Test ping Cloudinary
    const pingResponse = await cloudinary.api.ping();
    console.log('✅ Cloudinary ping successful:', pingResponse);
    
    // Test upload a simple image
    const uploadResponse = await cloudinary.uploader.upload(
      'https://via.placeholder.com/150',
      {
        folder: 'ntroio_products',
        public_id: 'test_image_' + Date.now()
      }
    );
    
    console.log('✅ Cloudinary upload successful:', uploadResponse.secure_url);
    
    // Clean up - delete the test image
    const deleteResponse = await cloudinary.uploader.destroy(uploadResponse.public_id);
    console.log('✅ Test image cleaned up:', deleteResponse);
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
    console.error('Error details:', error);
  }
}

testCloudinary();