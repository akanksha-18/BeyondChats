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
      const res = await fetch('https://beyondchats-cr91.onrender.com/api/send-verification', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: formData.email,
          isLogin: isLogin 
        }),
      });
  
      const data = await res.json();
      console.log('Verification code sent response:', data);
  
      if (res.ok) {
        // Store the timestamp when the code was sent
        localStorage.setItem('verificationTimestamp', Date.now().toString());
        setMessage('Verification code sent! Please check your email.');
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
    
    // Check if verification code is expired (5 minutes limit)
    const verificationTimestamp = localStorage.getItem('verificationTimestamp');
    const now = Date.now();
    if (verificationTimestamp && (now - parseInt(verificationTimestamp)) > 5 * 60 * 1000) {
      setError('Verification code has expired. Please request a new code.');
      setStep('initial');
      return;
    }
  
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
        verificationCode: verificationCode.trim(),
        timestamp: verificationTimestamp, // Send the timestamp for server-side validation
        ...(isLogin ? {} : { name: formData.name })
      };
  
      console.log('Sending verification payload:', payload);
  
      const res = await fetch(`https://beyondchats-cr91.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      console.log('Response data:', data);
  
      if (res.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
        localStorage.setItem('userEmail', formData.email);
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        // Clear verification timestamp
        localStorage.removeItem('verificationTimestamp');
        setTimeout(() => {
          navigate('/organization-setup');
        }, 1500);
      } else {
        if (data.message.includes('expired')) {
          setStep('initial'); // Go back to initial step if code expired
        }
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handleVerifyAndProceed = async (e) => {
  //   e.preventDefault();
  //   if (!verificationCode) {
  //     setError('Please enter the verification code.');
  //     return;
  //   }

  //   setLoading(true);
  //   setError('');
  //   setMessage('');

  //   try {
  //     const endpoint = isLogin ? '/api/login' : '/api/register';
  //     const payload = {
  //       email: formData.email,
  //       password: formData.password,
  //       verificationCode: verificationCode
  //     };

  //     if (!isLogin) {
  //       payload.name = formData.name;
  //     }

  //     const res = await fetch(`https://beyondchats-cr91.onrender.com${endpoint}`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       credentials: 'include',
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
  //       localStorage.setItem('userEmail', formData.email);
  //       setTimeout(() => {
  //         navigate('/organization-setup');
  //       }, 1500);
  //     } else {
  //       setError(data.message || (isLogin ? 'Login failed.' : 'Registration failed.'));
  //     }
  //   } catch (error) {
  //     console.error('Auth error:', error);
  //     setError('An error occurred. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  

  const handleSendVerification = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    setError('');
    setMessage('');
  
    try {
      const res = await fetch('https://beyondchats-cr91.onrender.com/api/send-verification', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
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
      // Use the original login/register endpoints since that's what your server expects
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = {
        email: formData.email,
        password: formData.password,
        verificationCode: verificationCode.trim(),
        ...(isLogin ? {} : { name: formData.name })
      };
  
      console.log('Sending verification payload:', payload);
  
      const res = await fetch(`https://beyondchats-cr91.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      // Log the full response for debugging
      console.log('Response status:', res.status);
      
      // Handle non-JSON responses
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned ${res.status}: Not a JSON response`);
      }
  
      const data = await res.json();
      console.log('Response data:', data);
  
      if (res.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
        localStorage.setItem('userEmail', formData.email);
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        setTimeout(() => {
          navigate('/organization-setup');
        }, 1500);
      } else {
        throw new Error(data.message || (isLogin ? 'Login failed.' : 'Registration failed.'));
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(
        error.message === 'Failed to fetch' 
          ? 'Unable to connect to the server. Please try again.'
          : error.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignup = () => {
    window.location.href = 'https://beyondchats-cr91.onrender.com/api/auth/google';
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