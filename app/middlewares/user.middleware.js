const bcrypt = require('bcrypt');
const { validateEmail, validatePhone } = require("../library/helper");

async function verify_create_user_req(req, res, next) {

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
        return res.status(400).json({ message: "Invalid data type for field 'name'!" });
    } else if (typeof (email) !== 'string' || !validateEmail(email)) {
        return res.status(400).json({ message: "Invalid value for field 'email'!" });
    } else if(typeof(password) !== 'string' || password.length < 6) {
        return res.status(400).json({ message: "Password can not be empty and should contain at least 6 characters!" });
    } else if (typeof (is_admin) !== 'boolean') {
        return res.status(400).json({ message: "Invalid data type for field 'is_admin'!" });
    } else if(typeof(profession) === 'string' && profession.length === 0) {
        return res.status(400).json({ message: "profession can not be empty!" });
    } else if (typeof (address) === 'string' && address.length === 0) {
        return res.status(400).json({ message: "address can not be empty!" });
    } else if(Array.isArray(favourite_colors) && favourite_colors.length === 0) {
        return res.status(400).json({ message: "Favourite colors should contain at least one color!" });
    } else if(typeof(phone) === 'string' && !validatePhone(phone)) {
        return res.status(400).json({ message: "Invalid phone no!" });
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
        return res.status(400).json({ message: "Invalid data type for field 'name'!" });
    } else if (typeof (name) === 'string' && name.length === 0) {
        return res.status(400).json({ message: "Name can not be empty!" });
    } else if (email !== undefined && !validateEmail(email)) {
        return res.status(400).json({ message: "Invalid value for field 'email'!" });
    } else if (phone !== undefined && !validatePhone(phone)) {
        return res.status(400).json({ message: "Invalid 'msisdn'!" });
    } else if (profession !== undefined && typeof (profession) !== 'string') {
        return res.status(400).json({ message: "Invalid data type for field 'profession'!" });
    } else if (typeof (profession) === 'string' && profession.length === 0) {
        return res.status(400).json({ message: "profession can not be empty!" });
    } else if (address !== undefined && typeof (address) !== 'string') {
        return res.status(400).json({ message: "Invalid data type for field 'address'!" });
    } else if (typeof (address) === 'string' && address.length === 0) {
        return res.status(400).json({ message: "address can not be empty!" });
    } else if (favourite_colors !== undefined && !Array.isArray(favourite_colors)) {
        return res.status(400).json({ message: "Invalid data type for field 'favourite_colors'!" });
    } else if (is_admin !== undefined && typeof (is_admin) !== 'boolean') {
        return res.status(400).json({ message: "Invalid data type for field 'is_admin'!" });
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