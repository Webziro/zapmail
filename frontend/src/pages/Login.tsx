import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Moon, Sun } from 'lucide-react';
import { authAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Increased padding (py-4, pl-14) to prevent overlap. Reduced icon size to 18.
  const inputStyles = `w-full pl-14 pr-4 py-4 rounded-xl transition-all focus:outline-none focus:ring-2 border ${isDarkMode
      ? 'bg-[#262626] border-[#3a3a3a] text-white placeholder-gray-500 focus:ring-white/50'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-900/20'
    }`;

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      {/* Dark mode toggle - fixed position */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 md:top-6 md:right-6 p-2.5 md:p-3 rounded-xl transition-all z-50 ${isDarkMode
            ? 'bg-[#262626] text-white hover:bg-[#333]'
            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
          }`}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Branding (hidden on mobile) */}
        <div className={`hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8 xl:p-16 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-900'
          }`}>
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 xl:w-20 xl:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 xl:mb-8">
              <Mail className="text-white" size={32} />
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-white mb-3 xl:mb-4">
              ZapMail
            </h1>
            <p className="text-base xl:text-lg text-gray-400 leading-relaxed mb-8 xl:mb-12">
              Forward your important emails directly to WhatsApp. Never miss a critical message again.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 xl:gap-6">
              <div className="text-center">
                <div className="text-2xl xl:text-3xl font-bold text-white">10K+</div>
                <div className="text-xs xl:text-sm text-gray-500 mt-1">Emails Forwarded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl xl:text-3xl font-bold text-white">99.9%</div>
                <div className="text-xs xl:text-sm text-gray-500 mt-1">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl xl:text-3xl font-bold text-white">500+</div>
                <div className="text-xs xl:text-sm text-gray-500 mt-1">Active Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-sm sm:max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6 sm:mb-8">
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-3 ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                }`}>
                <Mail size={24} />
              </div>
              <h1 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ZapMail
              </h1>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left mb-6 sm:mb-8 pl-5">
              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome back
              </h2>
              <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} `}>
                Sign in to your account to continue
              </p>
            </div>

            {/* Form Card */}
            <div className={`rounded-2xl p-6 sm:p-8 ${isDarkMode
                ? 'bg-[#1a1a1a] border border-[#2e2e2e]'
                : 'bg-white shadow-xl border border-gray-100'
              }`}>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                   Email address
                  </label>
                  <div className="relative p-20 mb-20">
                    {/* Icon position left-4, size 18 */}
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputStyles}
                      // placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputStyles} 
                      // placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Link */}
            <p className={`text-center mt-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <Link to="/register" className={`font-medium hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;