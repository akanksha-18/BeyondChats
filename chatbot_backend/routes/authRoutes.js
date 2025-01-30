// const express = require('express');
// const passport = require('passport');
// const authController = require('../controllers/authController');

// const router = express.Router();

// // Routes
// router.post('/send-verification', authController.sendVerification);
// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);

// // Google OAuth Routes
// router.get('/auth/google', passport.authenticate('google', { 
//   scope: ['profile', 'email']
// }));

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { 
//     failureRedirect: 'http://localhost:5173/login',
//     session: true
//   }),
//   (req, res) => {
//     res.redirect('http://localhost:5173/organization-setup');
//   }
// );

// module.exports = router;

// const express = require('express');
// const passport = require('passport');
// const authController = require('../controllers/authController');

// const router = express.Router();

// // Routes
// router.post('/send-verification', authController.sendVerification);
// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);

// // Google OAuth Routes
// router.get('/auth/google', passport.authenticate('google', { 
//   scope: ['profile', 'email']
// }));

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { 
//     failureRedirect: 'https://beyondchats-iplg6bnqv-akanksha-dubeys-projects.vercel.app/login', 
//     session: true
//   }),
//   (req, res) => {
//     res.redirect('https://beyondchats-iplg6bnqv-akanksha-dubeys-projects.vercel.app/organization-setup'); 
//   }
// );

// module.exports = router;


const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Define frontend URL based on environment
const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://beyond-chats-dgrz3lfys-akanksha-dubeys-projects.vercel.app'
  : 'http://localhost:5173';

// Routes
router.post('/send-verification', authController.sendVerification);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Google OAuth Routes
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: true
  }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/organization-setup`);
  }
);

module.exports = router;