const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

// Create a new Google Strategy instance
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENTID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENTSECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: "",
          });
        }
        // if auth successful, return the user
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user to store user id in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user from session to get user object in subsequent requests

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
