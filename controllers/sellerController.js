const prisma = require('../models/prismaClient');

// Add a new product
const addProduct = async (req, res) => {
    const { name, description, price, image } = req.body;

    if (!name || !description || !price || !image) {
        return res.status(400).json({ message: "All fields are required." });
    }

    console.log('User:', req.user);  // Log user details to check the id

    try {
        console.log('Seller ID:', req.user.id);  // Log the Seller ID to ensure it's correct

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                image,
                sellerId: req.user.id,
            }
        });

        return res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
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
    const { productId, imageUrl } = req.body;

    // Validate inputs
    if (!productId || !imageUrl) {
        return res.status(400).json({ message: 'Invalid input: productId and imageUrl are required.' });
    }

    try {
        // Check if the product exists and if the user is the seller
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product || product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You are not authorized to update this product.' });
        }

        // Update the product image
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { image: imageUrl },
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
