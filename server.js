const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
// Use PORT from environment variable, default to 5000
const PORT = process.env.PORT || 5000;

console.log(`Starting server with PORT: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
// If you're using the cors middleware
app.use(cors({
  origin: [
    'https://vmprime-fronetned-1.onrender.com',
    'https://vm-prime-tby1.onrender.com'  // Keep the old one if needed
  ],
  credentials: true
}));

// Middleware
app.use(cors({
  origin: 'https://vm-prime-tby1.onrender.com', // Allow requests from your frontend
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');

// API routes should come BEFORE static file serving
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Default API route
app.get('/api', (req, res) => {
  res.json({ message: 'NTRO.IO Backend API' });
});

// For API routes that don't match any defined routes, return a 404
app.get('*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.use(express.static(path.join(__dirname, 'public')));
app.post('/', (req, res)  => { 
  res.send('Hello World')
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'SET' : 'NOT SET'}`);
  console.log(`Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET'}`);
});