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

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',  // Local development URL
    'https://beyond-chats-sooty.vercel.app'  // Correct Vercel frontend URL
  ],
  credentials: true
}));

// Set headers for API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', [
    'http://localhost:5173',  // Local development URL
    'https://beyond-chats-sooty.vercel.app'  // Correct Vercel frontend URL
  ]);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', [
    'http://localhost:5173',  // Local development URL
    'https://beyond-chats-sooty.vercel.app'  // Correct Vercel frontend URL
  ]);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://beyond-chats-sooty.vercel.app/login',  // Updated failure redirect URL
    session: true
  }),
  (req, res) => {
    res.redirect('https://beyond-chats-sooty.vercel.app/organization-setup');  // Updated success redirect URL
  }
);

// Routes
app.use('/api', require('./routes/authRoutes'));

// Start Server
connectDB();
app.listen(3001, () => console.log('Server running on port 3001'));
