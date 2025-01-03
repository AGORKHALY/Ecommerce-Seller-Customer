const express = require('express');
const bcrypt = require('bcryptjs');
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
            { id: user.id, username: user.username, userType: user.userType }, // Include userType in the token
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username, userType: user.userType }, // Include userType here as well
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        // Respond with tokens and user details
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