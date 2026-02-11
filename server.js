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

const teacherRoutes = require("./routes/teacherRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const feeRoutes = require("./routes/feeRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const erpRoutes = require("./routes/erpRoutes");
const publicRoutes = require("./routes/publicRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminModuleRoutes = require("./routes/adminModuleRoutes");



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
app.use("/teacher", teacherRoutes);
app.use("/notices", noticeRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/results", resultRoutes);
app.use("/fees", feeRoutes);
app.use("/subjects", subjectRoutes);
app.use("/erp", erpRoutes);
app.use("/public", publicRoutes);
app.use("/profile", profileRoutes);
app.use("/admin/modules", adminModuleRoutes);


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
