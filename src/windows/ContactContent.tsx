import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Trash2 } from 'lucide-react';

const ContactContent: React.FC = () => {
  const [name, setName]       = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!name || !message) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1400);
  };

  const handleReset = () => {
    setName(''); setSubject(''); setMessage(''); setSent(false);
  };



  return (
    <div className="flex flex-col h-full">
      {/* Mail toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-black/6 bg-white/40 shrink-0">
        <button
          onClick={handleSend}
          disabled={sending || sent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#26C6DA,#00838F)' }}
        >
          {sending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Send size={12} />
          )}
          {sending ? 'Sending…' : 'Send'}
        </button>
        <button className="p-1.5 rounded-lg hover:bg-black/6 opacity-50">
          <Paperclip size={14} />
        </button>
        <button onClick={handleReset} className="p-1.5 rounded-lg hover:bg-black/6 opacity-50">
          <Trash2 size={14} />
        </button>
        <div className="ml-auto text-[11px] text-gray-400">To: weru.dev@gmail.com</div>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg,#26C6DA,#00838F)' }}
            >
              ✉️
            </motion.div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-gray-800">Message sent!</p>
              <p className="text-[12px] text-gray-500 mt-1">Thanks {name}, I'll get back to you soon.</p>
            </div>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2 rounded-lg text-[12px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col px-5 py-3 gap-1"
            style={{ userSelect: 'text' }}
          >
            {/* From */}
            <div className="flex items-center gap-3 py-2 border-b border-black/6">
              <span className="text-[12px] text-gray-400 w-16 shrink-0">From</span>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder-gray-400"
                style={{ userSelect: 'text' }}
              />
            </div>

            {/* To */}
            <div className="flex items-center gap-3 py-2 border-b border-black/6">
              <span className="text-[12px] text-gray-400 w-16 shrink-0">To</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="px-2 py-0.5 rounded-md text-[12px] font-medium text-white"
                  style={{ background: '#0066cc' }}
                >
                  Weru
                </span>
                <span className="text-[12px] text-gray-400">weru.dev@gmail.com</span>
              </span>
            </div>

            {/* Subject */}
            <div className="flex items-center gap-3 py-2 border-b border-black/6">
              <span className="text-[12px] text-gray-400 w-16 shrink-0">Subject</span>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="What's this about?"
                className="flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder-gray-400"
                style={{ userSelect: 'text' }}
              />
            </div>

            {/* Body */}
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your message here…"
              className="flex-1 mt-2 bg-transparent text-[13px] text-gray-700 outline-none resize-none placeholder-gray-400 leading-relaxed"
              style={{ userSelect: 'text', minHeight: 140 }}
            />

            {/* Social links at bottom */}
            <div className="pt-3 border-t border-black/5 flex items-center gap-4 shrink-0">
              <span className="text-[11px] text-gray-400">Also find me on:</span>
              {[
                { label: 'GitHub',   href: 'https://github.com/weru',         color: '#1a1a1a' },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/weru',    color: '#0A66C2' },
                { label: 'Twitter',  href: 'https://twitter.com/weru',        color: '#1DA1F2' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11.5px] font-medium hover:underline"
                  style={{ color: link.color }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactContent;
