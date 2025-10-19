const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: String,
  color: String,
  images: [String] // Array of image URLs for this color
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Rado", "Rolex", "Fossil", "Armani", "Casio", "Tissot", 
      "G-Shock", "Hublot", "Patel", "Tag", "Cartier", "Tommy"
    ]
  },
  gender: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Unisex']
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  description: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    enum: ['new', 'sale', 'premium', 'limited']
  },
  colors: [colorSchema],
  features: [String],
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);