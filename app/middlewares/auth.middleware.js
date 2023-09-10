
const jwt = require('jsonwebtoken');
const { token_credentials } = require('../config');
const { validateEmail } = require('../library/helper');

function authenticate(req, res, next) {
    const token = req.cookies.jwt;
    console.log({ token })

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, token_credentials.access_token_secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        console.log({ decoded })
        req.userInfo = decoded;
        next();
    });
}

function verify_registration_data(req, res, next) {
    const {
        name,
        email,
        phone,
        profession,
        address,
        favourite_colors,
        is_admin,
        password
    } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'User name is required!' })
    } else if (!email) {
        return res.status(400).json({ message: 'Email is required!' })
    } else if (!phone) {
        return res.status(400).json({ message: 'Phone no. is required!' })
    } else if (!password) {
        return res.status(400).json({ message: 'Password is empty!' })
    } else if (password.lenght < 6) {
        return res.status(400).json({ message: 'Password must be 6 characters long!' })
    } else if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address!' })
    }

    next();
}

function verify_login_data(req, res, next) {
    const {
        email,
        password
    } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required!' })
    } else if (!password) {
        return res.status(400).json({ message: 'Password is empty!' })
    } else if (password.lenght < 6) {
        return res.status(400).json({ message: 'Password must be 6 characters long!' })
    } else if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address!' })
    }

    next();
}

module.exports = {
    authenticate,
    verify_registration_data,
    verify_login_data
}