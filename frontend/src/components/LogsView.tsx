import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2, ArrowLeft } from 'lucide-react';
import { logsAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface LogsViewProps {
  onClose: () => void;
}

const LogsView: React.FC<LogsViewProps> = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await logsAPI.getAll({ limit: 100 });
      setLogs(response.data.logs);
    } catch (error) {
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs?')) return;

    try {
      await logsAPI.clear();
      toast.success('Logs cleared');
      setLogs([]);
    } catch (error) {
      toast.error('Failed to clear logs');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-[#262626]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Forwarding Logs</h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>View email forwarding history</p>
              </div>
            </div>
            <button
              onClick={handleClearLogs}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${isDarkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                }`}
            >
              <Trash2 size={16} />
              Clear Logs
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading logs...
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className={`rounded-xl border p-12 text-center ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'}`}>
              <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No logs yet</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Email forwards will appear here</p>
          </div>
        ) : (
          <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-[#2e2e2e]' : 'border-gray-100'}`}>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rule</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Subject</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>From</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-[#2e2e2e]' : 'divide-gray-100'}`}>
                  {logs.map((log) => (
                    <tr key={log.id} className={`transition-colors ${isDarkMode ? 'hover:bg-[#262626]' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.status === 'success' ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-500 text-sm">
                            <CheckCircle size={16} />
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-red-500 text-sm">
                            <XCircle size={16} />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{log.rule?.name || 'Unknown'}</span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <span className={`text-sm truncate block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.emailSubject}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.emailFrom}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LogsView;