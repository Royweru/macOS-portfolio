export default function DesktopIconArt97({ iconId }: { iconId: string }) {
  const common = { width: 40, height: 40, viewBox: '0 0 32 32', 'aria-hidden': true as const };

  if (iconId === 'shortcut-my-computer') return <svg {...common}>
    <rect x="3" y="2" width="26" height="20" fill="#d4d0c8" stroke="#808080" />
    <rect x="5" y="4" width="22" height="15" fill="#000080" />
    <rect x="7" y="6" width="18" height="11" fill="#1084d0" />
    <path d="M10 8h4v3h-4zm5 0h4v3h-4zm-5 4h4v3h-4zm5 0h4v3h-4z" fill="#f0c020" />
    <path d="M10 8h4v3h-4z" fill="#e04040" /><path d="M15 8h4v3h-4z" fill="#40a040" /><path d="M10 12h4v3h-4z" fill="#3060d0" />
    <rect x="12" y="22" width="8" height="3" fill="#808080" />
    <rect x="8" y="25" width="16" height="2" fill="#d4d0c8" stroke="#404040" strokeWidth=".5" />
    <rect x="20" y="23" width="3" height="1" fill="#404040" />
  </svg>;

  if (iconId === 'shortcut-my-documents') return <svg {...common}>
    <polygon points="2,8 12,8 14,11 28,11 28,26 2,26" fill="#f0be28" stroke="#806000" />
    <rect x="6" y="7" width="18" height="14" fill="#fff" stroke="#c0c0c0" strokeWidth=".5" />
    <path d="M9 10h11M9 13h9" stroke="#808080" />
    <polygon points="1,12 27,12 30,27 4,27" fill="#fbd84e" stroke="#806000" />
  </svg>;

  if (iconId === 'shortcut-projects') return <svg {...common}>
    <polygon points="2,8 12,8 14,11 28,11 28,26 2,26" fill="#4fa3d1" stroke="#1d4860" />
    <polygon points="1,12 27,12 30,27 4,27" fill="#6bc2f0" stroke="#1d4860" />
    <text x="11" y="22" fill="#003366" fontFamily="monospace" fontSize="9" fontWeight="bold">&lt;&gt;</text>
  </svg>;

  if (iconId === 'shortcut-videos') return <svg {...common}>
    <rect x="2" y="6" width="28" height="20" fill="#333" stroke="#000" />
    <circle cx="9" cy="16" r="5" fill="#c0c0c0" stroke="#808080" /><circle cx="23" cy="16" r="5" fill="#c0c0c0" stroke="#808080" />
    <rect x="7" y="9" width="18" height="4" fill="#fff" /><rect x="7" y="19" width="18" height="3" fill="#fff" />
    <circle cx="9" cy="16" r="2" /><circle cx="23" cy="16" r="2" />
  </svg>;

  if (iconId === 'shortcut-music') return <svg {...common}>
    <circle cx="15" cy="16" r="13" fill="#dcdcdc" stroke="#707070" />
    <path d="M15 3a13 13 0 0 1 11 7l-7 3a5 5 0 0 0-4-2zm0 26A13 13 0 0 1 4 22l7-3a5 5 0 0 0 4 2z" fill="#78d5e3" opacity=".6" />
    <path d="M15 29A13 13 0 0 1 4 22l7-3a5 5 0 0 0 4 2z" fill="#ec72a8" opacity=".6" />
    <circle cx="15" cy="16" r="4.5" fill="#f0f0f0" stroke="#808080" /><circle cx="15" cy="16" r="2" fill="#2d6896" />
    <path d="M21 6l5-2v10a2 2 0 1 1-3-2V8l-2 1z" fill="#000080" />
  </svg>;

  if (iconId === 'shortcut-my-pictures') return <svg {...common}>
    <rect x="3" y="4" width="26" height="22" fill="#e0cfab" stroke="#6b5020" />
    <rect x="5" y="6" width="22" height="18" fill="#58a0e8" />
    <circle cx="10" cy="11" r="3" fill="#fbe049" />
    <polygon points="5,24 13,14 18,20 22,15 27,24" fill="#328e34" />
    <polygon points="12,15 13,14 15,17" fill="#fff" />
  </svg>;

  if (iconId === 'shortcut-internet') return <svg {...common}>
    <ellipse cx="16" cy="15" rx="14" ry="7" fill="none" stroke="#e0c030" strokeWidth="2" transform="rotate(-30 16 15)" />
    <path d="M18 6C10 6 7 12 7 16c0 6 5 10 14 10 4 0 6-2 7-4h-6c-2 1-6 1-8-1s-2-4 12-4c0-4-1-11-8-11zm-5 7c1-3 3-4 5-4s3 1 3 4z" fill="#06c" />
    <path d="M5 22q9 7 22-12" fill="none" stroke="#fcd836" strokeWidth="2.2" />
  </svg>;

  if (iconId === 'shortcut-games') return <svg {...common}>
    <rect x="3" y="10" width="26" height="14" rx="4" fill="#c0c0c0" stroke="#404040" />
    <path d="M7 15h8m-4-4v8" stroke="#000" strokeWidth="3" />
    <circle cx="21" cy="17" r="2" fill="#d92525" /><circle cx="25" cy="14" r="2" fill="#2d68c4" />
  </svg>;

  if (iconId === 'shortcut-recycle-bin') return <svg {...common}>
    <polygon points="6,9 26,9 23,29 9,29" fill="#e8e8e8" stroke="#707070" />
    <ellipse cx="16" cy="9" rx="10" ry="2.5" fill="#b0b0b0" stroke="#707070" />
    <path d="M13 16l4-3v2h3l-2 4h-2v-2h-3zm0 5l3 3h-2l1 2-3-1 1-3z" fill="#2e8b2e" />
  </svg>;

  if (iconId === 'shortcut-outlook-express') return <svg {...common}>
    <path d="M4 7h25v19H4z" fill="#101010" />
    <path d="M3 6h24v18H3z" fill="#d4d0c8" stroke="#404040" />
    <path d="M5 8h20v14H5z" fill="#fff" />
    <path d="M5 9l10 8 10-8" fill="none" stroke="#000080" strokeWidth="2" />
    <path d="M5 21l7-6m13 6l-7-6" fill="none" stroke="#808080" strokeWidth="1.5" />
    <path d="M4 7h22" stroke="#fff" strokeWidth="1" />
  </svg>;

  return null;
}
