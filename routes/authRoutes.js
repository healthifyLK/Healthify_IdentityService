const express = require("express");
const router = express.Router();
const passport = require("passport");
const { registerUser } = require("../controllers/auth-controller");

// Define auth routes

// POST /api/auth/register
// Register a new user
router.post("/register", registerUser);

// Start Google OAuth2.0 authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth2.0 callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    res.json({ message: "Logged in with Google!", user: req.user });
  }
);

module.exports = router;
