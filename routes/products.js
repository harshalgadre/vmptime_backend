const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

// Configure Cloudinary storage for product images (if credentials are available)
let upload;
try {
  // Only configure Cloudinary if credentials are available
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'ntroio_products',
        format: async (req, file) => 'jpg',
        public_id: (req, file) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          return 'product-' + uniqueSuffix;
        },
      },
    });
    
    // Configure multer with higher limits to handle large data fields
    upload = multer({ 
      storage: storage,
      limits: {
        fieldSize: 10 * 1024 * 1024, // 10MB limit for field values
        fileSize: 5 * 1024 * 1024,   // 5MB limit for file size
        files: 5                       // Maximum 5 files
      }
    });
  } else {
    // Fallback to memory storage if Cloudinary not configured
    upload = multer({ 
      storage: multer.memoryStorage(),
      limits: {
        fieldSize: 10 * 1024 * 1024, // 10MB limit for field values
        fileSize: 5 * 1024 * 1024,   // 5MB limit for file size
        files: 5                       // Maximum 5 files
      }
    });
  }
} catch (error) {
  console.error('Cloudinary configuration error:', error);
  // Fallback to memory storage if Cloudinary configuration fails
  upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fieldSize: 10 * 1024 * 1024, // 10MB limit for field values
      fileSize: 5 * 1024 * 1024,   // 5MB limit for file size
      files: 5                       // Maximum 5 files
    }
  });
}

// Configure multer for color image uploads with higher limits
const colorImageUpload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 20 * 1024 * 1024, // 20MB limit for field values
    fileSize: 10 * 1024 * 1024,   // 10MB limit for file size
    files: 20                       // Maximum 20 files (4 images per color for up to 5 colors)
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new product (Admin only)
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    let productData;
    
    // Handle both JSON and form data
    if (req.body.data) {
      productData = JSON.parse(req.body.data);
    } else {
      productData = req.body;
    }
    
    // If image was uploaded and we have Cloudinary configured, use the Cloudinary URL
    // Otherwise, use a placeholder or the existing image URL
    if (req.file && req.file.path) {
      productData.image = req.file.path;
    } else if (!productData.image) {
      // Default image if none provided
      productData.image = "/placeholder.svg";
    }
    
    // Process color-specific images
    // We need to preserve existing Cloudinary URLs and not filter them out
    if (productData.colors && Array.isArray(productData.colors)) {
      productData.colors = productData.colors.map(color => {
        // Keep existing Cloudinary URLs, filter out only data URLs
        if (color.images && Array.isArray(color.images)) {
          // Filter out data URLs (they start with 'data:') but keep Cloudinary URLs
          const filteredImages = color.images.filter(img => 
            !img.startsWith('data:') || img.includes('cloudinary')
          );
          return {
            ...color,
            images: filteredImages
          };
        }
        return color;
      });
    }
    
    console.log('Creating product with data:', productData);
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a product (Admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    let productData;
    
    // Handle both JSON and form data
    if (req.body.data) {
      productData = JSON.parse(req.body.data);
    } else {
      productData = req.body;
    }
    
    // If image was uploaded and we have Cloudinary configured, use the Cloudinary URL
    if (req.file && req.file.path) {
      productData.image = req.file.path;
    }
    
    // Process color-specific images
    // We need to preserve existing Cloudinary URLs and not filter them out
    if (productData.colors && Array.isArray(productData.colors)) {
      productData.colors = productData.colors.map(color => {
        // Keep existing Cloudinary URLs, filter out only data URLs
        if (color.images && Array.isArray(color.images)) {
          // Filter out data URLs (they start with 'data:') but keep Cloudinary URLs
          const filteredImages = color.images.filter(img => 
            !img.startsWith('data:') || img.includes('cloudinary')
          );
          return {
            ...color,
            images: filteredImages
          };
        }
        return color;
      });
    }
    
    console.log('Updating product with data:', productData);
    
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete image from Cloudinary if it exists and we have Cloudinary configured
    if (product.image && product.image.includes('cloudinary')) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = product.image.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = 'ntroio_products/' + filename.split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Upload color-specific images (Admin only)
router.post('/:id/color-images', adminAuth, colorImageUpload.array('colorImages', 20), async (req, res) => {
  try {
    const { colorIndex } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'ntroio_products/color_images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      imageUrls.push(result.secure_url);
    }
    
    // Initialize colors array if it doesn't exist
    if (!product.colors) {
      product.colors = [];
    }
    
    // Initialize images array for the color if it doesn't exist
    if (!product.colors[colorIndex]) {
      product.colors[colorIndex] = { images: [] };
    }
    
    if (!product.colors[colorIndex].images) {
      product.colors[colorIndex].images = [];
    }
    
    // Add the new image URLs to the color's images array
    product.colors[colorIndex].images.push(...imageUrls);
    
    // Limit to 4 images per color
    if (product.colors[colorIndex].images.length > 4) {
      product.colors[colorIndex].images = product.colors[colorIndex].images.slice(0, 4);
    }
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error uploading color images:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;