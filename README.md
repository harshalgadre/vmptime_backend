# NTRO.IO Backend API

This is the backend API for the NTRO.IO e-commerce watch store.

## Features

- Product management (CRUD operations with optional Cloudinary image storage)
- Order processing
- Contact form with WhatsApp integration
- Admin panel for managing products and orders
- Optional Cloudinary integration for image storage

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Optional Cloudinary for image storage
- RESTful API

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up MongoDB:
   - Install MongoDB locally or use a cloud service like MongoDB Atlas
   - Make sure MongoDB is running

3. (Optional) Set up Cloudinary:
   - Create a free account at [Cloudinary](https://cloudinary.com/)
   - Get your Cloud Name, API Key, and API Secret
   - Update the `.env` file with your Cloudinary credentials

4. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ntroio
   # Uncomment and add your Cloudinary credentials if you want image storage
   # CLOUDINARY_CLOUD_NAME=your_cloud_name
   # CLOUDINARY_API_KEY=your_api_key
   # CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Start the development server:
   ```
   npm run dev
   ```

   Or for production:
   ```
   npm start
   ```

## Deployment

The backend is deployed on Render at: https://vm-prime-ewmh.onrender.com/

### Environment Variables for Deployment

For the backend to work properly in production, you need to set the following environment variables:

1. `MONGODB_URI` - Your MongoDB connection string
2. `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
3. `CLOUDINARY_API_KEY` - Your Cloudinary API key
4. `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
5. `PORT` - Set to 5000 (automatically set by Render)

### Setting Environment Variables on Render

1. Go to your Render dashboard
2. Click on your vm-prime-ewmh service
3. Go to "Environment" tab
4. Add the following key-value pairs:
   - `MONGODB_URI`: your_mongodb_connection_string
   - `CLOUDINARY_CLOUD_NAME`: your_cloudinary_cloud_name
   - `CLOUDINARY_API_KEY`: your_cloudinary_api_key
   - `CLOUDINARY_API_SECRET`: your_cloudinary_api_secret

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product (Admin)
- `PUT /api/products/:id` - Update a product (Admin)
- `DELETE /api/products/:id` - Delete a product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get a specific order (Admin)
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (Admin)

## Admin Authentication

For admin operations, include this header in your requests:
```
x-admin-auth: admin-secret-key
```

In a production environment, this would be replaced with a proper authentication system using JWT tokens or sessions.

## Cloudinary Integration

The backend supports optional Cloudinary integration for image storage:

1. If Cloudinary credentials are provided in `.env`, images will be uploaded to Cloudinary
2. If Cloudinary is not configured, the system will use placeholder images
3. This allows you to run the application without Cloudinary if desired

To enable Cloudinary:
1. Create a free account at https://cloudinary.com/
2. Get your credentials from the dashboard
3. Uncomment and fill in the Cloudinary variables in `.env`

## WhatsApp Integration

The contact form submissions are integrated with WhatsApp. When a user submits the contact form, they receive a link to send the message directly to WhatsApp.

## Testing the API

You can test the API endpoints using tools like Postman or curl:

```bash
# Get all products
curl https://vm-prime-ewmh.onrender.com/api/products

# Create a product (admin only)
curl -X POST https://vm-prime-ewmh.onrender.com/api/products \
  -H "x-admin-auth: admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Watch","price":5999,"category":"Luxury","gender":"Men","image":"/placeholder.svg"}'
```

## Testing the Deployment

You can test if the backend is working properly by visiting:
- https://vm-prime-ewmh.onrender.com/api - Should return {"message": "NTRO.IO Backend API"}
- https://vm-prime-ewmh.onrender.com/api/products - Should return a list of products

## Database Models

### Product
- `name` (String, required)
- `price` (Number, required)
- `originalPrice` (Number)
- `image` (String, required)
- `category` (String, required)
- `gender` (String, required)
- `badge` (String)
- `rating` (Number)
- `reviews` (Number)
- `description` (String)
- `features` (Array of Strings)
- `colors` (Array of Color objects)

### Order
- `customerName` (String, required)
- `customerPhone` (String, required)
- `customerEmail` (String, required)
- `deliveryAddress` (String, required)
- `note` (String)
- `items` (Array of OrderItem objects)
- `subtotal` (Number, required)
- `discount` (Number)
- `total` (Number, required)
- `status` (String, enum: pending, processing, completed, cancelled)

### Contact
- `firstName` (String, required)
- `lastName` (String, required)
- `email` (String, required)
- `phone` (String, required)
- `subject` (String, required)
- `message` (String, required)

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden (Admin required)
- 404: Not Found
- 500: Internal Server Error

## Seeding Initial Data

To populate the database with sample products:

1. Make sure the backend server is running
2. Run the seed script:
   ```
   node seed.js
   ```

This will add sample watch products to your database.