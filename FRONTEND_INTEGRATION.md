# Frontend Integration Guide

This guide explains how to integrate the frontend with the backend API.

## API Base URL

The API is available at: `http://localhost:5000/api`

## Product Integration

### Fetching Products
To fetch all products, make a GET request to:
```
GET /api/products
```

Example:
```javascript
fetch('http://localhost:5000/api/products')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Fetching a Single Product
To fetch a specific product, make a GET request to:
```
GET /api/products/:id
```

### Admin Product Management
For admin operations (create, update, delete), include the admin header:
```
x-admin-auth: admin-secret-key
```

Example (creating a product):
```javascript
fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-auth': 'admin-secret-key'
  },
  body: JSON.stringify({
    name: 'New Watch',
    price: 5999,
    // ... other product fields
  })
})
```

## Order Integration

### Creating an Order
To create a new order, make a POST request to:
```
POST /api/orders
```

Example:
```javascript
fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerName: 'John Doe',
    customerPhone: '+91 73577 62652',
    customerEmail: 'john@example.com',
    deliveryAddress: '123 Main Street',
    items: [
      {
        productId: 'product-id',
        name: 'Watch Name',
        price: 5999,
        quantity: 1,
        image: '/placeholder.svg'
      }
    ],
    subtotal: 5999,
    total: 5999
  })
})
```

### Admin Order Management
For admin operations on orders, include the admin header:
```
x-admin-auth: admin-secret-key
```

To update order status:
```javascript
fetch('http://localhost:5000/api/orders/order-id/status', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-auth': 'admin-secret-key'
  },
  body: JSON.stringify({
    status: 'processing' // or 'completed', 'cancelled'
  })
})
```

## Contact Form Integration

### Submitting Contact Form
To submit the contact form, make a POST request to:
```
POST /api/contact
```

Example:
```javascript
fetch('http://localhost:5000/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+91 73577 62652',
    subject: 'Product Inquiry',
    message: 'I would like to know more about...'
  })
})
.then(response => response.json())
.then(data => {
  // Redirect to WhatsApp with pre-filled message
  window.location.href = data.whatsappLink;
});
```

## Admin Authentication

For all admin operations, include this header in your requests:
```
x-admin-auth: admin-secret-key
```

In a production environment, this would be replaced with a proper authentication system using tokens or sessions.