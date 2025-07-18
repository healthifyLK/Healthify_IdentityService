const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { Op } = require("sequelize");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
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

// Login a user
const loginUserService = async ({ email, password }) => {
  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User Account not found");
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Create payload for access token
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Generate access token
    const accessToken = generateAccessToken(payload);

    // Generate refresh token
    const refreshToken = generateRefreshToken(payload);

    // Return the token and user information
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error in loginUserService:", error);

    // Rethrow the error so the controller can handle it
    throw new Error(error.message || "Login failed");
  }
};

module.exports = {
  registerUserService,
  loginUserService,
};
