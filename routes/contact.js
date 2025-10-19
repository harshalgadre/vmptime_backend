const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const adminAuth = require('../middleware/adminAuth');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    
    // For WhatsApp integration, we'll send a response with WhatsApp link
    // In a real implementation, you would integrate with WhatsApp API
    const whatsappMessage = `New Contact Form Submission:
Name: ${contact.firstName} ${contact.lastName}
Email: ${contact.email}
Phone: ${contact.phone}
Subject: ${contact.subject}
Message: ${contact.message}`;
    
    res.status(201).json({
      message: 'Contact form submitted successfully',
      whatsappLink: `https://wa.me/73577 62652?text=${encodeURIComponent(whatsappMessage)}`
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all contacts (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;