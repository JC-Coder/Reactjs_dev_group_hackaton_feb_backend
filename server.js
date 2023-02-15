const express = require("express");
const app = express();
const { userRoutes, djRoutes } = require("./routes");

const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// db connection
require("./connection");

//routes
app.use("/users", userRoutes);
app.use("/dj", djRoutes);

// server config
const server = require("http").createServer(app);
const PORT = 3000;

// bootstrap server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
