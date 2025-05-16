const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists
        let user = await User.findOne({ where: { email: profile.emails[0].value } });
        
        if (!user) {
            // Create new user
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// JWT Strategy for protected routes
passport.use(new jwt({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (jwt_payload, done) => {
    try {
        const user = await User.findByPk(jwt_payload.userId);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
