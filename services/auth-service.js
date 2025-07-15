const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { Op } = require("sequelize");
require("dotenv").config();

// Register a new user
const registerUserService = async ({ username, email, password, role }) => {
  try {
    // Check if user with email or username already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    if (existingUser) {
      throw new Error("Email or username already in use");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Return registration success message
    return {
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    // Log the error for debugging 
    console.error("Error in registerUserService:", error);

    // Rethrow the error so the controller can handle it
    throw new Error(error.message || "Registration failed");
  }
};

module.exports = {
  registerUserService,
};
