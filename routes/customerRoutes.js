const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();
const {
    getAllProducts,
    addToCart,
    viewCart,
    editCart,
    deleteFromCart,
    buy,
    viewOrderHistory,
} = require('../controllers/customerController');

// Protected customer routes
router.get('/products', authenticateToken, getAllProducts);
router.post('/cart', authenticateToken, addToCart);
router.delete('/cart', authenticateToken, deleteFromCart);
router.post('/cart/edit', authenticateToken, editCart);
router.get('/cart', authenticateToken, viewCart);
router.post('/buy', authenticateToken, buy);
router.get('/orders', authenticateToken, viewOrderHistory);

module.exports = router;
