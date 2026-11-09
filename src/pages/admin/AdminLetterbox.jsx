import { useEffect, useState } from 'react';
import { Mail, Send, Users, CheckCircle2, AlertCircle, RefreshCw, Eye, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { letterboxApi } from '../../api';
import { useAdminTitle } from '../../components/admin/useAdminTitle';
import toast from 'react-hot-toast';

const AdminLetterbox = () => {
  useAdminTitle('Customer Mailbox');

  const [recipientsData, setRecipientsData] = useState({ count: 0, recipients: [] });
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState([]); // empty means 'all'
  const [sendToAll, setSendToAll] = useState(true);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const fetchRecipients = () => {
    setLoadingRecipients(true);
    letterboxApi
      .getRecipients()
      .then((data) => {
        setRecipientsData(data);
      })
      .catch((err) => {
        console.error('Failed to load recipients:', err);
        toast.error('Failed to load customer emails');
      })
      .finally(() => setLoadingRecipients(false));
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleToggleEmail = (email) => {
    setSendToAll(false);
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter((e) => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const activeRecipientsCount = sendToAll
    ? recipientsData.recipients.length
    : selectedEmails.length;

  const handleApplyTemplate = (type) => {
    if (type === 'vip_sale') {
      setSubject('Exclusive VIP Offer: Enjoy 15% Off Your Next Bespoke Piece');
      setMessage(
        `Dear Valued Customer,\n\nAs a valued member of the Velmoras Creation family, we wanted to express our gratitude for your continued support.\n\nWe are currently rolling out new exclusive cinema replica designs. Use promo code VIP15 at checkout to enjoy 15% off your next custom-tailored order.\n\nThank you for choosing handmade craftsmanship.`
      );
    } else if (type === 'update') {
      setSubject('Important Store & New Collection Update — Velmoras Creation');
      setMessage(
        `Hello,\n\nWe are excited to announce new additions to our custom handcrafted costume collection.\n\nEvery piece is hand-tailored according to your individual sizing with premium screen-accurate fabrics.\n\nFeel free to explore our latest collection or reach out to us if you need custom sizing assistance.`
      );
    } else if (type === 'feedback') {
      setSubject('How was your experience with your custom outfit?');
      setMessage(
        `Hello,\n\nWe hope you are loving your handcrafted outfit from Velmoras Creation!\n\nYour feedback means the world to our tailoring artisans. If you have any photos wearing your outfit or thoughts to share, please reply directly to this email.\n\nWarm regards,\nThe Velmoras Creation Team`
      );
    }
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error('Please enter an email subject');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter email message content');
      return;
    }
    if (activeRecipientsCount === 0) {
      toast.error('No recipients selected');
      return;
    }

    setShowConfirm(false);
    setSending(true);
    setLastResult(null);

    const payload = {
      subject: subject.trim(),
      message: message.trim(),
      recipientEmails: sendToAll ? 'all' : selectedEmails,
    };

    try {
      const res = await letterboxApi.sendBroadcast(payload);
      setLastResult(res);
      toast.success(`Successfully sent to ${res.sentCount} customer(s)!`);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Broadcast send error:', err);
      toast.error(err.message || 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer Mailbox & Broadcast</h1>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-accent/10 text-accent uppercase tracking-wider">
              Noreply System
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Send announcements, VIP discount offers, or store updates directly to users who placed orders on your site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRecipients}
            disabled={loadingRecipients}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRecipients ? 'animate-spin' : ''}`} />
            <span>Refresh List</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gray-900 text-white shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Purchasing Customers</span>
            <p className="text-2xl font-black text-gray-900">{recipientsData.count}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Sender Address</span>
            <p className="text-xs font-black text-slate-800 truncate">noreply@velmorascreation.com</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Replies Routed To</span>
            <p className="text-xs font-black text-slate-800 truncate">info@velmorascreation.com</p>
          </div>
        </div>
      </div>

      {/* Result Alert if just sent */}
      {lastResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Broadcast complete:</strong> Sent to <strong>{lastResult.sentCount}</strong> customer(s) successfully!
              {lastResult.failedCount > 0 && ` (${lastResult.failedCount} failed)`}
            </span>
          </div>
          <button onClick={() => setLastResult(null)} className="font-bold underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Form (Left) & Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Recipients Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Compose Message</h2>
              
              {/* Quick Template Buttons */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent" /> Presets:
                </span>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('vip_sale')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  VIP Sale
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('update')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('feedback')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  Feedback
                </button>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Email Subject
              </label>
              <input
                type="text"
                placeholder="e.g. VIP Offer / New Star Wars Replica Collection Launch"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-gray-900 outline-none"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Message Content
              </label>
              <textarea
                rows={8}
                placeholder="Write your email announcement or offer here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 text-sm text-gray-800 leading-relaxed focus:ring-2 focus:ring-gray-900 outline-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Paragraph breaks are formatted into standard HTML paragraphs automatically.
              </p>
            </div>

            {/* Target Recipients Selector */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Target Audience: {activeRecipientsCount} recipient(s)
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                    <input
                      type="radio"
                      checked={sendToAll}
                      onChange={() => {
                        setSendToAll(true);
                        setSelectedEmails([]);
                      }}
                      className="text-gray-900 focus:ring-0"
                    />
                    <span>All Customers ({recipientsData.count})</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                    <input
                      type="radio"
                      checked={!sendToAll}
                      onChange={() => setSendToAll(false)}
                      className="text-gray-900 focus:ring-0"
                    />
                    <span>Custom Selection</span>
                  </label>
                </div>
              </div>

              {/* Customer Pills / Checklist */}
              {!sendToAll && (
                <div className="max-h-48 overflow-y-auto p-3 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1.5">
                  {recipientsData.recipients.map((c) => (
                    <label
                      key={c.email}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100 text-xs cursor-pointer hover:bg-gray-50/80"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(c.email)}
                          onChange={() => handleToggleEmail(c.email)}
                          className="rounded text-gray-900 focus:ring-0"
                        />
                        <span className="font-bold text-slate-800">{c.name}</span>
                        <span className="text-gray-400 font-mono text-[11px]">({c.email})</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold">
                        {c.orderCount} order{c.orderCount === 1 ? '' : 's'} • ${c.totalSpent}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={sending || activeRecipientsCount === 0 || !subject.trim() || !message.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-accent text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>Send Broadcast to {activeRecipientsCount} Customer(s)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Email Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Eye className="w-4 h-4 text-accent" />
            <span>Recipient Inbox Live Preview</span>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs text-xs">
              
              {/* Fake Email Client Top Bar */}
              <div className="bg-gray-100/90 px-4 py-2.5 border-b border-gray-200 text-[11px] space-y-1">
                <p className="text-gray-500 truncate">
                  <strong className="text-gray-700">From:</strong> Velmoras Creation &lt;noreply@velmorascreation.com&gt;
                </p>
                <p className="text-gray-500 truncate">
                  <strong className="text-gray-700">Reply-To:</strong> info@velmorascreation.com
                </p>
                <p className="text-gray-500 truncate">
                  <strong className="text-gray-700">Subject:</strong> {subject || '(Enter subject above)'}
                </p>
              </div>

              {/* Rendered Template */}
              <div className="bg-[#141414] text-center p-6 border-b-2 border-[#d4af37]">
                <h3 className="text-white font-black tracking-widest text-sm uppercase m-0">VELMORAS CREATION</h3>
                <p className="text-[#d4af37] text-[10px] font-bold tracking-wider uppercase mt-1 m-0">Handcrafted Cinema & Cosplay Outfits</p>
              </div>

              <div className="p-6 space-y-3 bg-white">
                <h4 className="text-base font-extrabold text-slate-900 m-0">
                  {subject || 'Your Subject Preview Here'}
                </h4>

                <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-line py-2">
                  {message || 'Your message preview will appear here in real-time as you type...'}
                </div>

                <div className="text-center pt-3 pb-2">
                  <span className="inline-block bg-[#233b6e] text-white px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-xs">
                    Visit Velmoras Store <ArrowRight className="h-3.5 w-3.5 ml-1.5 inline-block" />
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 text-center text-[10px] text-gray-400">
                  You are receiving this update because you placed an order at Velmoras Creation.
                </div>
              </div>

              <div className="bg-gray-50 p-3 text-center border-t border-gray-100 text-[10px] text-gray-400">
                © {new Date().getFullYear()} Velmoras Creation • velmorascreation.com
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Broadcast Dispatch</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Are you sure you want to send this email to <strong>{activeRecipientsCount} purchasing customer(s)</strong> from <span className="font-mono text-gray-700">noreply@velmorascreation.com</span>?
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-900 hover:bg-accent text-white transition-colors"
              >
                {sending ? 'Sending...' : 'Yes, Send Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLetterbox;

