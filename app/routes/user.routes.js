const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { verify_user_update_req, verify_create_user_req } = require("../middlewares/user.middleware");

module.exports = function (app) {
    app.get("/api/v1/users", [authenticate], getUsers);
    app.post("/api/v1/users/create", [authenticate, verify_create_user_req], createUser);
    app.post("/api/v1/users/update/:id", [authenticate, verify_user_update_req], updateUser);
    app.delete("/api/v1/users/delete/:id", [authenticate], deleteUser);
};

