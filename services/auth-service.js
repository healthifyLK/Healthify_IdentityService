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
const {
  sendRegistrationSuccessEmail,
  sendPasswordResetEmail,
  sendLoginCodeEmail,
} = require("./emailService");
const { generateLoginCode } = require("../utils/loginCodeGeneration");
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
    // Send registration success email
    await sendRegistrationSuccessEmail(user);

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
    await sendPasswordResetEmail(user, resetLink);

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
    const payload = validateTemporaryToken(token);
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

// Request Login Code
const requestLoginCodeService = async ({ email }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const loginCode = generateLoginCode();
    const loginCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.loginCode = loginCode;
    user.loginCodeExpiresAt = loginCodeExpiresAt;
    await user.save();

    // Send login code email
    await sendLoginCodeEmail(user, loginCode);

    return { message: "Verification code sent to your email." };
  } catch (error) {
    // Log the error for debugging
    console.error("Error in requestLoginCodeService:", error);

    // Rethrow the error so the controller can handle it
    throw new Error(error.message || "Failed to request login code");
  }
};

// Verify Login Code and login
const verifyLoginCodeService = async ({ email, code }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    if (
      !user.loginCode ||
      !user.loginCodeExpiresAt ||
      user.loginCode !== code ||
      new Date() > user.loginCodeExpiresAt
    ) {
      throw new Error("Invalid or expired code");
    }

    // Clear login code and expiry
    user.loginCode = null;
    user.loginCodeExpiresAt = null;
    await user.save();

    // Generate tokens
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error in verifyLoginCodeService:", error);

    // Rethrow the error so the controller can handle it
    throw new Error(error.message || "Failed to verify login code");
  }
};

module.exports = {
  registerUserService,
  loginUserService,
  requestPasswordResetService,
  resetPasswordService,
  requestLoginCodeService,
  verifyLoginCodeService,
};
