const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;
    
    const order = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress
    });
    
    await order.save();
    
    // Clear user cart
    await User.findByIdAndUpdate(userId, { cart: [] });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
