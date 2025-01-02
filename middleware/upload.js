const multer = require('multer');
const path = require('path');

// Set storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media'); // Directory where the file will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Set a unique filename
    }
});

// File filter to allow only certain file types (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

module.exports = upload // Assume the field name in the form is 'image'
