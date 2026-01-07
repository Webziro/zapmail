import React, { useState, useEffect } from 'react';
import { Plus, Power, Edit, Trash2, BarChart3, LogOut, Mail, MessageSquare, Filter, Clock, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { rulesAPI, logsAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import RuleForm from '../components/RuleForm';
import LogsView from '../components/LogsView';

interface Rule {
  id: string;
  name: string;
  isActive: boolean;
  emailUser: string;
  whatsappRecipient: string;
  filterSubjects: string[];
  filterSenders: string[];
  createdAt: string;
}

interface Stats {
  total: number;
  successful: number;
  failed: number;
  successRate: string;
  last24Hours: number;
}

const Dashboard: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    fetchRules();
    fetchStats();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await rulesAPI.getAll();
      setRules(response.data.rules);
    } catch (error) {
      toast.error('Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await logsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await rulesAPI.toggle(id);
      toast.success('Rule status updated');
      fetchRules();
    } catch (error) {
      toast.error('Failed to toggle rule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;

    try {
      await rulesAPI.delete(id);
      toast.success('Rule deleted');
      fetchRules();
    } catch (error) {
      toast.error('Failed to delete rule');
    }
  };

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRule(null);
    fetchRules();
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
        <div className={`flex items-center gap-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <RuleForm
        rule={editingRule}
        onClose={handleFormClose}
      />
    );
  }

  if (showLogs) {
    return <LogsView onClose={() => setShowLogs(false)} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                <Mail size={20} />
              </div>
              <div>
                <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ZapMail</h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Email to WhatsApp forwarding</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-[#262626]' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setShowLogs(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-[#262626]' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <BarChart3 size={18} />
                <span className="text-sm font-medium hidden sm:inline">Logs</span>
              </button>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-[#262626]' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <LogOut size={18} />
                <span className="text-sm font-medium hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className={`rounded-xl p-5 border ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Forwards</p>
                  <p className={`text-2xl font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'}`}>
                  <MessageSquare className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-5 border ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Successful</p>
                  <p className="text-2xl font-semibold text-emerald-500 mt-1">{stats.successful}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-5 border ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Failed</p>
                  <p className="text-2xl font-semibold text-red-500 mt-1">{stats.failed}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-5 border ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Last 24h</p>
                  <p className={`text-2xl font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.last24Hours}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'}`}>
                  <Clock className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rules Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Forwarding Rules</h2>
            <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Manage your email forwarding configurations</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${isDarkMode
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
          >
            <Plus size={18} />
            New Rule
          </button>
        </div>

        <div className="space-y-4">
          {rules.length === 0 ? (
            <div className={`rounded-xl border p-12 text-center ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'}`}>
                <Filter className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} size={24} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No rules yet</h3>
              <p className={`mb-6 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Create your first forwarding rule to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm ${isDarkMode
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
              >
                Create Your First Rule
              </button>
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className={`rounded-xl border p-5 transition-all ${isDarkMode
                  ? 'bg-[#1a1a1a] border-[#2e2e2e] hover:border-[#3a3a3a]'
                  : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`text-base font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{rule.name}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${rule.isActive
                            ? isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                            : isDarkMode ? 'bg-[#262626] text-gray-400' : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Mail size={14} />
                        <span className="truncate">{rule.emailUser}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <MessageSquare size={14} />
                        <span className="truncate">{rule.whatsappRecipient}</span>
                      </div>
                    </div>
                    {(rule.filterSubjects.length > 0 || rule.filterSenders.length > 0) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {rule.filterSubjects.map((subject, i) => (
                          <span key={`subj-${i}`} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-[#262626] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                            Subject: {subject}
                          </span>
                        ))}
                        {rule.filterSenders.map((sender, i) => (
                          <span key={`send-${i}`} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-[#262626] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                            From: {sender}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className={`p-2 rounded-lg transition-all ${rule.isActive
                          ? 'text-emerald-500 hover:bg-emerald-500/10'
                          : isDarkMode ? 'text-gray-500 hover:bg-[#262626]' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      title={rule.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(rule)}
                      className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-[#262626]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;