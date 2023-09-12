const { connectToDb } = require("../library/db.connection");
const log_write = require("../library/log");
const User = require("../models/UserModel");


exports.getUsers = async (req, res) => {

    let response = {
        success: false
    };

    try {
        await connectToDb();

        const data = await User.find();

        return data.length > 0
            ? res.status(200).json({ ...response, success: true, data })
            : res.status(404).json({ ...response, message: 'No data found!' });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    } finally {
        log_write(req, "logs", "get_users", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
    }
}

exports.createUser = async (req, res) => {

    let response = {
        success: false
    };

    try {

        const userInfo = req.userInfo;

        console.log({ userInfo })

        const newUserReq = req.newUser;
        const newUser = new User(newUserReq);

        await connectToDb();

        const requestor = await User.findOne({ email: userInfo.user.email })
        if (!requestor || !requestor.is_admin) {
            response.message = 'Unauthorized user!';

            return res.status(401).json(response);
        }

        const existingUser = await User.findOne({ email: newUserReq.email });
        if (existingUser) {
            response.message = "User already exists with this email";
            return res.status(403).json(response);
        }

        const userData = await newUser.save();

        response.success = true;
        response.message = 'User created successfully!';
        response.data = userData;

        return res.status(201).json(response);

    } catch (err) {
        console.log("catch block error from create user api: ", err.message);
        response.message = err.message;
        return res.status(500).json(response)
    } finally {
        log_write(req, "logs", "create_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
    }
}

exports.updateUser = async (req, res) => {

    let response = {
        success: false
    };

    try {
        const { id } = req.params;
        const userInfo = req.userInfo;
        const fieldsToBeUpdated = req.setter;

        if (!id) {
            response.message = "Invalid Id!";
            return res.status(400).json(response);
        }

        await connectToDb();

        const requestor = await User.findOne({ email: userInfo.user.email });

        if (!requestor.is_admin) {
            response.message = 'Unauthorized user!';
            return res.status(401).json(response);
        }

        const userToBeUpdated = await User.findById(id);

        if (!userToBeUpdated) {
            response.message = "Couldn't find the user with this Id!";
            return res.status(404).json(response);
        }

        if (fieldsToBeUpdated.email) {
            const existingUser = await User.findOne({ email: fieldsToBeUpdated.email });
            if (existingUser) {
                response.message = "User already exists with this email";
                return res.status(403).json(response);
            }
        }

        const updatedUser = await User.updateOne({ _id: id }, {
            $set: fieldsToBeUpdated
        });

        if (updatedUser) {
            response.success = true;
            response.message = "User updated successfully!";
            response.data = updatedUser;
            return res.status(200).json(response);
        } else {
            response.message = 'Could not update user';
            return res.status(404).json(response);
        }
    } catch (err) {
        console.log("catch block error form update api: ", err.message);
        response.message = err.message
        return res.status(500).json({ success: false, message: err.message })
    } finally {
        log_write(req, "logs", "update_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
    }
}

exports.deleteUser = async (req, res) => {

    let response = {
        success: false
    };

    try {
        const id = req.params.id;

        if (!id) {
            response.message = "Invalid Id!";
            return res.status(400).json(response);
        }

        await connectToDb();

        const user = await User.findOne({ _id: id });

        if (!user) {
            response.message = "Could not find a user with the Id!";
            res.status(404).json(response);
        }

        const deletedProduct = await User.deleteOne({ _id: id });

        response.success = true;
        response.message = "Deleted single user!";

        return res.status(200).json(response);
    } catch (err) {
        console.log("catch block error from delete user api: ", err.message);
        response.message = err.message;
        return res.status(500).json(response);
    } finally {
        log_write(req, "logs", "delete_user", "REQ_RES_", JSON.stringify(req.body) + "|" + JSON.stringify(response));
    }
}