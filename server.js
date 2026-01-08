const app = require("./app");
const PORT = process.env.PORT || 5000;
const sequelize = require("./config/db");

const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);
 
sequelize.sync()
  .then(() => {
    console.log("Database connected & synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB error:", err);
  });


