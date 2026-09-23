'use client';

import { useState } from 'react';
import Button95 from '../../components/win95/Button95';

export default function Contact97({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Ready');

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Weru 97 message from ${name || 'visitor'}`);
    const body = encodeURIComponent(`${message}\n\nReply to: ${email || 'not supplied'}`);
    window.location.href = `mailto:hello@weru.dev?subject=${subject}&body=${body}`;
    setStatus('Opening your mail program…');
  };

  return <div className="win97-app win97-contact">
    <div className="win95-menubar"><button type="button">File</button><button type="button">Edit</button><button type="button">View</button><button type="button">Help</button></div>
    <form onSubmit={submit}>
      <div className="win97-contact-header"><b>Contact Weru</b><span>Compose a message in the classic portfolio mail client.</span></div>
      <label>From name<input value={name} onChange={event => setName(event.target.value)} /></label>
      <label>Reply address<input type="email" value={email} onChange={event => setEmail(event.target.value)} /></label>
      <label>Message<textarea value={message} onChange={event => setMessage(event.target.value)} required /></label>
      <div className="win97-dialog-actions"><span className="win97-contact-status" aria-live="polite">{status}</span><Button95 size="sm" type="button" onClick={onClose}>Cancel</Button95><Button95 size="sm" type="submit">Send</Button95></div>
    </form>
  </div>;
}
