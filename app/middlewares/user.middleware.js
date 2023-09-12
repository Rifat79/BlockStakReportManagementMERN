const bcrypt = require('bcrypt');
const { validateEmail, validatePhone } = require("../library/helper");
const log_write = require('../library/log');

async function verify_create_user_req(req, res, next) {
    let response = {
        success: false
    };

    const {
        name,
        email,
        phone,
        password,
        profession,
        address,
        favourite_colors,
        is_admin
    } = req.body;

    if(typeof(name) !== 'string' || name.length === 0) {
        response.message = "Invalid data type for field 'name'!";
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if (typeof (email) !== 'string' || !validateEmail(email)) {
        response.message = "Invalid value for field 'email'!";
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if(typeof(password) !== 'string' || password.length < 6) {
        response.message = "Password can not be empty and should contain at least 6 characters!" ;
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if (typeof (is_admin) !== 'boolean') {
        response.message = "Invalid data type for field 'is_admin'!" ;
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if(typeof(profession) === 'string' && profession.length === 0) {
        response.message = "profession can not be empty!";
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if (typeof (address) === 'string' && address.length === 0) {
        response.message = "address can not be empty!" ;
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if(Array.isArray(favourite_colors) && favourite_colors.length === 0) {
        response.message = "Favourite colors should contain at least one color!";
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if(typeof(phone) === 'string' && !validatePhone(phone)) {
        response.message = "Invalid phone no!"
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    }

    let newUser = {};

    if (name !== undefined) {
        newUser.name = name;
    }
    if (email !== undefined) {
        newUser.email = email;
    }
    if(password !== undefined) {
        newUser.password = await bcrypt.hash(password, 10);
    }
    if (phone !== undefined) {
        newUser.phone = phone;
    }
    if (profession !== undefined) {
        newUser.profession = profession;
    }
    if (address !== undefined) {
        newUser.address = address;
    }
    if (favourite_colors !== undefined) {
        newUser.favourite_colors = favourite_colors;
    }
    if (is_admin !== undefined) {
        newUser.is_admin = is_admin;
    }

    req.newUser = newUser;

    next();
}

function verify_user_update_req(req, res, next) {
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
        is_admin
    } = req.body;

    if (name !== undefined && typeof (name) !== 'string') {
        response.message = "Invalid data type for field 'name'!" ;
        log_write(req, "logs", "update_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
        return res.status(400).json(response);
    } else if (typeof (name) === 'string' && name.length === 0) {
        response.message = "Name can not be empty!" ;
        return res.status(400).json(response);
    } else if (email !== undefined && !validateEmail(email)) {
        response.message = "Invalid value for field 'email'!" ;
        return res.status(400).json(response);
    } else if (phone !== undefined && !validatePhone(phone)) {
        response.message = "Invalid 'msisdn'!";
        return res.status(400).json(response);
    } else if (profession !== undefined && typeof (profession) !== 'string') {
        response.message = "Invalid data type for field 'profession'!" ;
        return res.status(400).json(response);
    } else if (typeof (profession) === 'string' && profession.length === 0) {
        response.message = "profession can not be empty!" ;
        return res.status(400).json(response);
    } else if (address !== undefined && typeof (address) !== 'string') {
        response.message = "Invalid data type for field 'address'!" ;
        return res.status(400).json(response);
    } else if (typeof (address) === 'string' && address.length === 0) {
        response.message = "address can not be empty!" ;
        return res.status(400).json(response);
    } else if (favourite_colors !== undefined && !Array.isArray(favourite_colors)) {
        response.message = "Invalid data type for field 'favourite_colors'!" ;
        return res.status(400).json(response);
    } else if (is_admin !== undefined && typeof (is_admin) !== 'boolean') {
        response.message = "Invalid data type for field 'is_admin'!";
        return res.status(400).json(response);
    }

    const setter = {};

    if (name !== undefined) {
        setter.name = name;
    }
    if (email !== undefined) {
        setter.email = email;
    }
    if (phone !== undefined) {
        setter.phone = phone;
    }
    if (profession !== undefined) {
        setter.profession = profession;
    }
    if (address !== undefined) {
        setter.address = address;
    }
    if (favourite_colors !== undefined) {
        setter.favourite_colors = favourite_colors;
    }
    if (is_admin !== undefined) {
        setter.is_admin = is_admin;
    }

    req.setter = setter;

    next()
}

module.exports = {
    verify_user_update_req,
    verify_create_user_req
}