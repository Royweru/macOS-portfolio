'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface MobileDisplayGate97Props {
  /** Optional custom portfolio URL to copy (defaults to window.location.origin) */
  portfolioUrl?: string;
  /** Optional callback when user acknowledges notice via [X] */
  onAcknowledge?: () => void;
}

export const RESUME_TEXT_CONTENT = `Roy Weru - Full-Stack Software Engineer & Creative Developer
Location: Nairobi, Kenya
Contact: royezi17@gmail.com
GitHub: https://github.com/Royweru
LinkedIn: https://linkedin.com/in/royweru

Professional Summary:
Full-stack software engineer and creative technologist specializing in
high-performance web architecture, retro computing simulations, and
interactive user experiences.

Core Expertise:
- Architecture: React, Next.js, TypeScript, Node.js, Python, PostgreSQL, IndexedDB
- Creative Tech: WebGL, Three.js, Canvas 2D, Web Audio API, CRT Shader Effects
- Systems & UI: Design Systems, Virtual File Systems, State Machines, Responsive Layouts

Portfolio:
Weru 97 (https://weru97.live) — Full interactive Windows 95 OSR 2.5 simulation.
`;

export default function MobileDisplayGate97({
  portfolioUrl,
  onAcknowledge,
}: MobileDisplayGate97Props) {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 375,
    height: typeof window !== 'undefined' ? window.innerHeight : 667,
  });
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const copyTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const handleCopyLink = async () => {
    const url =
      portfolioUrl ||
      (typeof window !== 'undefined'
        ? window.location.origin || window.location.href || 'https://weru97.live'
        : 'https://weru97.live');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch (err) {
      console.warn('Clipboard write unsuccessful:', err);
    }

    setCopied(true);
    showToast(`Copied: ${url}`);

    if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleClose = () => {
    showToast('Notice acknowledged. System halted.');
    if (onAcknowledge) onAcknowledge();
  };

  const handleDownloadResume = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const blob = new Blob([RESUME_TEXT_CONTENT], { type: 'text/plain;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = 'Resume_Roy_Weru.txt';
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(blobUrl);
      showToast('Downloading Resume_Roy_Weru.txt...');
    } catch (err) {
      console.warn('Resume download error:', err);
      showToast('Error generating Resume download.');
    }
  };

  return (
    <>
      {/* CRT Scanline Overlay Texture */}
      <div className="mobile-gate-crt" aria-hidden="true" />

      {/* Main Viewport Container */}
      <aside
        className="weru-mobile-gate"
        role="complementary"
        aria-label="Hardware Requirements Gate"
      >
        <section
          aria-labelledby="mobile-gate-title"
          className="mobile-gate-window"
          role="dialog"
        >
          {/* System Toast Notification */}
          {toastMessage && (
            <div className="mobile-gate-toast" role="status">
              {toastMessage}
            </div>
          )}

          {/* Active Windows 95 Titlebar */}
          <header className="mobile-gate-titlebar">
            <div className="mobile-gate-titlebar-left">
              {/* 16x16 Pixel CRT Monitor SVG */}
              <svg
                aria-hidden="true"
                className="mobile-gate-title-icon"
                fill="none"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect fill="#d4d0c8" height="11" stroke="#000000" strokeWidth="1" width="14" x="1" y="1" />
                <rect fill="#000080" height="7" width="10" x="3" y="3" />
                <rect fill="#1084d0" height="2" width="2" x="4" y="4" />
                <rect fill="#808080" height="2" width="2" x="7" y="12" />
                <rect fill="#000000" height="1" width="8" x="4" y="14" />
                <rect fill="#00ff00" height="1" width="1" x="11" y="9" />
              </svg>
              <span className="mobile-gate-title-text">
                Weru 97 — Hardware Requirements Notice
              </span>
            </div>
            <button
              aria-label="Close Notice"
              className="mobile-gate-close-btn"
              onClick={handleClose}
              title="Close"
              type="button"
            >
              ✕
            </button>
          </header>

          {/* Dialog Body Content */}
          <div className="mobile-gate-body">
            {/* Notice Header with Pixel Warning Triangle */}
            <div className="mobile-gate-notice-header">
              <div className="mobile-gate-alert-icon-box">
                {/* 32x32 Pixel Art Warning Triangle */}
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="32"
                  viewBox="0 0 32 32"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon
                    fill="#ffff00"
                    points="16,2 31,29 1,29"
                    stroke="#000000"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <polygon fill="#ffff00" points="16,5 28,27 4,27" />
                  <line stroke="#d4c000" strokeWidth="2" x1="16" x2="28" y1="6" y2="27" />
                  <rect fill="#000000" height="10" width="4" x="14" y="10" />
                  <rect fill="#000000" height="3" width="4" x="14" y="22" />
                </svg>
              </div>

              <div className="mobile-gate-header-content">
                <h1 className="mobile-gate-dialog-title" id="mobile-gate-title">
                  Workstation Display Required
                </h1>
                <p className="mobile-gate-dialog-desc">
                  Weru 97 is a fully interactive desktop operating system
                  simulating Windows 95 OSR 2.5, featuring multi-window
                  multitasking, a virtual file system, and retro multimedia
                  applications.
                </p>
                <p className="mobile-gate-dialog-desc secondary">
                  This workstation requires a mouse, keyboard, and a display
                  resolution of at least 800×600 SVGA. Handheld mobile screens
                  are not supported.
                </p>
              </div>
            </div>

            {/* Recessed Sunken Diagnostic Report Box */}
            <div
              aria-label="System Diagnostic Report"
              className="mobile-gate-diagnostic"
            >
              ----------------------------------------{'\n'}
              <span className="mobile-gate-diagnostic-header">
                [ SYSTEM DIAGNOSTIC REPORT ]
              </span>{'\n'}
              Architecture:    x86 Workstation{'\n'}
              Target OS:       Microsoft Windows 97 OSR 2.5{'\n'}
              Detected Screen: {dimensions.width} x {dimensions.height} (Mobile Viewport){'\n'}
              Required Screen: 800 x 600 SVGA or larger{'\n'}
              Input Device:    Touch Screen (No Mouse){'\n'}
              Status:          <span className="mobile-gate-diagnostic-alert">HALTED: Incompatible Display</span>{'\n'}
              ----------------------------------------
            </div>

            {/* Windows 95 Action Button */}
            <div className="mobile-gate-action-row">
              <button
                className={`mobile-gate-btn ${copied ? 'clicked' : ''}`}
                onClick={handleCopyLink}
                type="button"
              >
                {/* 12x12 Pixel Link Icon */}
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="12"
                  viewBox="0 0 12 12"
                  width="12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect fill="#000000" height="4" width="4" x="1" y="4" />
                  <rect fill="#c0c0c0" height="2" width="2" x="2" y="5" />
                  <rect fill="#000000" height="4" width="4" x="7" y="4" />
                  <rect fill="#c0c0c0" height="2" width="2" x="8" y="5" />
                  <rect fill="#000000" height="2" width="4" x="4" y="5" />
                </svg>
                <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Portfolio Link'}</span>
              </button>
            </div>

            {/* Retro Fieldset: Executive Summary & Contact */}
            <fieldset className="mobile-gate-fieldset">
              <legend className="mobile-gate-legend">
                Executive Summary &amp; Contact
              </legend>
              <p className="mobile-gate-profile-line">
                <strong>Roy Weru</strong> — Full-Stack Software Engineer &amp; Creative Developer
              </p>
              <p className="mobile-gate-profile-line sub">
                Location: Nairobi, Kenya
              </p>
              <div className="mobile-gate-links-grid">
                <a
                  className="mobile-gate-link"
                  href="https://github.com/Royweru"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="mobile-gate-bullet" aria-hidden="true">▸</span>GitHub: Royweru
                </a>
                <a
                  className="mobile-gate-link"
                  href="https://linkedin.com/in/royweru"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="mobile-gate-bullet" aria-hidden="true">▸</span>LinkedIn: royweru
                </a>
                <a
                  className="mobile-gate-link"
                  href="mailto:royezi17@gmail.com"
                >
                  <span className="mobile-gate-bullet" aria-hidden="true">▸</span>Email: royezi17@gmail.com
                </a>
                <button
                  className="mobile-gate-link"
                  onClick={handleDownloadResume}
                  type="button"
                >
                  <span className="mobile-gate-bullet" aria-hidden="true">▸</span>Download Resume.txt
                </button>
              </div>
            </fieldset>
          </div>

          {/* Dialog Status Bar */}
          <footer className="mobile-gate-statusbar">
            <div className="mobile-gate-statuspane left">
              <span>Error 0x7E: Screen resolution below minimum threshold</span>
            </div>
            <div className="mobile-gate-statuspane right">
              <span>Weru 97</span>
            </div>
          </footer>
        </section>
      </aside>
    </>
  );
}
