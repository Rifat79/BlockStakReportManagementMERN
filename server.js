const express = require("express");
const app = express();
const cors = require("cors");
const { SERVER_RUNNING_PORT } = require("./app/config");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-Type, Accept"
    );
    next();
});
app.use(cookieParser());

// api routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.listen(SERVER_RUNNING_PORT, () => {
    console.log(`Server is running on port ${SERVER_RUNNING_PORT}`);
});


// error handler middleware
app.use(function errorHandler(err, req, res, next) {
    let response = { message: 'Internal server error' };
    console.log("Internal server error");
    console.log(err);
    response.success = false;
    response.statusCode = 400;
    response.message = err;
    return res.json(response);
});