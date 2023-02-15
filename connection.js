const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(`mongodb://localhost:27017/hackaton_01`, () => {
    console.log('connected to mongodb');
}); 