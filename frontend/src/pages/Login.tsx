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

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 p-3 rounded-xl transition-all z-50 ${isDarkMode
            ? 'bg-[#262626] text-white hover:bg-[#333]'
            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
          }`}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Left side - Image/Brand */}
      <div className={`hidden lg:flex lg:w-1/2 xl:w-[55%] items-center justify-center p-12 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-900'
        }`}>
        <div className="max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur rounded-2xl mb-8">
            <Mail className="text-white" size={40} />
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 tracking-tight">
            ZapMail
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Forward your important emails directly to WhatsApp. Never miss a critical message again.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-500 mt-1">Emails Forwarded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-500 mt-1">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-gray-500 mt-1">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
              }`}>
              <Mail size={26} />
            </div>
            <h1 className={`text-2xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ZapMail
            </h1>
          </div>

          <div className="mb-8">
            <h2 className={`text-2xl lg:text-3xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back
            </h2>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Card */}
          <div className={`rounded-2xl p-8 ${isDarkMode
              ? 'bg-[#1a1a1a] border border-[#2e2e2e]'
              : 'bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100'
            }`}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${isDarkMode
                        ? 'bg-[#262626] border-[#3a3a3a] text-white placeholder-gray-500 focus:ring-white focus:border-transparent'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-900 focus:border-transparent'
                      } border`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${isDarkMode
                        ? 'bg-[#262626] border-[#3a3a3a] text-white placeholder-gray-500 focus:ring-white focus:border-transparent'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-900 focus:border-transparent'
                      } border`}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group ${isDarkMode
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className={`text-center mt-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Don't have an account?{' '}
            <Link to="/register" className={`font-medium hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;