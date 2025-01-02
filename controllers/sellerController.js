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

    // Validate inputs
    if (!productId || !newPrice) {
        return res.status(400).json({ message: 'Invalid input: productId and newPrice are required.' });
    }

    try {
        // Check if the product exists and if the user is the seller
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product || product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You are not authorized to update this product.' });
        }

        // Update the product price
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
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product || product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You are not authorized to update this product.' });
        }

        // Delete the old image file (if it exists)
        if (product.image) {
            const oldImagePath = `./public${product.image}`;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);  // Synchronously delete the old image file
            }
        }

        // Update the product image in the database
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
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

    // Validate inputs
    if (!productId || !newDescription) {
        return res.status(400).json({ message: 'Invalid input: productId and newDescription are required.' });
    }

    try {
        // Check if the product exists and if the user is the seller
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product || product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You are not authorized to update this product.' });
        }

        // Update the product description
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

module.exports = {
    addProduct,
    setPrice,
    uploadImage,
    updateDescription,
};
