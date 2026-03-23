const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");
const { getDisplayName } = require("../utils/jwt");

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
        const profileDisplayName =
          profile.displayName?.trim() ||
          profile.name?.givenName?.trim() ||
          email.split("@")[0];

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
          }

          user.displayName = user.displayName || profileDisplayName;
          user.authProviders = Array.from(
            new Set([...(user.authProviders || []), "google"])
          );

          await user.save();
          return done(null, user);
        }

        user = new User({
          email,
          displayName: profileDisplayName || getDisplayName({ email }),
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
