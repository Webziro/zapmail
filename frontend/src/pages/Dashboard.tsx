import React, { useState, useEffect } from 'react';
import { Plus, Power, Edit, Trash2, BarChart3, LogOut, Mail, MessageSquare, Filter, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { rulesAPI, logsAPI } from '../services/api';
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
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
        <div className="flex items-center gap-3 text-gray-500">
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
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Mail className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ZapMail</h1>
                <p className="text-xs text-gray-500">Email to WhatsApp forwarding</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogs(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <BarChart3 size={18} />
                <span className="text-sm font-medium">Logs</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total Forwards</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-gray-500" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Successful</p>
                  <p className="text-2xl font-semibold text-emerald-600 mt-1">{stats.successful}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Failed</p>
                  <p className="text-2xl font-semibold text-red-600 mt-1">{stats.failed}</p>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Last 24h</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.last24Hours}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-gray-500" size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rules Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Forwarding Rules</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage your email forwarding configurations</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all text-sm"
          >
            <Plus size={18} />
            New Rule
          </button>
        </div>

        <div className="space-y-4">
          {rules.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rules yet</h3>
              <p className="text-gray-500 mb-6 text-sm">Create your first forwarding rule to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all text-sm"
              >
                Create Your First Rule
              </button>
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-base font-semibold text-gray-900 truncate">{rule.name}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${rule.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail size={14} />
                        <span className="truncate">{rule.emailUser}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MessageSquare size={14} />
                        <span className="truncate">{rule.whatsappRecipient}</span>
                      </div>
                    </div>
                    {(rule.filterSubjects.length > 0 || rule.filterSenders.length > 0) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {rule.filterSubjects.map((subject, i) => (
                          <span key={`subj-${i}`} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            Subject: {subject}
                          </span>
                        ))}
                        {rule.filterSenders.map((sender, i) => (
                          <span key={`send-${i}`} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
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
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      title={rule.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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