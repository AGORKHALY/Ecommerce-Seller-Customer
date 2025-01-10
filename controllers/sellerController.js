const path = require('path');
const fs = require('fs');
const prisma = require('../models/prismaClient'); // Your Prisma client
const upload = require('../middleware/upload'); // Assuming you have an upload middleware for handling file uploads

// Add a new product
const addProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? `/media/${req.file.filename}` : null;

    if (!name || !description || !price || !image) {
        return res.status(400).json({ message: "All fields (name, description, price, image) are required" });
    }

    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image, // Save the image path in the database
                sellerId: req.user.id,
            },
        });

        return res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: "Error adding product", error });
    }
};

// Update the price of a product
const setPrice = async (req, res) => {
    const { productId, newPrice } = req.body;

    if (!productId || !newPrice) {
        return res.status(400).json({ message: 'Invalid input: productId and newPrice are required.' });
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product || product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You are not authorized to update this product.' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { price: newPrice },
        });

        return res.status(200).json({
            message: 'Product price updated successfully.',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error updating price:', error);
        return res.status(500).json({ message: 'Error updating price.', error });
    }
};

// Upload an image for a product
const uploadImage = async (req, res) => {
    const { productId } = req.body;
    const image = req.file ? `/media/${req.file.filename}` : null;

    if (!productId || !image) {
        return res.status(400).json({ message: 'Invalid input: productId and image are required.' });
    }

    try {
        const productIdInt = parseInt(productId);

        if (isNaN(productIdInt)) {
            return res.status(400).json({ message: 'Invalid productId: must be an integer.' });
        }

        const product = await prisma.product.findUnique({
            where: { id: productIdInt }
        });

        if (!product || product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You are not authorized to update this product.' });
        }

        if (product.image) {
            const oldImagePath = `./public${product.image}`;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productIdInt },
            data: { image },
        });

        return res.status(200).json({
            message: 'Product image updated successfully.',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Error uploading image.', error });
    }
};

// Update the description of a product
const updateDescription = async (req, res) => {
    const { productId, newDescription } = req.body;

    if (!productId || !newDescription) {
        return res.status(400).json({ message: 'Invalid input: productId and newDescription are required.' });
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product || product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You are not authorized to update this product.' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { description: newDescription },
        });

        return res.status(200).json({
            message: 'Product description updated successfully.',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error updating description:', error);
        return res.status(500).json({ message: 'Error updating description.', error });
    }
};

// Get products by seller
const getProductsBySeller = async (req, res) => {
    const { sellerId } = req.params;

    if (!sellerId) {
        return res.status(400).json({ message: 'Seller ID is required' });
    }

    const sellerIdInt = parseInt(sellerId, 10);
    if (isNaN(sellerIdInt)) {
        return res.status(400).json({ message: 'Invalid Seller ID' });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                sellerId: sellerIdInt,
            },
        });

        // If no products found, return an empty array instead of 404
        return res.status(200).json({ products: products.length > 0 ? products : [] });

    } catch (error) {
        console.error('Error retrieving products for seller:', error);
        return res.status(500).json({ message: 'Error retrieving products', error });
    }
};


// Delete a product and its associated data
const deleteProduct = async (req, res) => {
    const { productId } = req.params;  // Get productId from URL params

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        const productIdInt = parseInt(productId);

        if (isNaN(productIdInt)) {
            return res.status(400).json({ message: 'Invalid productId: must be an integer.' });
        }

        // Find the product
        const product = await prisma.product.findUnique({
            where: { id: productIdInt },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You are not authorized to delete this product.' });
        }

        // Delete the product image if it exists
        if (product.image) {
            const imagePath = `./public${product.image}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);  // Remove the image file from the server
            }
        }

        // Delete the product from the database
        await prisma.product.delete({
            where: { id: productIdInt },
        });

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Error deleting product', error });
    }
};




module.exports = {
    addProduct,
    setPrice,
    uploadImage,
    updateDescription,
    getProductsBySeller,
    deleteProduct,
};
