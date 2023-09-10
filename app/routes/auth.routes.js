const { registerUser, login, renewToken } = require("../controllers/auth.controller");
const { verify_registration_data, verify_login_data } = require("../middlewares/auth.middleware");


module.exports = function (app) {
    app.post("/api/v1/auth/renew-token", renewToken);
    app.post("/api/v1/auth/register", [verify_registration_data], registerUser);
    app.post("/api/v1/auth/login", [verify_login_data], login);
};

