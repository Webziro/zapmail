import React, { useState, useEffect } from 'react';
import { Plus, Power, Edit, Trash2, BarChart3 } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your email forwarding rules</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogs(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <BarChart3 size={20} />
              View Logs
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              New Rule
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Total Forwards</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Successful</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{stats.successful}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Failed</div>
              <div className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Last 24 Hours</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{stats.last24Hours}</div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {rules.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">No forwarding rules yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Rule
              </button>
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">{rule.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          rule.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div>Email: {rule.emailUser}</div>
                      <div>WhatsApp: {rule.whatsappRecipient}</div>
                      {rule.filterSubjects.length > 0 && (
                        <div>Subjects: {rule.filterSubjects.join(', ')}</div>
                      )}
                      {rule.filterSenders.length > 0 && (
                        <div>From: {rule.filterSenders.join(', ')}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className={`p-2 rounded-lg ${
                        rule.isActive
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={rule.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;