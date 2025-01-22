const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const MONGODB = process.env.MONGODB_URL;

// App setup
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("Access Denied");
    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.status(403).send("Invalid Token");
        req.user = user;
        next();
    });
};

// Routes
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ username: req.body.username, password: hashedPassword });
        await user.save();
        res.status(201).send("User Registered");
    } catch (error) {
        res.status(400).send("Error Registering User");
    }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send("User Not Found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid Password");

    const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
});

app.get('/', authenticateToken, async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Start server
app.listen(PORT, () => console.log("Server running on port 5000"));
