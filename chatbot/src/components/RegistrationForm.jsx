import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('initial');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
    setStep('initial');
    setFormData({ email: '', password: '', name: '' });
    setVerificationCode('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (!isLogin && !formData.name) {
      setError('Please enter your name.');
      return false;
    }
    return true;
  };

  const handleSendVerification = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('https://beyondchats-55cv.onrender.com/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          email: formData.email,
          isLogin: isLogin 
        }),
      });

      const data = await res.json();
      console.log('Verification response:', data);

      if (res.ok) {
        setMessage(data.message || 'Verification code sent successfully!');
        setStep('verification');
        setIsLogin(data.isExistingUser);
      } else {
        setError(data.message || 'Failed to send verification code.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndProceed = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter the verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = {
        email: formData.email,
        password: formData.password,
        verificationCode: verificationCode
      };

      if (!isLogin) {
        payload.name = formData.name;
      }

      const res = await fetch(`https://beyondchats-55cv.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
        localStorage.setItem('userEmail', formData.email);
        setTimeout(() => {
          navigate('/organization-setup');
        }, 1500);
      } else {
        setError(data.message || (isLogin ? 'Login failed.' : 'Registration failed.'));
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'https://beyondchats-55cv.onrender.com/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black flex items-center justify-center text-white">
      <div className="max-w-md w-full mx-auto p-8 bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-700 text-white rounded-lg text-center">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-3 bg-green-700 text-white rounded-lg text-center">
            {message}
          </div>
        )}

        {step === 'initial' && (
          <form onSubmit={handleSendVerification} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg font-medium transition-colors duration-200 
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Send Login Code' : 'Send Verification Code')}
            </button>
          </form>
        )}

        {step === 'verification' && (
          <form onSubmit={handleVerifyAndProceed} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Verification Code</label>
              <input
                type="text"
                placeholder="Enter verification code"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg font-medium transition-colors duration-200 
                ${loading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'}`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Complete Registration')}
            </button>
          </form>
        )}

        <div className="mt-6">
          <button
            onClick={handleGoogleSignup}
            className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Sign up with Google
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleToggleMode}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;