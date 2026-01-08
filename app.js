
const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const userRoutes = require("./routes/user");

app.use("/api/users", userRoutes);

module.exports = app;
