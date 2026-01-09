const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});


const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);



module.exports = app;
