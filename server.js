const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/sequelize");
const passport =require('passport')
const session = require('express-session')
const passportConfig = require('./config/passport')
const User = require("./models/userModel");
const authRoutes = require("./routes/authRoutes");
dotenv.config();

const PORT = process.env.PORT || 5002;
const app = express();

// Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

// Start the server only if the database connection is successful
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // sync the models with the database
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Identity Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
})();
