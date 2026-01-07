const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);

app.get("/", (req, res) => {
  res.send("School ERP Backend Running");
});

module.exports = app;
