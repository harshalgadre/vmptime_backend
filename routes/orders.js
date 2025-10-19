const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const adminAuth = require('../middleware/adminAuth');

// Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID for public tracking (no auth required)
router.get('/track/:id', async (req, res) => {
  try {
    // Allow searching by full ID or partial ID
    const orderId = req.params.id;
    let order = await Order.findById(orderId);
    
    // If not found by full ID, try to find by partial match
    if (!order) {
      order = await Order.findOne({
        _id: { $regex: orderId, $options: 'i' }
      });
    }
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Return only necessary information for tracking
    const orderData = {
      _id: order._id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      deliveryAddress: order.deliveryAddress,
      note: order.note,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt
    };
    
    res.json(orderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Ensure shipping field is included
    if (orderData.shipping === undefined) {
      orderData.shipping = 0;
    }
    
    // Set default payment status
    if (!orderData.paymentStatus) {
      orderData.paymentStatus = 'pending';
    }
    
    const order = new Order(orderData);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order payment status (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { paymentStatus, transactionId, verificationNotes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, transactionId, verificationNotes },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;