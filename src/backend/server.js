const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

require('dotenv').config();

const app = express();
const port = 5009;

// CORS setup
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

const dbURI = 'mongodb://127.0.0.1:27017/SaleSphere';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));
    
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    date: { type: Date, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String }  // Storing image as a base64 string
});

const User = mongoose.model('User', userSchema);

app.post('/user', async (req, res) => {
    try {
        const userData = req.body;
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        const newUser = new User(userData);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(400).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: err.message });
    }
});

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Fetch user profile data route
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token received:', token); // Debug token
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err); // Debug error
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded._id;
        next();
    });
};

app.get('/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/user/profile', verifyToken, upload.single('profilePicture'), async (req, res) => {
    const { firstname, lastname, gender, date, address } = req.body;
    const profilePicture = req.file ? req.file.buffer.toString('base64') : undefined;

    try {
        const updatedUser = await User.findByIdAndUpdate(req.userId, {
            firstname, lastname, gender, date, address, ...(profilePicture && { profilePicture })
        }, { new: true }).select('-password');

        if (updatedUser) {
            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

mongoose.connection.once('open', () => {
    console.log('Mongoose connection open');
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
});