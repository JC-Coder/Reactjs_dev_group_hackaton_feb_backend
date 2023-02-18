const mongoose = require('mongoose');
require('dotenv').config()

const CONNECTION_STRING = process.env.DATABASE_URL // production

mongoose.connect(CONNECTION_STRING, () => {
    console.log('connected to mongodb');
});