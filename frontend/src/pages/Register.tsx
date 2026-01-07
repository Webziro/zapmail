import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Moon, Sun } from 'lucide-react';
import { authAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.register({ name, email, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
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

      {/* Left side - Form */}
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
              Create your account
            </h2>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Start forwarding emails to WhatsApp
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
                  Full name
                </label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${isDarkMode
                        ? 'bg-[#262626] border-[#3a3a3a] text-white placeholder-gray-500 focus:ring-white focus:border-transparent'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-900 focus:border-transparent'
                      } border`}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    minLength={6}
                    required
                  />
                </div>
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Must be at least 6 characters
                </p>
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
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className={`text-center mt-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-medium hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Brand */}
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
            Set up powerful email forwarding rules and get instant WhatsApp notifications.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4 text-left bg-white/5 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-medium">Email Filtering</div>
                <div className="text-gray-500 text-sm">Filter by subject, sender, or keywords</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left bg-white/5 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-medium">WhatsApp Delivery</div>
                <div className="text-gray-500 text-sm">Instant notifications on your phone</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;