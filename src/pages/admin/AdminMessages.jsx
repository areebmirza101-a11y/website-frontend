import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Mail,
  Calendar,
  Check,
  CheckCheck,
  Trash2,
  Eye,
  X,
  Send,
  Search,
  Clock,
  User,
  Globe,
  Inbox,
  ExternalLink,
  Loader2,
  Reply,
} from 'lucide-react';
import { contactApi } from '../../api';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import Seo from '../../components/Seo';
import { confirmAction } from '../../utils/confirmToast';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'read'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Embedded Reply State
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useAdminTitle('Messages');

  const load = async () => {
    setLoading(true);
    try {
      const data = await contactApi.list();
      setMessages(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleRead = async (id, currentReadState, e) => {
    if (e) e.stopPropagation();
    const newStatus = !currentReadState;
    try {
      await contactApi.toggleRead(id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: newStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => ({ ...prev, read: newStatus }));
      }
      toast.success(newStatus ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      toast.error(err.message || 'Failed to update message status');
    }
  };

  const handleDelete = (id, subject, e) => {
    if (e) e.stopPropagation();
    confirmAction(
      `Delete message "${subject || 'Inquiry'}"? This action cannot be undone.`,
      async () => {
        try {
          await contactApi.remove(id);
          setMessages((prev) => prev.filter((m) => m.id !== id));
          if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage(null);
          }
          toast.success('Message deleted successfully');
        } catch (err) {
          toast.error(err.message || 'Failed to delete message');
        }
      }
    );
  };

  const handleOpenDetails = async (message) => {
    setSelectedMessage(message);
    setReplySubject(`Re: ${message.subject || 'Your Inquiry with Velmoras Creation'}`);
    setReplyMessage('');

    // If opening unread message, mark it as read automatically
    if (!message.read) {
      try {
        await contactApi.toggleRead(message.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, read: true } : m))
        );
        setSelectedMessage({ ...message, read: true });
      } catch {
        // silent fail for auto-read
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please write a reply message before sending');
      return;
    }
    setSendingReply(true);
    try {
      await contactApi.reply(selectedMessage.id, {
        subject: replySubject.trim() || `Re: ${selectedMessage.subject || 'Your Inquiry'}`,
        message: replyMessage.trim(),
      });
      toast.success(`Reply email sent successfully to ${selectedMessage.email}`);
      // Mark as read in state
      setMessages((prev) =>
        prev.map((m) => (m.id === selectedMessage.id ? { ...m, read: true } : m))
      );
      setSelectedMessage((prev) => ({ ...prev, read: true }));
      setReplyMessage('');
    } catch (err) {
      toast.error(err.message || 'Failed to send reply email');
    } finally {
      setSendingReply(false);
    }
  };

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);
  const readCount = useMemo(() => messages.filter((m) => m.read).length, [messages]);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // Tab filter
      if (activeTab === 'unread' && m.read) return false;
      if (activeTab === 'read' && !m.read) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = m.name?.toLowerCase().includes(query);
        const emailMatch = m.email?.toLowerCase().includes(query);
        const subjectMatch = m.subject?.toLowerCase().includes(query);
        const textMatch = m.message?.toLowerCase().includes(query);
        return nameMatch || emailMatch || subjectMatch || textMatch;
      }
      return true;
    });
  }, [messages, activeTab, searchQuery]);

  return (
    <div className="max-w-6xl pb-16">
      <Seo title="Admin — Messages & Inquiries" />

      {/* Top Header / Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Inquiries</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage, review, and reply directly to inquiries from your website contact form.
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start md:self-auto border border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'unread'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                  activeTab === 'unread' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'read'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Read ({readCount})
          </button>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender name, email, subject, or message text…"
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-xs">
          <Mail className="h-8 w-8 mx-auto mb-3 animate-bounce text-gray-300" />
          <p className="text-sm font-medium">Loading messages…</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-xs">
          <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {searchQuery
              ? 'No matching inquiries found'
              : activeTab === 'unread'
              ? 'No unread inquiries'
              : 'No messages yet'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search keywords to find what you are looking for.'
              : 'Customer contact form inquiries will appear here automatically.'}
          </p>
        </div>
      ) : (
        /* Messages List */
        <div className="space-y-3">
          {filteredMessages.map((m) => {
            const isUnread = !m.read;
            const dateStr = m.created_at
              ? new Date(m.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={m.id}
                onClick={() => handleOpenDetails(m)}
                className={`group bg-white rounded-2xl border transition-all duration-200 p-5 shadow-xs hover:shadow-md cursor-pointer relative overflow-hidden ${
                  isUnread
                    ? 'border-blue-300 bg-blue-50/20 ring-1 ring-blue-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Visual Unread Accent Indicator */}
                {isUnread && (
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-600 rounded-l-2xl" />
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  {/* Sender & Status Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                        isUnread
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {m.name ? m.name.charAt(0) : 'U'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-base">{m.name}</span>
                        {/* Status Badge */}
                        {isUnread ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                            UNREAD
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCheck className="w-3 h-3" />
                            READ
                          </span>
                        )}
                        {m.country && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600">
                            <Globe className="w-3 h-3" />
                            {m.country}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{m.email}</p>
                    </div>
                  </div>

                  {/* Date & Actions */}
                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateStr}
                    </span>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1 pl-2 border-l border-gray-200">
                      <button
                        onClick={(e) => handleToggleRead(m.id, m.read, e)}
                        className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isUnread
                            ? 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title={isUnread ? 'Mark as read' : 'Mark as unread'}
                      >
                        {isUnread ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => handleDelete(m.id, m.subject, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subject & Preview */}
                <div className="pl-0 md:pl-13">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                    {m.subject || '(No Subject)'}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {m.message}
                  </p>
                </div>

                {/* View Details Hint */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 pl-0 md:pl-13">
                  <span className="group-hover:text-black font-medium flex items-center gap-1 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Click to view details & reply directly
                  </span>
                  <span className="text-[11px] text-gray-400">ID: #{m.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50 shrink-0">
              <div className="pr-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Customer Inquiry Details
                  </span>
                  {!selectedMessage.read ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      UNREAD
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCheck className="w-3 h-3" />
                      READ
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  {selectedMessage.subject || 'Customer Inquiry'}
                </h3>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Sender Info Card */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Customer Name</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {selectedMessage.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-400 block font-medium">Email Address</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-semibold text-blue-600 hover:underline truncate block"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">Date Received</span>
                    <span className="font-medium text-gray-800">
                      {selectedMessage.created_at
                        ? new Date(selectedMessage.created_at).toLocaleString()
                        : 'Recent'}
                    </span>
                  </div>
                </div>

                {selectedMessage.country && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Location</span>
                      <span className="font-semibold text-gray-800 uppercase">
                        {selectedMessage.country}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Original Message */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">
                  Original Customer Message
                </label>
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Embedded Direct Reply Composer */}
              <div className="bg-gradient-to-b from-gray-50/80 to-white rounded-2xl p-5 border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Reply className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Direct Email Reply</h4>
                      <p className="text-xs text-gray-500">
                        Sending official response to{' '}
                        <span className="font-semibold text-gray-800">{selectedMessage.email}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
                    title="Open external mail client"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">External mail app</span>
                  </a>
                </div>

                {/* Reply Subject */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Subject</label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    disabled={sendingReply}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium text-gray-800 disabled:opacity-50"
                  />
                </div>

                {/* Reply Message */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Your Reply</label>
                  <textarea
                    rows={6}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    disabled={sendingReply}
                    placeholder={`Hello ${selectedMessage.name},\n\nThank you for reaching out to Velmoras Creation regarding your inquiry...\n\nBest regards,\nVelmoras Creation Support Team`}
                    className="w-full px-3.5 py-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black text-gray-800 leading-relaxed disabled:opacity-50 resize-y"
                  />
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  {replyMessage.trim() && (
                    <button
                      type="button"
                      onClick={() => setReplyMessage('')}
                      disabled={sendingReply}
                      className="px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyMessage.trim()}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-[0.99] cursor-pointer"
                  >
                    {sendingReply ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Reply…</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Reply to Customer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {/* Toggle Read */}
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition-colors flex items-center gap-1.5"
                >
                  {selectedMessage.read ? (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      Mark as Unread
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Mark as Read
                    </>
                  )}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage.id, selectedMessage.subject)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
