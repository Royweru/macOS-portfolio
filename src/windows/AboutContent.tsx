import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Coffee, Zap } from 'lucide-react';

const stack = [
  { label: 'Python',     color: '#3776AB' },
  { label: 'JavaScript', color: '#F7DF1E', text: '#333' },
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'React',      color: '#61DAFB', text: '#333' },
  { label: 'Next.js',    color: '#000' },
  { label: 'FastAPI',    color: '#009688' },
  { label: 'LangGraph',  color: '#7C3AED' },
  { label: 'Claude API', color: '#D97706' },
  { label: 'Supabase',   color: '#3ECF8E', text: '#333' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Docker',     color: '#2496ED' },
  { label: 'Pinecone',   color: '#1C1C1C' },
];

const facts = [
  { icon: <MapPin size={13}/>, text: 'Nairobi, Kenya 🇰🇪' },
  { icon: <Coffee size={13}/>, text: 'Powered by coffee & curiosity' },
  { icon: <Zap size={13}/>,    text: 'Building practical automation tools' },
];

const AboutContent: React.FC = () => {
  const profileCandidates = ['/profile.png', '/profile.jpg', '/profile.jpeg', '/profile.webp', '/profile'];
  const [profileSrcIndex, setProfileSrcIndex] = useState(0);
  const [profileSrc, setProfileSrc] = useState(profileCandidates[0]);

  const handleProfileError = () => {
    const next = profileSrcIndex + 1;
    if (next < profileCandidates.length) {
      setProfileSrcIndex(next);
      setProfileSrc(profileCandidates[next]);
    } else {
      // No image found — fallback to emoji avatar
      setProfileSrc('');
    }
  };
  return (
    <div className="window-content px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-5"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md bg-gray-100">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt="Weru"
                className="w-full h-full object-cover"
                onError={handleProfileError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                👨‍💻
              </div>
            )}
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white"
            title="Available for work"
          />
        </div>

        {/* Name + title */}
        <div>
          <h1 className="text-[22px] font-bold text-gray-800 tracking-tight">Weru</h1>
          <p className="text-[13px] text-blue-600 font-medium">Software Engineer · Automation Systems Developer</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {facts.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11.5px] text-gray-500">
                <span className="text-gray-400">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">About</h2>
        <div
          className="rounded-xl p-4 text-[13px] text-gray-700 leading-relaxed"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          <p>
            I am a software engineer focused on automation systems, backend services, and product-quality frontends.
            Well my favorite hobby includes taking walks and 🎱 q-balls(pool).
            I also enjoy mentoring junior developers and sharing knowledge through tech talks and my youtube channel.
            I also happen to like linux a lot and I'm still learning about the kernel and how operating systems work everyday.
            The only thing that keeps me going is that everyday I can learn something new and interesting in this field of technology.  
            Most of my recent work involves agent workflows, API integrations, and internal tools that teams use daily.
          </p>
          <p className="mt-2">
            Based in Nairobi, I work across product and engineering to ship reliable features with clear user value,
            from the first prototype through production rollout.
          </p>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {stack.map((s, i) => (
            <motion.span
              key={s.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.03 }}
              className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium text-white"
              style={{ background: s.color, color: s.text ?? 'white' }}
            >
              {s.label}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { value: '5+',  label: 'Years coding' },
          { value: '20+', label: 'Projects shipped' },
          { value: '∞',   label: 'Coffee consumed' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <p className="text-[22px] font-bold text-gray-800">{stat.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AboutContent;
