require("dotenv").config({ path: "./.env" });



const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./models");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const classRoutes = require("./routes/classRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const studentRoutes = require("./routes/studentRoutes");
const parentRoutes = require("./routes/parentRoutes");




dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/classes", classRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/api/students", studentRoutes);
app.use("/parent", parentRoutes);
app.use("/api/parent", parentRoutes);



app.get("/", (req, res) => {
  res.send("Server running successfully");
});

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  console.log("Database connected & synced");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
