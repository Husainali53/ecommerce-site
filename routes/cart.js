const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get cart
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart.productId');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.params.userId);
    
    const cartItem = user.cart.find(item => item.productId.toString() === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }
    
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove from cart
router.post('/:userId/remove', async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.params.userId);
    
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Clear cart
router.post('/:userId/clear', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
