const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { Op } = require("sequelize");
const {
  generateAccessToken,
  generateRefreshToken,
  generateTemporaryToken,
  validateTemporaryToken,
} = require("../utils/jwt");
const { sendEmail } = require("../utils/email");
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

// Request password reset
const requestPasswordResetService = async ({ email }) => {
  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Generate temporary token
    const tempToken = generateTemporaryToken(payload);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${tempToken}`;

    // Send email with reset link
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.username},</p>
        <p>You have requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
        `,
    });

    // Return success message
    return {
      message: "Password reset email sent",
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error in requestPasswordResetService:", error);

    // Rethrow the error so the controller can handle it
    throw new Error(error.message || "Password reset request failed");
  }
};

// Reset password
const resetPasswordService = async ({ token, newPassword }) => {
  try {
    const payload = validateResetToken(token);
    if (!payload) throw new Error("Invalid or expired token");

    const user = await User.findByPk(payload.userId);
    if (!user) throw new Error("User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password has been reset successfully." };
  } catch (error) {
    // Log the error for debugging
    console.error("Error in resetPasswordService:", error);

    // Rethrow the error so the controller can handle it
    throw new Error(error.message || "Failed to reset password");
  }
};

module.exports = {
  registerUserService,
  loginUserService,
  requestPasswordResetService,
  resetPasswordService,
};
