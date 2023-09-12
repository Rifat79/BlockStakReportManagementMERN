
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { connectToDb } = require('../library/db.connection');
const { createJwtToken, createRefreshToken } = require('../library/helper');
const { token_credentials } = require('../config');
const log_write = require('../library/log');

exports.renewToken = async (req, res) => {
    let response = {
        success: false
    };

    const refreshToken = req.body.refreshToken;

    if(!refreshToken) {
        response.message = "'refreshToken' is empty!";
        log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    }

    // Verify the refresh token
    jwt.verify(refreshToken, token_credentials.refresh_token_secret, (err, decoded) => {
        if (err) {
            response.message = 'Token refresh failed';
            log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
            return res.status(401).json(response);
        }

        // Generate a new JWT token with a 1-hour expiration
        const newJwtToken = createJwtToken(decoded.user);

        // Set the new JWT token as an HttpOnly cookie
        res.cookie('jwt', newJwtToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        response.success = true;
        response.message = 'Token refreshed successfully';
        response.refreshToken = refreshToken;
        log_write(req, "logs", "renew_token", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        res.status(200).json(response);
    });
}

exports.registerUser = async (req, res) => {
    let response = {
        success: false
    };

    try {
        const { name, email, phone, profession, address, favourite_colors, is_admin, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await connectToDb();

        const existingUser = await User.findOne({email});
        if (existingUser) {
            response.message = 'Email already exists!';
            return res.status(403).json(response);
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

        response.success = true;
        response.message = 'Registration successful';
        response.userData = userData;
        response.refreshToken = refreshToken;
        res.status(201).json(response);
    } catch (err) {
        console.log("catch block error: '/register' => ", err.message);
        response.message = err.message;
        res.status(500).json(message);
    } finally {
        log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
    }
};

exports.login = async (req, res) => {
    let response = {
        success: false
    };

    try {
        const { email, password } = req.body;

        await connectToDb();

        // Check if the user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            response.message = 'Authentication failed';
            return res.status(401).json(response);
        }

        // Verify the provided password against the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            response.message = 'Wrong password';
            return res.status(401).json(response);
        }

        // Generate a JWT token with a 1-hour expiry time
        const jwtToken = createJwtToken({ email });
        const refreshToken = createRefreshToken({ email });

        // Set the JWT token as an HttpOnly cookie
        res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        response.success = true;
        response.message = 'Login successful';
        response.refreshToken = refreshToken;
        return res.status(200).json(response);
    } catch (err) {
        console.log("catch block error: '/login' => ", err.message);
        response.message = err.message;
        return res.status(500).json(response);
    } finally {
        log_write(req, "logs", "login", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
    }
}