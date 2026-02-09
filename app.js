const express = require("express");
const app = express();

app.use(express.json());


const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/students");
const parentRoutes = require("./routes/parents");
const teacherRoutes = require("./routes/teachers");

app.use("/admin", adminRoutes);
app.use("/students", studentRoutes);
app.use("/parents", parentRoutes);
app.use("/teachers", require("./routes/teachers"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
