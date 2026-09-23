import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { settingsApi } from '../api';

// Floating WhatsApp widget — opens a chat panel on the same page.
// User types a message, hits "Start Chat", and WhatsApp opens pre-filled.
const WhatsAppButton = () => {
  const [number, setNumber] = useState('');
  const [company, setCompany] = useState('Support');
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    let alive = true;
    settingsApi
      .getPublic()
      .then((s) => {
        if (!alive || !s) return;
        const raw = (s.whatsapp || s.phone || '').trim();
        setNumber(raw.replace(/[^\d]/g, '')); // wa.me needs digits only
        if (s.company_name) setCompany(s.company_name);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
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

  if (!number) return null;

  const startChat = () => {
    const msg = text.trim() || 'Hi! I have a question.';
    const currentUrl = window.location.href;
    const finalMsg = `${msg}\n\nPage: ${currentUrl}`;
    const href = `https://wa.me/${number}?text=${encodeURIComponent(finalMsg)}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      startChat();
    }
  };

  return (
    <div ref={panelRef} className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-[320px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-[fadeIn_.15s_ease-out]">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{company}</p>
              <p className="text-xs text-white/70">Typically replies within minutes</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="bg-[#e5ddd5] px-4 py-5" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
            <div className="relative max-w-[85%] rounded-lg rounded-tl-none bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
              Hi there! 👋 <br />
              How can we help you today?
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-2.5">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-gray-200 px-3.5 py-2 text-sm outline-none focus:border-[#25D366]"
            />
            <button
              onClick={startChat}
              aria-label="Start chat on WhatsApp"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-600/30 transition-all hover:scale-105 hover:shadow-xl"
      >
        {open ? (
          <X className="h-7 w-7 shrink-0" />
        ) : (
          <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0 fill-current" aria-hidden="true">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.048 9.38L1.05 31.3l6.128-1.96A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.318 22.598c-.386 1.09-1.92 1.994-3.142 2.258-.836.178-1.928.32-5.604-1.204-4.7-1.948-7.726-6.724-7.962-7.034-.226-.31-1.9-2.53-1.9-4.826 0-2.296 1.166-3.424 1.636-3.904.386-.394.844-.573 1.264-.573.136 0 .258.007.368.012.32.014.482.033.694.54.264.638.91 2.226.99 2.39.08.164.134.356.024.566-.104.216-.156.35-.31.538-.156.188-.328.42-.47.564-.156.156-.318.326-.137.638.18.31.804 1.326 1.726 2.148 1.19 1.06 2.19 1.39 2.542 1.536.264.11.578.086.79-.14.27-.29.6-.77.937-1.244.238-.34.54-.382.86-.262.326.114 2.06.972 2.414 1.148.354.176.588.262.674.408.086.15.086.85-.3 1.942z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;
