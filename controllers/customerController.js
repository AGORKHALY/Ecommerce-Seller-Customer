const prisma = require('../models/prismaClient');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching products", error });
    }
};

// Add product to cart
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingCartItem = await prisma.cart.findFirst({
            where: {
                customerId: req.user.id,
                productId: productId,
            }
        });

        if (existingCartItem) {
            // Update the quantity if the product is already in the cart
            const updatedCartItem = await prisma.cart.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity }
            });
            // Fetch updated cart items
            const updatedCartItems = await prisma.cart.findMany({
                where: { customerId: req.user.id },
                include: { product: true },
            });
            return res.status(200).json({
                message: "Cart updated",
                cartItems: updatedCartItems
            });
        }

        // Add new item to the cart
        const newCartItem = await prisma.cart.create({
            data: {
                customerId: req.user.id,
                productId: productId,
                quantity,
            }
        });

        // Fetch updated cart items
        const updatedCartItems = await prisma.cart.findMany({
            where: { customerId: req.user.id },
            include: { product: true },
        });

        return res.status(201).json({
            message: "Product added to cart",
            cartItems: updatedCartItems
        });
    } catch (error) {
        return res.status(500).json({ message: "Error adding to cart", error });
    }
};



// Delete item from cart
const deleteFromCart = async (req, res) => {
    const { cartItemId } = req.body;

    if (!cartItemId) {
        return res.status(400).json({ message: "Cart item ID is required" });
    }

    try {
        const cartItem = await prisma.cart.findUnique({ where: { id: cartItemId } });

        if (!cartItem || cartItem.customerId !== req.user.id) {
            return res.status(404).json({ message: "Cart item not found or unauthorized" });
        }

        // Delete the item from the cart
        await prisma.cart.delete({ where: { id: cartItemId } });

        // Fetch updated cart items
        const updatedCartItems = await prisma.cart.findMany({
            where: { customerId: req.user.id },
            include: { product: true },
        });

        return res.status(200).json({
            message: "Item removed from cart",
            cartItems: updatedCartItems
        });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting from cart", error });
    }
};



//View cart

const viewCart = async (req, res) => {
    try {
        // Find the cart items for the authenticated customer
        const cartItems = await prisma.cart.findMany({
            where: { customerId: req.user.id },
            include: {
                product: true, // Include the product details for each cart item
            }
        });

        if (cartItems.length === 0) {
            return res.status(404).json({ message: "Your cart is empty" });
        }

        // Format the cart items response
        const cartDetails = cartItems.map(item => ({
            cartItemId: item.id,
            productId: item.productId,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
        }));

        return res.status(200).json({
            message: "Cart retrieved successfully",
            cart: cartDetails,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving cart", error });
    }
};


// Buy products (place an order and delete from cart)
const buy = async (req, res) => {
    const { cartItemIds } = req.body;

    if (!cartItemIds || cartItemIds.length === 0) {
        return res.status(400).json({ message: "Cart items are required" });
    }

    try {
        // Find the cart items
        const cartItems = await prisma.cart.findMany({
            where: { id: { in: cartItemIds }, customerId: req.user.id },
            include: { product: true },
        });

        if (cartItems.length === 0) {
            return res.status(404).json({ message: "Cart items not found" });
        }

        const totalPrice = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

        // Create the order
        const order = await prisma.order.create({
            data: {
                customerId: req.user.id,
                totalPrice,
                items: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    }))
                }
            }
        });

        // Delete cart items after purchase
        await prisma.cart.deleteMany({
            where: { id: { in: cartItemIds } }
        });

        return res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        return res.status(500).json({ message: "Error processing order", error });
    }
};

// View order history
const viewOrderHistory = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { customerId: req.user.id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching order history", error });
    }
};

module.exports = {
    getAllProducts,
    addToCart,
    viewCart,
    deleteFromCart,
    buy,
    viewOrderHistory
};