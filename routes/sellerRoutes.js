const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const {
    addProduct,
    setPrice,
    uploadImage,
    updateDescription,
} = require('../controllers/sellerController');
const upload = require('../middleware/upload');  // Ensure this import is correct

const router = express.Router();

// Add a product
router.post('/add-product', authenticateToken, upload.single('image'), addProduct);

// Update the price of a product
router.post('/set-price', authenticateToken, setPrice);

// Upload an image for a product
router.post('/upload-image', authenticateToken, upload.single('image'), uploadImage);

// Update the description of a product
router.post('/update-description', authenticateToken, updateDescription);

module.exports = router;
