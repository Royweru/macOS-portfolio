'use client';

import { useEffect, useState } from 'react';

export default function Clock95() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setTime(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  return <time className="win95-clock" dateTime={time.toISOString()}>{time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>;
}
