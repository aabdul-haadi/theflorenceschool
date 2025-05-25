import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, School, KeyRound } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!username || !password || !verificationCode) {
        throw new Error('Please fill in all fields');
      }

      const success = await login(username, password, verificationCode);
      if (success) {
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both email and password');
      return;
    }
    setShowVerification(true);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-8 py-12">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-primary-50 mb-4">
                <School className="h-10 w-10 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">The Florence School</h1>
              <p className="mt-2 text-sm text-gray-600">Sign in to access your account</p>
            </motion.div>

            <motion.form 
              onSubmit={showVerification ? handleVerificationSubmit : handleInitialSubmit}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              {!showVerification ? (
                <>
                  <div className="relative">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="username"
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 rounded-lg text-white font-medium bg-primary-600 hover:bg-primary-700 transition-all duration-200"
                  >
                    Continue
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <label htmlFor="verification" className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="verification"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="pl-10 block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter verification code"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      type="button"
                      onClick={() => setShowVerification(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 px-4 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-primary-600 hover:bg-primary-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span className="ml-2">Verifying...</span>
                        </div>
                      ) : (
                        'Verify & Sign In'
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;