/* Title-screen illustration: a sun-knight facing Count Vexmor under a blood moon. */
export function HeroScene() {
  return (
    <svg
      viewBox="0 0 400 260"
      className="block h-auto w-full"
      role="img"
      aria-label="A sun knight faces Count Vexmor beneath a blood moon"
    >
      <defs>
        <linearGradient id="nf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#140728" />
          <stop offset="0.6" stopColor="#4a1238" />
          <stop offset="1" stopColor="#1a0712" />
        </linearGradient>
        <radialGradient id="nf-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fbbf24" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nf-moon" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="1" stopColor="#e0a050" />
        </radialGradient>
        <linearGradient id="nf-blade" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="nf-cape" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7f1d1d" />
          <stop offset="1" stopColor="#0c0712" />
        </linearGradient>
        <filter id="nf-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <rect width="400" height="260" fill="url(#nf-sky)" />
      <circle cx="200" cy="92" r="130" fill="url(#nf-halo)" />
      <circle cx="200" cy="92" r="34" fill="url(#nf-moon)" />

      <g fill="#fde68a" opacity="0.7">
        <circle cx="40" cy="30" r="1.2" />
        <circle cx="90" cy="60" r="1" />
        <circle cx="330" cy="36" r="1.3" />
        <circle cx="360" cy="80" r="1" />
        <circle cx="300" cy="18" r="1" />
        <circle cx="150" cy="22" r="1.1" />
      </g>

      <g fill="#2a0f22">
        <path d="M52 64q8-8 16 0q8-8 16 0q-8 3-16 8q-8-5-16-8z" />
        <path d="M268 52q6-6 12 0q6-6 12 0q-6 2-12 6q-6-4-12-6z" />
        <path d="M120 40q5-5 10 0q5-5 10 0q-5 2-10 5q-5-3-10-5z" />
      </g>

      <path
        d="M0 260V176H28V150H40V176H70V132H84V110H96V132H130V168H160V140H170V120H180V140H200V160H240V118H252V96H262V118H292V150H330V126H344V104H354V126H390V176H400V260Z"
        fill="#0b0512"
      />
      <ellipse cx="200" cy="236" rx="260" ry="22" fill="#9f1239" opacity="0.35" filter="url(#nf-blur)" />

      <line x1="128" y1="92" x2="268" y2="112" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" />

      {/* Sun knight */}
      <g transform="translate(110 178)">
        <path d="M-12 -92Q-34 -62 -26 -30L-8 -40Z" fill="#b45309" />
        <rect x="-8" y="-40" width="6" height="40" fill="#334155" />
        <rect x="2" y="-40" width="6" height="40" fill="#334155" />
        <path d="M-14 -40L-12 -92Q0 -102 12 -92L14 -40Z" fill="#475569" />
        <path d="M-14 -88Q0 -80 14 -88" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <circle cx="0" cy="-108" r="11" fill="#e2e8f0" />
        <path d="M-11 -111Q0 -124 11 -111Q4 -116 -11 -111Z" fill="#fbbf24" />
        <path d="M0 -119Q12 -128 16 -116Q6 -116 0 -113Z" fill="#f59e0b" />
        <path d="M-30 -84h12v18q-6 8-6 12q0-4-6-12z" fill="#f59e0b" />
        <line x1="10" y1="-86" x2="30" y2="-102" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="-102" x2="46" y2="-152" stroke="url(#nf-blade)" strokeWidth="4" strokeLinecap="round" />
        <line x1="24" y1="-106" x2="36" y2="-98" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="48" cy="-156" r="14" fill="#fde68a" opacity="0.35" />
      </g>

      {/* Count Vexmor */}
      <g transform="translate(290 178)">
        <path d="M-14 -100Q-48 -66-40 0H40Q48 -66 14 -100Z" fill="url(#nf-cape)" />
        <rect x="-7" y="-40" width="5" height="40" fill="#0c0712" />
        <rect x="2" y="-40" width="5" height="40" fill="#0c0712" />
        <path d="M-10 -40L-9 -96H9L10 -40Z" fill="#1e1024" />
        <path d="M-16 -98L-8 -124L0 -102L8 -124L16 -98Z" fill="#0c0712" />
        <ellipse cx="0" cy="-108" rx="9" ry="11" fill="#e2e8f0" />
        <path d="M-10 -116Q0 -128 10 -116L8 -118Q0 -124-8 -118Z" fill="#0c0712" />
        <circle cx="-3.5" cy="-109" r="1.8" fill="#f43f5e" />
        <circle cx="3.5" cy="-109" r="1.8" fill="#f43f5e" />
      </g>

      <circle cx="200" cy="130" r="18" fill="#fbbf24" opacity="0.12" />
    </svg>
  );
}
