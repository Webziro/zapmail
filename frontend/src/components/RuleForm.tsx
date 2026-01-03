import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
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
    twilioAccountSid: rule?.twilioAccountSid || '',
    twilioAuthToken: '',
    whatsappSender: rule?.whatsappSender || 'whatsapp:+14155238886',
    whatsappRecipient: rule?.whatsappRecipient || '',
    cronSchedule: rule?.cronSchedule || '*/10 * * * *',
  });

  const [loading, setLoading] = useState(false);

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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.emailUser}
                    onChange={(e) => setFormData({ ...formData, emailUser: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Password * {rule && '(leave blank to keep existing)'}
                  </label>
                  <input
                    type="password"
                    value={formData.emailPassword}
                    onChange={(e) => setFormData({ ...formData, emailPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required={!rule}
                  />
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.filterSubjects}
                    onChange={(e) => setFormData({ ...formData, filterSubjects: e.target.value })}
                    placeholder="urgent, important"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Emails (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.filterSenders}
                    onChange={(e) => setFormData({ ...formData, filterSenders: e.target.value })}
                    placeholder="boss@company.com, client@business.com"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
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
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">WhatsApp Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twilio Account SID *
                  </label>
                  <input
                    type="text"
                    value={formData.twilioAccountSid}
                    onChange={(e) => setFormData({ ...formData, twilioAccountSid: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twilio Auth Token * {rule && '(leave blank to keep existing)'}
                  </label>
                  <input
                    type="password"
                    value={formData.twilioAuthToken}
                    onChange={(e) => setFormData({ ...formData, twilioAuthToken: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required={!rule}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Sender (Twilio Number) *
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappSender}
                    onChange={(e) => setFormData({ ...formData, whatsappSender: e.target.value })}
                    placeholder="whatsapp:+14155238886"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappRecipient}
                    onChange={(e) => setFormData({ ...formData, whatsappRecipient: e.target.value })}
                    placeholder="whatsapp:+1234567890"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Schedule</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cron Schedule
                </label>
                <input
                  type="text"
                  value={formData.cronSchedule}
                  onChange={(e) => setFormData({ ...formData, cronSchedule: e.target.value })}
                  placeholder="*/10 * * * *"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Default: Every 10 minutes (*/10 * * * *)
                </p>
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