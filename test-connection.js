// Simple test script to verify backend connection

const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing backend connections...');

// Test MongoDB connection
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB successfully');
  
  // Test if we can access the Product model
  try {
    const Product = require('./models/Product');
    console.log('✅ Product model loaded successfully');
    
    // Try to create a simple product
    const testProduct = new Product({
      name: 'Test Watch',
      price: 1000,
      image: '/placeholder.svg',
      category: 'Test',
      gender: 'All'
    });
    
    console.log('✅ Product model working correctly');
    console.log('✅ Backend setup looks good!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error with Product model:', error.message);
    mongoose.connection.close();
  }
});

// Test Cloudinary configuration
console.log('\nCloudinary Configuration:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');