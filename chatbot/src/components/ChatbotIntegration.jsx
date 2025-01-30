import React, { useState, useEffect } from 'react';
import { Share2, Code, Mail, Check, AlertTriangle, LogOut, Settings, MessageSquare } from 'lucide-react';
import Confetti from 'react-confetti';
import { useNavigate } from "react-router-dom";

const ChatbotIntegration = () => {
  const navigate = useNavigate();
  const [integrationStatus, setIntegrationStatus] = useState('pending');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dummyCode = `<script>
  window.chatbotConfig = {
    apiKey: 'your-api-key',
    position: 'bottom-right'
  };
</script>
<script src="https://cdn.example.com/chatbot.js"></script>`;

  const handleTestChatbot = () => {
    window.open('https://yourclient.com?chatbot=test', '_blank');
  };

  const handleTestIntegration = () => {
    setTimeout(() => {
      const success = Math.random() > 0.5;
      setIntegrationStatus(success ? 'success' : 'failure');
      if (success) setShowConfetti(true);
    }, 1500);
  };

  const handleLogout = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <div className="bg-blue-600 text-center py-2 px-4 text-sm font-medium">
        <span className="inline-flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          New: AI-powered response templates now available!
          <a href="#" className="ml-2 underline hover:text-white">Learn more →</a>
        </span>
      </div>

      <header className={`sticky top-0 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Chatbot Dashboard
              </h2>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            className="transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg hover:shadow-blue-500/25"
            onClick={handleTestChatbot}
          >
            <Share2 className="w-6 h-6 mb-4" />
            <h3 className="text-lg font-semibold">Test Chatbot</h3>
            <p className="text-sm text-blue-200 mt-2">Preview your chatbot in action</p>
          </button>

          <button 
            className="transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg hover:shadow-purple-500/25"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <Code className="w-6 h-6 mb-4" />
            <h3 className="text-lg font-semibold">Integration Guide</h3>
            <p className="text-sm text-purple-200 mt-2">Get setup instructions</p>
          </button>

          <button 
            className="transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg hover:shadow-green-500/25"
            onClick={handleTestIntegration}
          >
            <Check className="w-6 h-6 mb-4" />
            <h3 className="text-lg font-semibold">Verify Setup</h3>
            <p className="text-sm text-green-200 mt-2">Test your integration</p>
          </button>
        </div>

        {showInstructions && (
          <div className="mt-8 backdrop-blur-lg bg-white/10 rounded-xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold mb-6">Integration Instructions</h3>
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <code className="text-sm font-mono text-blue-300">{dummyCode}</code>
              </div>
              <button 
                className="inline-flex items-center px-6 py-3 rounded-lg border border-blue-400 hover:bg-blue-400/20 transition-colors duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email to Developer
              </button>
            </div>
          </div>
        )}

        {integrationStatus === 'success' && (
          <div className="mt-8 text-center">
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
            <div className="mb-8 bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-xl p-6">
              <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-400">Integration Successful!</h3>
              <p className="text-green-300 mt-2">Your chatbot is ready to engage with users</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300">
                <Settings className="w-5 h-5 inline mr-2" />
                Configure Settings
              </button>
              <button 
                onClick={() => window.open("https://akanksha-18.github.io/Mini-Projects/Gemini/index.html", "_blank")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300"
              >
                <MessageSquare className="w-5 h-5 inline mr-2" />
                Open Chatbot
              </button>
            </div>
          </div>
        )}

        {integrationStatus === 'failure' && (
          <div className="mt-8 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-xl p-6 flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <p className="text-yellow-300">
              Integration check failed. Please verify your implementation and try again.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-12 py-6 text-center text-gray-400 text-sm">
        <p>&copy; 2025 Your Organization. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChatbotIntegration;