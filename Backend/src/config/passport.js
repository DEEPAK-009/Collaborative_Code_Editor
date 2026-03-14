const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },

    async (accessToken, refreshToken, profile, done) => {

      try {

        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        // CASE 1: Existing user
        if (user) {

          if (!user.googleId) {
            user.googleId = profile.id;

            if (!user.authProviders.includes("google")) {
              user.authProviders.push("google");
            }

            await user.save();
          }

          return done(null, user);
        }

        // CASE 2: New user via Google
        user = new User({
          email,
          googleId: profile.id,
          password: null,
          authProviders: ["google"]
        });

        await user.save();

        return done(null, user);

      } catch (error) {

        return done(error, null);

      }

    }
  )
);

module.exports = passport;