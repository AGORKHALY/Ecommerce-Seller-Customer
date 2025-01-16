const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prismaClient');
const router = express.Router();
require('dotenv').config()

// Register User
const registerUser = async (req, res) => {
    try {
        const { username, password, userType } = req.body;

        if (!username || !password || (userType !== 0 && userType !== 1)) {
            return res.status(400).json({ error: 'Invalid input: username, password, and userType are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                userType,
            },
        });

        // Generate the access and refresh tokens
        const accessToken = jwt.sign(
            { id: newUser.id, username: newUser.username, userType: newUser.userType },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            { id: newUser.id, username: newUser.username, userType: newUser.userType },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        // Store refresh token in the database
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: newUser.id,
            }
        });

        // Respond with tokens and user details
        res.status(201).json({
            message: 'User registered successfully.',
            accessToken,
            refreshToken,
            user: { id: newUser.id, username: newUser.username, userType: newUser.userType },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while registering the user' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Invalid input: username and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials: User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials: Incorrect password" });
        }

        // Generate the access and refresh tokens with user details
        const accessToken = jwt.sign(
            { id: user.id, username: user.username, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username, userType: user.userType },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        // Delete any existing refresh token for the user (if exists)
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id }
        });

        // Store the new refresh token in the database
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
            }
        });

        // Fetch Seller/Customer ID if applicable
        let userTypeId = user.id;

        if (user.userType === 0) {
            const seller = await prisma.product.findFirst({
                where: { sellerId: user.id },
            });
            userTypeId = seller ? seller.sellerId : user.id;
        } else if (user.userType === 1) {
            const customer = await prisma.order.findFirst({
                where: { customerId: user.id },
            }) || await prisma.cart.findFirst({
                where: { customerId: user.id },
            });
            userTypeId = customer ? customer.customerId : user.id;
        }

        // Respond with tokens, user details, and userTypeId
        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                userType: user.userType,
                userTypeId
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error during login", error });
    }
};

// Logout User
const logoutUser = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token provided" });
    }

    try {
        // Verify the refresh token (optional but recommended)
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find the refresh token in the database using the userId from the decoded token
        const tokenRecord = await prisma.refreshToken.findUnique({
            where: { userId: decoded.id },
        });

        if (!tokenRecord) {
            return res.status(400).json({ message: "Invalid refresh token" });
        }

        // Delete the refresh token from the database
        await prisma.refreshToken.delete({
            where: { userId: decoded.id },
        });

        // Respond with a success message
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error during logout", error });
    }
};



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
