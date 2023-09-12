
const jwt = require('jsonwebtoken');
const { token_credentials } = require('../config');
const { validateEmail } = require('../library/helper');
const log_write = require('../library/log');

function authenticate(req, res, next) {
    let response = {
        success: false
    };

    const token = req.cookies.jwt;
    console.log({ token })

    if (!token) {
        response.message = 'Authentication required!';
        log_write(req, "logs", "authenticate_middleware", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(401).json(response);
    }

    jwt.verify(token, token_credentials.access_token_secret, (err, decoded) => {
        if (err) {
            response.message = 'Authentication failed!';
            log_write(req, "logs", "authenticate_middleware", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
            return res.status(401).json(response);
        }
        console.log({ decoded })
        req.userInfo = decoded;
        next();
    });
}

function verify_registration_data(req, res, next) {
    let response = {
        success: false
    };

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
        response.message = 'User name is required!';
        log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response)
    } else if (!email) {
        response.message = 'Email is required!';
        log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if (!phone) {
        response.message = 'Phone no. is required!';
        log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if (!password) {
        response.message = 'Password is empty!';
        log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if (password.lenght < 6) {
        response.message = 'Password must be 6 characters long!';
        log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if (!validateEmail(email)) {
        response.message = 'Invalid email address!';
        log_write(req, "logs", "register_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    }

    next();
}

function verify_login_data(req, res, next) {
    let response = {
        success: false
    };

    const {
        email,
        password
    } = req.body;
    if (!email) {
        response.message = 'Email is required!';
        log_write(req, "logs", "login", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response)
    } else if (!password) {
        response.message = 'Password is empty!';
        log_write(req, "logs", "login", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response)
    } else if (password.lenght < 6) {
        response.message = 'Password must be 6 characters long!';
        log_write(req, "logs", "login", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response)
    } else if (!validateEmail(email)) {
        response.message = 'Invalid email address!';
        log_write(req, "logs", "login", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response)
    }

    next();
}

module.exports = {
    authenticate,
    verify_registration_data,
    verify_login_data
}