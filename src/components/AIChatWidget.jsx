import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { chatApi, settingsApi } from '../api';

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi there! 👋 I am your AI sales assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [waNumber, setWaNumber] = useState('');
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    settingsApi.getPublic().then(s => {
      if (s && (s.whatsapp || s.phone)) {
        const raw = (s.whatsapp || s.phone || '').trim();
        setWaNumber(raw.replace(/[^\d]/g, ''));
      }
    }).catch(console.error);
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', text: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setText('');
    setLoading(true);

    try {
      const response = await chatApi.send({
        message: userMessage.text,
        history: messages
      });
      setMessages([...newMessages, { role: 'model', text: response.reply || 'Sorry, I am having trouble understanding right now.' }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'model', text: 'Oops! Something went wrong on my end. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div ref={panelRef} className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-[350px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-[fadeIn_.15s_ease-out] flex flex-col" style={{ height: '500px', maxHeight: '80vh' }}>
          {/* Header */}
          <div className="flex items-center gap-3 bg-indigo-600 px-4 py-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600">
              <Bot className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">AI Assistant</p>
              <p className="text-xs text-indigo-100">Online 24/7</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-5 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'}`}>
                  {msg.text.split('\\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-none bg-white px-4 py-2.5 text-sm text-gray-400 shadow-sm border border-gray-100 flex gap-1 items-center">
                  <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" />
                  <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about our products..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !text.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle buttons container */}
      <div className="flex items-center gap-3">
        {open && waNumber && (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-600/30 transition-all hover:scale-105 hover:shadow-xl animate-[fadeIn_.15s_ease-out]"
          >
            <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0 fill-current" aria-hidden="true">
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.048 9.38L1.05 31.3l6.128-1.96A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.318 22.598c-.386 1.09-1.92 1.994-3.142 2.258-.836.178-1.928.32-5.604-1.204-4.7-1.948-7.726-6.724-7.962-7.034-.226-.31-1.9-2.53-1.9-4.826 0-2.296 1.166-3.424 1.636-3.904.386-.394.844-.573 1.264-.573.136 0 .258.007.368.012.32.014.482.033.694.54.264.638.91 2.226.99 2.39.08.164.134.356.024.566-.104.216-.156.35-.31.538-.156.188-.328.42-.47.564-.156.156-.318.326-.137.638.18.31.804 1.326 1.726 2.148 1.19 1.06 2.19 1.39 2.542 1.536.264.11.578.086.79-.14.27-.29.6-.77.937-1.244.238-.34.54-.382.86-.262.326.114 2.06.972 2.414 1.148.354.176.588.262.674.408.086.15.086.85-.3 1.942z" />
            </svg>
          </a>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Chat with AI"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 hover:shadow-xl"
        >
          {open ? (
            <X className="h-7 w-7 shrink-0" />
          ) : (
            <Bot className="h-7 w-7 shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AIChatWidget;
