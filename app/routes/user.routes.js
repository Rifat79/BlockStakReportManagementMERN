const { getUsers, createUser, updateUser } = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");


module.exports = function (app) {
    app.get("/api/v1/users", [authenticate], getUsers);
    app.post("/api/v1/users/create", [authenticate], createUser);
    app.put("/api/v1/users/update/:id", [authenticate], updateUser)
};

