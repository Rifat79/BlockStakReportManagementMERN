const mongoose = require('mongoose');
const { db_configurations } = require('../config/index');
const { DB_HOST, DB_NAME } = db_configurations;

const uri = `${DB_HOST}/${DB_NAME}` || 'mongodb://127.0.0.1:27017/blockstak_report_management';

const db = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectToDb = async () => {
    try {
        // await db;
        mongoose.connect(uri)
        .then(() => console.log("connected to db..."))
        .catch((err) => console.log(err));

        return null;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

module.exports = { connectToDb }; 
