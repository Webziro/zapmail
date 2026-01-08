import React, { useState } from 'react';
import { X, Save, HelpCircle, ExternalLink } from 'lucide-react';
import { rulesAPI } from '../services/api';
import toast from 'react-hot-toast';

interface RuleFormProps {
  rule?: any;
  onClose: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({ rule, onClose }) => {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    emailUser: rule?.emailUser || '',
    emailPassword: '',
    emailHost: rule?.emailHost || 'imap.gmail.com',
    emailPort: rule?.emailPort || 993,
    filterSubjects: rule?.filterSubjects?.join(', ') || '',
    filterSenders: rule?.filterSenders?.join(', ') || '',
    filterHours: rule?.filterHours || 24,
    cronSchedule: rule?.cronSchedule || '*/10 * * * *',
  });

  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        filterSubjects: formData.filterSubjects
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        filterSenders: formData.filterSenders
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        emailPort: parseInt(formData.emailPort.toString()),
        filterHours: parseInt(formData.filterHours.toString()),
      };

      if (rule) {
        await rulesAPI.update(rule.id, data);
        toast.success('Rule updated successfully');
      } else {
        await rulesAPI.create(data);
        toast.success('Rule created successfully');
      }

      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">
              {rule ? 'Edit Rule' : 'Create New Rule'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Work Emails, Important Notifications"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Email Configuration</h3>
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <HelpCircle size={20} />
                  Need Help?
                </button>
              </div>

              {showHelp && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📧 How to get Gmail App Password:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>Go to your Google Account settings</li>
                    <li>Enable 2-Step Verification (if not enabled)</li>
                    <li>Go to App Passwords section</li>
                    <li>Select "Mail" and "Other (Custom name)"</li>
                    <li>Copy the 16-character password</li>
                    <li>Paste it below</li>
                  </ol>
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink size={16} />
                    Open Google App Passwords
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.emailUser}
                    onChange={(e) => setFormData({ ...formData, emailUser: e.target.value })}
                    placeholder="your-email@gmail.com"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gmail App Password * {rule && '(leave blank to keep existing)'}
                  </label>
                  <input
                    type="password"
                    value={formData.emailPassword}
                    onChange={(e) => setFormData({ ...formData, emailPassword: e.target.value })}
                    placeholder="xxxx xxxx xxxx xxxx (16 characters)"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required={!rule}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ This is NOT your regular Gmail password. You must use an App Password.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IMAP Host
                  </label>
                  <input
                    type="text"
                    value={formData.emailHost}
                    onChange={(e) => setFormData({ ...formData, emailHost: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IMAP Port
                  </label>
                  <input
                    type="number"
                    value={formData.emailPort}
                    onChange={(e) => setFormData({ ...formData, emailPort: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Email Filters</h3>
              <p className="text-sm text-gray-600 mb-4">
                Only forward emails that match these conditions (leave empty to forward all)
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.filterSubjects}
                    onChange={(e) => setFormData({ ...formData, filterSubjects: e.target.value })}
                    placeholder="urgent, important, action required"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Forward only if subject contains any of these words
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email Addresses (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.filterSenders}
                    onChange={(e) => setFormData({ ...formData, filterSenders: e.target.value })}
                    placeholder="boss@company.com, client@business.com"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Forward only from these email addresses
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Window (hours)
                  </label>
                  <input
                    type="number"
                    value={formData.filterHours}
                    onChange={(e) => setFormData({ ...formData, filterHours: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only check emails from the last X hours
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Check Schedule</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How often to check for new emails
                </label>
                <select
                  value={formData.cronSchedule}
                  onChange={(e) => setFormData({ ...formData, cronSchedule: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="*/5 * * * *">Every 5 minutes</option>
                  <option value="*/10 * * * *">Every 10 minutes</option>
                  <option value="*/15 * * * *">Every 15 minutes</option>
                  <option value="*/30 * * * *">Every 30 minutes</option>
                  <option value="0 * * * *">Every hour</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Rule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RuleForm;