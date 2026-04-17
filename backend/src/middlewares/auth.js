const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register middleware
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user in database (example)
        req.user = { id: 1, email, name, password: hashedPassword };

        res.status(201).json({ message: 'User registered successfully', user: { email, name } });
    } catch (error) {
        res.status(500).json({ message: 'Registration error', error: error.message });
    }
};

// Login middleware
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        // Fetch user from database (example)
        const user = { id: 1, email, password: await bcrypt.hash('hashedPassword', 10) };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
};

// Verify token middleware
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports = { register, login, verifyToken };