const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const {
    addProduct,
    setPrice,
    uploadImage,
    updateDescription,
    getProductsBySeller,
    deleteProduct,
} = require('../controllers/sellerController');
const upload = require('../middleware/upload');  // Ensure this import is correct

const router = express.Router();

// Add a product
router.post('/add-product', authenticateToken, upload.single('image'), addProduct);

// Update the price of a product
router.put('/set-price', authenticateToken, setPrice);

// Upload an image for a product
router.put('/upload-image', authenticateToken, upload.single('image'), uploadImage);

// Update the description of a product
router.put('/update-description', authenticateToken, updateDescription);

// Get products by seller
router.get('/products/:sellerId', authenticateToken, getProductsBySeller);

//Delete products 
router.delete('/delete-product/:productId', authenticateToken, deleteProduct);

module.exports = router;
