const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prismaClient');
const router = express.Router();
require('dotenv').config()

const registerUser = async (req, res) => {
    try {
        const { username, password, userType } = req.body;

        if (!username || !password || (userType == !0 && userType == !1)) {
            return res.status(400).json({ error: 'Invalid input: username, password and userType are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                userType,
            },
        });

        res.status(201).json({
            message: 'User registered successfully.',
            user: { id: newUser.id, username: newUser.username, userType: newUser.userType },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while registering the user' });
    }
};


const loginUser = async (req, res) => {
    const { username, password, userType } = req.body; // Removed `id` as it should not be in the request body for login

    // Ensure all required fields are provided
    if (!username || !password || userType === undefined) {
        return res.status(400).json({ error: 'Invalid input: username, password, and userType are required' });
    }

    try {
        // Retrieve the user from the database
        const user = await prisma.user.findUnique({
            where: { username },
        });

        // If user is not found
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials: User not found" });
        }

        // If userType does not match
        if (user.userType !== userType) {
            return res.status(401).json({ message: "Invalid credentials: User type mismatch" });
        }

        // Compare the provided password with the stored password hash
        const isMatch = await bcrypt.compare(password, user.password);

        // If password is incorrect
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials: Incorrect password" });
        }

        // Create an access token including `id`, `username`, and `userType`
        const accessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                userType: user.userType
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION } // Use environment variable for expiration
        );

        // Create a refresh token with the same structure
        const refreshToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                userType: user.userType
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION } // Use environment variable for refresh token expiration
        );

        // Return the tokens and user details
        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                username: user.username,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error during login", error });
    }
};



module.exports = {
    registerUser,
    loginUser
};