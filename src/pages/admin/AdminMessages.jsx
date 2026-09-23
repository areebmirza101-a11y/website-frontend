import { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Check, Trash2 } from 'lucide-react';
import { contactApi } from '../../api';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import Seo from '../../components/Seo';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useAdminTitle('Messages');

  const load = () => {
    setLoading(true);
    contactApi
      .list()
      .then(setMessages)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    try {
      await contactApi.markRead(id);
      setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch (err) {
      setError(err.message);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl">
      <Seo title="Admin — Messages" />

      {unreadCount > 0 && <p className="text-sm text-gray-500 mb-6">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>}

      {loading ? (
        <p className="text-gray-400">Loading messages…</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${!m.read ? 'border-l-4 border-teal-500' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-sm text-gray-500">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                  {!m.read && (
                    <button
                      onClick={() => markRead(m.id)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{m.subject}</h3>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
