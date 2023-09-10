
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { connectToDb } = require('../library/db.connection');
const { createJwtToken, createRefreshToken } = require('../library/helper');
const { token_credentials } = require('../config');

exports.renewToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if(!refreshToken) {
        return res.status(400).json({ message: "'refreshToken' is empty!" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, token_credentials.refresh_token_secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token refresh failed' });
        }

        // Generate a new JWT token with a 1-hour expiration
        const newJwtToken = createJwtToken(decoded.user);

        // Set the new JWT token as an HttpOnly cookie
        res.cookie('jwt', newJwtToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.json({ message: 'Token refreshed successfully', refreshToken });
    });
}

exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, profession, address, favourite_colors, is_admin, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await connectToDb();

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(401).json({message: 'Email already exists!'});
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            profession,
            address,
            favourite_colors,
            is_admin: is_admin ? is_admin : false
        });

        const userData = await newUser.save();

        const token = createJwtToken({ email })
        const refreshToken = createRefreshToken({ email });
        console.log({token, refreshToken})

        // Set the JWT token as an HttpOnly cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(201).json({ message: 'Registration successful', userData, refreshToken });
    } catch (err) {
        console.log("catch block error: '/register' => ", err.message);
        res.status(500).json({ success: false, message: err.message })
    } finally {

    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        await connectToDb();

        // Check if the user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Verify the provided password against the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        // Generate a JWT token with a 1-hour expiry time
        const jwtToken = createJwtToken({ email });
        const refreshToken = createRefreshToken({ email });

        // Set the JWT token as an HttpOnly cookie
        res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.json({ message: 'Login successful', refreshToken });
    } catch (err) {
        console.log("catch block error: '/login' => ", err.message);
        res.status(500).json({ success: false, message: err.message })
    } finally {

    }
}