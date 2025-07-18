const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET_KEY;
const TEMP_TOKEN_SECRET = process.env.JWT_TEMP_SECRET_KEY;
const ACCESS_TOKEN_EXPIRATION = "20m";
const REFRESH_TOKEN_EXPIRATION = "2d";
const TEMP_TOKEN_EXPIRATION = "10m";

// Generate access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

// Generate temporary token
const generateTemporaryToken = (payload) => {
  return jwt.sign(payload, TEMP_TOKEN_SECRET, {
    expiresIn: TEMP_TOKEN_EXPIRATION,
  });
};

// Validate access token
const validateAccessToken = (token, secret = ACCESS_TOKEN_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Validate refresh token
const validateRefreshToken = (token, secret = REFRESH_TOKEN_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Validate temporary token
const validateTemporaryToken = (token, secret = TEMP_TOKEN_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Refresh access token
const refreshAccessToken = (refreshToken) => {
  try {
    // get the payload from the refresh token
    const payload = validateRefreshToken(refreshToken);
    // generate a new access token
    const newAccessToken = generateAccessToken(payload);
    // return the new access token
    return newAccessToken;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTemporaryToken,
  validateAccessToken,
  validateRefreshToken,
  refreshAccessToken,
  validateTemporaryToken,
};
