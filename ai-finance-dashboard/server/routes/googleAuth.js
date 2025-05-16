const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            // Generate JWT token
            const token = jwt.sign(
                { userId: req.user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Redirect to frontend with token
            res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
        } catch (error) {
            console.error('Google auth callback error:', error);
            res.redirect('/login');
        }
    }
);

module.exports = router;
