const { spawn } = require('child_process');
const path = require('path');

// Function to start MongoDB
function startMongoDB() {
  console.log('Starting MongoDB...');
  
  // For Windows
  if (process.platform === 'win32') {
    const mongod = spawn('mongod', ['--dbpath', path.join(__dirname, 'data')], {
      stdio: 'inherit'
    });
    
    mongod.on('error', (err) => {
      console.log('Failed to start MongoDB. Please ensure MongoDB is installed and in your PATH.');
      console.log('You can download MongoDB from: https://www.mongodb.com/try/download/community');
      startBackend();
    });
    
    mongod.on('spawn', () => {
      console.log('MongoDB started successfully');
      setTimeout(startBackend, 3000); // Wait a bit for MongoDB to fully start
    });
  } else {
    // For Unix-like systems
    const mongod = spawn('mongod', [], {
      stdio: 'inherit'
    });
    
    mongod.on('error', (err) => {
      console.log('Failed to start MongoDB. Please ensure MongoDB is installed and in your PATH.');
      console.log('You can install MongoDB with: sudo apt-get install mongodb');
      startBackend();
    });
    
    mongod.on('spawn', () => {
      console.log('MongoDB started successfully');
      setTimeout(startBackend, 3000); // Wait a bit for MongoDB to fully start
    });
  }
}

// Function to start the backend server
function startBackend() {
  console.log('Starting backend server...');
  
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit'
  });
  
  server.on('error', (err) => {
    console.log('Failed to start backend server:', err.message);
  });
  
  server.on('spawn', () => {
    console.log('Backend server started successfully');
    console.log('API available at: http://localhost:5000');
  });
}

// Create data directory if it doesn't exist
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Starting NTRO.IO Backend...');
console.log('============================');

// Try to start MongoDB first, then the backend
startMongoDB();