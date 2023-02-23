const mongoose = require("mongoose");
require("dotenv").config();

// const CONNECTION_STRING = process.env.MONGODB_URL_LIVE;
const CONNECTION_STRING = process.env.DATABASE_URL;

mongoose.set("strictQuery", true);
mongoose.connect(CONNECTION_STRING, () => {
  console.log("connected to mongodb");
});
