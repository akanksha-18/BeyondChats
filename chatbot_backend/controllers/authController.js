const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existingUser = await User.findOne({ email });
    const isExistingUser = !!existingUser;

    const code = generateVerificationCode();
    req.session.verificationCode = code;
    req.session.email = email;
    req.session.verificationCodeExpires = Date.now() + 600000;

    await sendVerificationEmail(email, code);
    res.json({
      message: 'Verification code sent! Please check your email.',
      isExistingUser
    });
  } catch (error) {
    console.error('Error in sending verification:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, verificationCode } = req.body;

    if (!req.session.verificationCode || 
        !req.session.email || 
        req.session.verificationCode !== verificationCode || 
        req.session.email !== email ||
        Date.now() > req.session.verificationCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, verified: true });

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
};



exports.login = async (req, res) => {
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Failed to logout' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};
