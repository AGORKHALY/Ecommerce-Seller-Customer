const express = require('express');
const createError = require('http-errors');
require('dotenv').config()
const authenticateToken = require('./middleware/authenticateToken');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res, next) => {
    res.send({ message: 'It works' });
});

app.use('/api/users', require('./routes/userRoutes'))

app.use('/api/seller', require('./routes/sellerRoutes'))

app.use('/api/customer', require('./routes/customerRoutes'))

app.get('/api/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'You have access to this route!', user: req.user });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost ${PORT}`));


