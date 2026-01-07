import React, { useState } from 'react';
import { X, Save, Mail, MessageSquare, Clock, Key } from 'lucide-react';
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

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {rule ? 'Edit Rule' : 'Create New Rule'}
            </h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rule Name */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
            <label className={labelClass}>Rule Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
              placeholder="My forwarding rule"
              required
            />
          </div>

          {/* Email Configuration */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Mail className="text-gray-500" size={18} />
              <h2 className="text-base font-semibold text-gray-900">Email Configuration</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={formData.emailUser}
                  onChange={(e) => setFormData({ ...formData, emailUser: e.target.value })}
                  className={inputClass}
                  placeholder="you@gmail.com"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  App Password {rule && <span className="text-gray-400 font-normal">(leave blank to keep)</span>}
                </label>
                <input
                  type="password"
                  value={formData.emailPassword}
                  onChange={(e) => setFormData({ ...formData, emailPassword: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••••••"
                  required={!rule}
                />
              </div>
              <div>
                <label className={labelClass}>IMAP Host</label>
                <input
                  type="text"
                  value={formData.emailHost}
                  onChange={(e) => setFormData({ ...formData, emailHost: e.target.value })}
                  className={inputClass}
                  placeholder="imap.gmail.com"
                />
              </div>
              <div>
                <label className={labelClass}>IMAP Port</label>
                <input
                  type="number"
                  value={formData.emailPort}
                  onChange={(e) => setFormData({ ...formData, emailPort: parseInt(e.target.value) })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Email Filters */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-[18px] h-[18px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-base font-semibold text-gray-900">Email Filters</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Subject Keywords <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                <input
                  type="text"
                  value={formData.filterSubjects}
                  onChange={(e) => setFormData({ ...formData, filterSubjects: e.target.value })}
                  placeholder="urgent, important, invoice"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Sender Emails <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                <input
                  type="text"
                  value={formData.filterSenders}
                  onChange={(e) => setFormData({ ...formData, filterSenders: e.target.value })}
                  placeholder="boss@company.com, client@business.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Time Window (hours)</label>
                <input
                  type="number"
                  value={formData.filterHours}
                  onChange={(e) => setFormData({ ...formData, filterHours: parseInt(e.target.value) })}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1.5">Only process emails from the last N hours</p>
              </div>
            </div>
          </div>

          {/* WhatsApp Configuration */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="text-gray-500" size={18} />
              <h2 className="text-base font-semibold text-gray-900">WhatsApp Configuration</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Twilio Account SID</label>
                <input
                  type="text"
                  value={formData.twilioAccountSid}
                  onChange={(e) => setFormData({ ...formData, twilioAccountSid: e.target.value })}
                  className={inputClass}
                  placeholder="ACxxxxxxxxxxxxxxxx"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  Twilio Auth Token {rule && <span className="text-gray-400 font-normal">(leave blank to keep)</span>}
                </label>
                <input
                  type="password"
                  value={formData.twilioAuthToken}
                  onChange={(e) => setFormData({ ...formData, twilioAuthToken: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••••••"
                  required={!rule}
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Sender (Twilio)</label>
                <input
                  type="text"
                  value={formData.whatsappSender}
                  onChange={(e) => setFormData({ ...formData, whatsappSender: e.target.value })}
                  placeholder="whatsapp:+14155238886"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Your WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsappRecipient}
                  onChange={(e) => setFormData({ ...formData, whatsappRecipient: e.target.value })}
                  placeholder="whatsapp:+1234567890"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="text-gray-500" size={18} />
              <h2 className="text-base font-semibold text-gray-900">Schedule</h2>
            </div>
            <div>
              <label className={labelClass}>Cron Schedule</label>
              <input
                type="text"
                value={formData.cronSchedule}
                onChange={(e) => setFormData({ ...formData, cronSchedule: e.target.value })}
                placeholder="*/10 * * * *"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1.5">Default: Every 10 minutes (*/10 * * * *)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-all text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Rule
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RuleForm;