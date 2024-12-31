const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const {
    addProduct,
    setPrice,
    uploadImage,
    updateDescription,
} = require('../controllers/sellerController');

const router = express.Router();

// Add a product
router.post('/add-product', authenticateToken, addProduct);
// Update the price of a product
router.post('/set-price', authenticateToken, setPrice);
// Upload an image for a product
router.post('/upload-image', authenticateToken, uploadImage);
// Update the description of a product
router.post('/update-description', authenticateToken, updateDescription);

module.exports = router;