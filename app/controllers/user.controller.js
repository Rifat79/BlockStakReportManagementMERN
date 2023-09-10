const { connectToDb } = require("../library/db.connection");
const User = require("../models/UserModel");


exports.getUsers = async (req, res) => {
    let data, db;
    try {
        let db = await connectToDb();

        data = await User.find();


    } catch (err) {
        console.log(err.message);
    } finally {
        res.status(200).json(data)
    }
}

exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, profession, address, favourite_colors, is_admin } = req.body;
        const userInfo = req.userInfo;

        console.log({ userInfo })

        const newUser = new User({
            name,
            email,
            phone,
            profession,
            address,
            favourite_colors,
            is_admin
        });

        let db = await connectToDb();

        const requestor = await User.findOne({ email: userInfo.user.email })
        if (!requestor.is_admin) {
            return res.status(401).json({ message: 'Unauthorized user!' })
        }

        const userData = await newUser.save();


        return res.status(201).json({ userData });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: err.message })
    } finally {

    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log({ id })
        if (!id) {
            return res.status(400).json({ success: false, message: "Invalid Id!" });
        }

        await connectToDb();

        const updatedUser = await User.findbyIdAndUpdate({ _id: id }, {
            $set: {
                profession: "Business",
                address: "Dhaka"
            }
        });

        if (updatedUser) {
            res.status(200).json({ updatedUser });
        } else {
            res.status(404).json({ message: 'Could not update user' })
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: err.message })
    } finally {

    }
}