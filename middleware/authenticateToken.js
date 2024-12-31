const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach the decoded token to the request object, including the `id` from the payload
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};



module.exports = authenticateToken;
