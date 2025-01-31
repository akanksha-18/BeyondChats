require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { sendVerificationEmail } = require('./utils/email');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://beyond-chats-sooty.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Google OAuth Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://beyondchats-cr91.onrender.com/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          verified: true
        });
        await user.save();
      } else if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Generate Verification Code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Routes
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existingUser = await User.findOne({ email });
    const isExistingUser = !!existingUser;

    const code = generateVerificationCode();
    req.session.verificationCode = code;
    req.session.email = email;
    req.session.verificationCodeExpires = Date.now() + 600000;

    try {
      await sendVerificationEmail(email, code);
      res.json({
        message: 'Verification code sent! Please check your email.',
        isExistingUser
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      res.status(500).json({ message: 'Failed to send verification code. Please try again.' });
    }
  } catch (error) {
    console.error('Error in sending verification:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, verificationCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    if (!req.session.verificationCode || 
        !req.session.email || 
        req.session.verificationCode !== verificationCode || 
        req.session.email !== email ||
        Date.now() > req.session.verificationCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: true
    });

    await newUser.save();

    delete req.session.verificationCode;
    delete req.session.email;
    delete req.session.verificationCodeExpires;

    req.session.userId = newUser._id;

    res.json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password, verificationCode } = req.body;
    
    if (!req.session.verificationCode || 
        !req.session.email || 
        req.session.verificationCode !== verificationCode || 
        req.session.email !== email ||
        Date.now() > req.session.verificationCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    delete req.session.verificationCode;
    delete req.session.email;
    delete req.session.verificationCodeExpires;

    req.session.userId = user._id;
    res.json({ 
      message: 'Login successful',
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});


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

// Logout Route
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Protected Route Example
app.get('/api/user', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  res.json({ userId: req.session.userId });
});

// Server configuration
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

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


// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const cors = require('cors');
// const connectDB = require('./config/db');
// require('./config/passport');

// const app = express();

// // Allowed origins
// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://beyond-chats-sooty.vercel.app',
//   'https://beyond-chats-jjlr0mklx-akanksha-dubeys-projects.vercel.app',
//   'https://beyondchats-cr91.onrender.com'
// ];

// // CORS middleware with dynamic origin checking
// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, origin);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// // Main middleware setup
// app.use(express.json());
// // app.use(session({ 
// //   secret: 'your-secret-key', 
// //   resave: false, 
// //   saveUninitialized: false,
// //   cookie: {
// //     secure: process.env.NODE_ENV === 'production',
// //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
// //     maxAge: 24 * 60 * 60 * 1000 // 24 hours
// //   }
// // }));
// app.use(session({ 
//   secret: 'your-secret-key', 
//   resave: true,  // Changed to true
//   saveUninitialized: true,  // Changed to true
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//     maxAge: 30 * 60 * 1000 // 30 minutes instead of 10
//   }
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Google Auth routes
// app.get('/api/auth/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email']
//   })
// );

// app.get('/api/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: 'https://beyond-chats-sooty.vercel.app/login',
//     session: true
//   }),
//   (req, res) => {
//     res.redirect('https://beyond-chats-sooty.vercel.app/organization-setup');
//   }
// );

// // Routes

// app.use('/api', require('./routes/authRoutes'));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   if (err.message === 'Not allowed by CORS') {
//     res.status(403).json({
//       error: 'CORS error: Origin not allowed'
//     });
//   } else {
//     next(err);
//   }
// });

// // Start Server
// connectDB();
// app.listen(3001, () => console.log('Server running on port 3001'));