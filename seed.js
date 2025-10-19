const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Clear existing products
  await Product.deleteMany({});
  console.log('Cleared existing products');

  // Sample products data
  const products = [
    {
      name: "Audemars Piguet Automatic Edition",
      price: 7999,
      originalPrice: 8999,
      image: "/placeholder.svg",
      category: "Luxury",
      gender: "Men",
      badge: "SALE",
      rating: 4.8,
      reviews: 24,
      description: "Audemars Piguet – Men's Automatic AAA7 Luxury meets performance in this bold, high-grade AP automatic timepiece.",
      features: [
        "Premium AAA7 Quality",
        "Automatic Movement",
        "Sapphire Crystal Glass",
        "Water Resistant 30m",
        "Stainless Steel Case",
        "Premium Rubber Strap"
      ],
      colors: [
        { name: "BLUE", color: "#2E90FA" },
        { name: "GREEN", color: "#12B76A" },
        { name: "GOLD", color: "#F79009" }
      ]
    },
    {
      name: "Rolex Submariner AAA",
      price: 9999,
      originalPrice: 12999,
      image: "/api/placeholder/400/400",
      category: "Luxury",
      gender: "Men",
      badge: "Premium",
      rating: 4.9,
      reviews: 32
    },
    {
      name: "G-Shock Sports Edition",
      price: 3999,
      originalPrice: 4999,
      image: "/api/placeholder/400/400",
      category: "Sports",
      gender: "Men",
      badge: "New",
      rating: 4.5,
      reviews: 18
    },
    {
      name: "Apple Watch Series 9",
      price: 15999,
      originalPrice: 18999,
      image: "/api/placeholder/400/400",
      category: "Digital",
      gender: "All",
      badge: "Trending",
      rating: 4.7,
      reviews: 45
    },
    {
      name: "Omega Speedmaster AAA",
      price: 8999,
      originalPrice: 11999,
      image: "/api/placeholder/400/400",
      category: "Luxury",
      gender: "Women",
      badge: "Sale",
      rating: 4.6,
      reviews: 28
    },
    {
      name: "Casio Vintage Gold",
      price: 2999,
      originalPrice: 3999,
      image: "/api/placeholder/400/400",
      category: "Classic",
      gender: "Women",
      badge: "Retro",
      rating: 4.3,
      reviews: 15
    }
  ];

  try {
    await Product.insertMany(products);
    console.log('Sample products inserted successfully');
  } catch (error) {
    console.error('Error inserting sample products:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
});