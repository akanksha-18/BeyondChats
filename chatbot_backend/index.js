// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const cors = require('cors');
// const connectDB = require('./config/db');
// require('./config/passport');

// const app = express();

// // Middleware
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(express.json());
// app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/api/auth/google',
//   passport.authenticate('google', { 
//     scope: ['profile', 'email']
//   })
// );

// app.get('/api/auth/google/callback', 
//   passport.authenticate('google', { 
//     failureRedirect: 'http://localhost:5173/login',
//     session: true
//   }),
//   (req, res) => {
//     res.redirect('http://localhost:5173/organization-setup');
//   }
// );
// // Routes
// app.use('/api', require('./routes/authRoutes'));

// // Start Server
// connectDB();
// app.listen(3001, () => console.log('Server running on port 3001'));


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

// CORS middleware with dynamic origin checking
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Main middleware setup
app.use(express.json());
app.use(session({ 
  secret: 'your-secret-key', 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

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

// Routes
app.use('/api', require('./routes/authRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS error: Origin not allowed'
    });
  } else {
    next(err);
  }
});

// Start Server
connectDB();
app.listen(3001, () => console.log('Server running on port 3001'));