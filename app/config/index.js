const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

const {
    PORT,
    DB_HOST,
    DB_NAME,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_LIFETIME
} = result.parsed;

module.exports = {
    SERVER_RUNNING_PORT: PORT,
    db_configurations: {
        DB_NAME,
        DB_HOST
    },
    token_credentials: {
        access_token_secret: ACCESS_TOKEN_SECRET,
        access_token_lifelime: ACCESS_TOKEN_LIFETIME,
        refresh_token_secret: REFRESH_TOKEN_SECRET,
        refresh_token_lifetime: REFRESH_TOKEN_LIFETIME
    } 
}

