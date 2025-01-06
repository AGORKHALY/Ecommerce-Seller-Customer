const express = require('express');
const createError = require('http-errors');
const cors = require('cors');  // Import cors package
require('dotenv').config();
const authenticateToken = require('./middleware/authenticateToken');
const path = require('path');

const app = express();

// Enable CORS for all origins (or specify allowed origins)
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res, next) => {
    res.send({ message: 'It works' });
});

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/seller', require('./routes/sellerRoutes'));

app.use('/api/customer', require('./routes/customerRoutes'));

app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'You have access to this route!', user: req.user });
});

app.use('/media', express.static(path.join(__dirname, 'media')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
