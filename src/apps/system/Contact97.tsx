'use client';

import { useState } from 'react';
import Button95 from '../../components/win95/Button95';

const RECIPIENT = 'weruroy347@gmail.com';

export default function Contact97({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Message from Weru 97');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Ready');

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const encodedSubject = encodeURIComponent(subject.trim() || 'Message from Weru 97');
    const body = encodeURIComponent(`${message}\n\nFrom: ${name.trim() || 'Visitor'}\nReply to: ${email.trim() || 'not supplied'}`);
    window.location.href = `mailto:${RECIPIENT}?subject=${encodedSubject}&body=${body}`;
    setStatus('Opening your mail program…');
  };

  return <div className="win97-app win97-contact">
    <div className="win95-menubar"><button type="button">File</button><button type="button">Edit</button><button type="button">View</button><button type="button">Insert</button><button type="button">Message</button><button type="button">Help</button></div>
    <form onSubmit={submit}>
      <div className="win97-contact-header"><b>Outlook Express — New Message</b><span>Compose a message to Weru.</span></div>
      <div className="win97-mail-toolbar" role="toolbar" aria-label="Message commands"><Button95 size="sm" type="submit">Send</Button95><Button95 size="sm" type="button" disabled>Attach</Button95><Button95 size="sm" type="button" disabled>Address Book</Button95></div>
      <label>To<input value={RECIPIENT} readOnly aria-label="To" /></label>
      <label>From name<input value={name} onChange={event => setName(event.target.value)} /></label>
      <label>Reply address<input type="email" value={email} onChange={event => setEmail(event.target.value)} /></label>
      <label>Subject<input value={subject} onChange={event => setSubject(event.target.value)} required /></label>
      <label className="win97-mail-body-label">Message<textarea value={message} onChange={event => setMessage(event.target.value)} required /></label>
      <div className="win97-dialog-actions"><span className="win97-contact-status" aria-live="polite">{status}</span><Button95 size="sm" type="button" onClick={onClose}>Cancel</Button95><Button95 size="sm" type="submit">Send</Button95></div>
    </form>
  </div>;
}
