const { token_credentials } = require("../config");
const jwt = require('jsonwebtoken');

function createJwtToken(user) {
    return jwt.sign({ user }, token_credentials.access_token_secret, { expiresIn: token_credentials.access_token_lifelime });
}

function createRefreshToken(user) {
    return jwt.sign({ user }, token_credentials.refresh_token_secret, { expiresIn: token_credentials.refresh_token_lifetime });
}

function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function validatePhone(phone) {
    return String(phone)
        .match(
            /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/

        );
}

module.exports = {
    createJwtToken,
    createRefreshToken,
    validateEmail,
    validatePhone
}