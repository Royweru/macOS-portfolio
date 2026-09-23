export default function BlissWallpaper97() {
  return (
    <div className="bliss97-wallpaper" aria-hidden="true">
      <div className="bliss97-sky" />
      <svg className="bliss97-clouds" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <g fill="#fff">
          <ellipse cx="780" cy="180" opacity=".85" rx="140" ry="45" />
          <ellipse cx="830" cy="160" opacity=".95" rx="100" ry="55" />
          <ellipse cx="730" cy="190" opacity=".75" rx="80" ry="35" />
          <ellipse cx="890" cy="200" opacity=".7" rx="90" ry="35" />
          <ellipse cx="640" cy="230" opacity=".6" rx="70" ry="25" />
          <ellipse cx="320" cy="160" opacity=".7" rx="55" ry="20" />
          <ellipse cx="345" cy="150" opacity=".8" rx="40" ry="24" />
          <ellipse cx="560" cy="210" opacity=".6" rx="60" ry="18" />
          <ellipse cx="140" cy="270" opacity=".5" rx="75" ry="16" />
          <ellipse cx="370" cy="300" opacity=".5" rx="90" ry="18" />
          <ellipse cx="700" cy="280" opacity=".6" rx="110" ry="22" />
          <ellipse cx="850" cy="315" opacity=".65" rx="80" ry="19" />
        </g>
      </svg>
      <div className="bliss97-hills">
        <svg viewBox="0 0 1200 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bliss97-hill-back" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4d9b23" />
              <stop offset="100%" stopColor="#245a13" />
            </linearGradient>
            <linearGradient id="bliss97-hill-front" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7ec842" />
              <stop offset="40%" stopColor="#55a525" />
              <stop offset="100%" stopColor="#26610c" />
            </linearGradient>
          </defs>
          <path d="M0,210 Q320,130 650,190 T1200,160 L1200,400 L0,400 Z" fill="url(#bliss97-hill-back)" opacity=".85" />
          <path d="M0,170 Q460,95 820,180 T1200,240 L1200,400 L0,400 Z" fill="url(#bliss97-hill-front)" />
          <path d="M0,172 Q460,97 820,182" fill="none" opacity=".6" stroke="#99e356" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
}
