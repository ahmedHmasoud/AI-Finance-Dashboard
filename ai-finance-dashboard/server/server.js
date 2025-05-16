require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');

require('./config/passport');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');
const aiSuggestionsRoutes = require('./routes/ai-suggestions');
const transactionRoutes = require('./routes/transactions');

app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/ai', aiSuggestionsRoutes);
app.use('/api/transactions', transactionRoutes);

// Test route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
