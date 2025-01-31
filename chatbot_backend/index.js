const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db');
require('./config/passport');

const app = express();

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://beyond-chats-sooty.vercel.app',
  'https://beyond-chats-jjlr0mklx-akanksha-dubeys-projects.vercel.app',
  'https://beyondchats-cr91.onrender.com'
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Main middleware setup
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,  // Changed to always be secure
    sameSite: 'none',  // Changed to always be none for cross-origin
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Test route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Google Auth routes
app.get('/api/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://beyond-chats-sooty.vercel.app/login',
    session: true
  }),
  (req, res) => {
    res.redirect('https://beyond-chats-sooty.vercel.app/organization-setup');
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS error: Origin not allowed'
    });
  } else {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// 404 handler - Must be after all other routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// Start Server
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    app._router.stack
      .filter(r => r.route)
      .forEach(r => {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
      });
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});