const express = require("express");
const router = express.Router();
const passport = require("passport");
const { registerUser, loginUser, requestPasswordReset, resetPassword, requestLoginCode, verifyLoginCode } = require("../controllers/auth-controller");


// Define auth routes

// POST /api/auth/register
// Register a new user
router.post("/register", registerUser);

// Start Google OAuth2.0 authentication
// Tested and working
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth2.0 callback
// Tested and working
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    res.json({ message: "Logged in with Google!", user: req.user });
  }
);

// POST /api/auth/login
// Login a user
router.post("/login", loginUser);

// POST /api/auth/request-login-code
// Request a login code
router.post("/request-login-code", requestLoginCode);

// POST /api/auth/verify-login-code
// Verify a login code and login
router.post("/verify-login-code", verifyLoginCode);

// POST /api/auth/request-password-reset
// Request a password reset
router.post("/request-password-reset", requestPasswordReset);

// POST /api/auth/reset-password
// Reset a user's password
router.post("/reset-password", resetPassword);

module.exports = router;
