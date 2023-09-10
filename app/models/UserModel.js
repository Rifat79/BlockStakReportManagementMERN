

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: { type: String, required: true },
    address: String,
    phone: String,
    profession: String,
    favourite_colors: Array,
    is_admin: { type: Boolean, required: true },
    created_at: { 
        type: Date, 
        immutable: true, 
        default: Date.now 
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
})

const User = mongoose.model('users', UserSchema);
module.exports = User;