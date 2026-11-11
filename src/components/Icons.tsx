import type { ReactNode } from 'react';
import type { IconName } from '../game/types';

/* Stylized line-icon set drawn on a 24px grid. Every glyph is pure SVG, no emoji. */
const PATHS: Record<IconName, ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity={0.2} />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
  shade: (
    <>
      <path
        d="M12 10C9 6 5 5 2 7c1 2 1 4 2 5 2-1 4 0 6 2l2 1 2-1c2-2 4-3 6-2 1-1 1-3 2-5-3-2-7-1-10 3z"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <path d="M10.5 14.5 12 21l1.5-6.5" />
    </>
  ),
  boss: (
    <>
      <path d="M3.5 17.5 4.5 8 9 12l3-6.5L15 12l4.5-4 1 9.5z" fill="currentColor" fillOpacity={0.2} />
      <path d="M3.5 20.5h17" />
      <path d="M8 17.5l1 2.5 1-2.5M14 17.5l1 2.5 1-2.5" />
    </>
  ),
  blade: (
    <>
      <path d="M18 3l3 3-9.5 11.5-3-3z" fill="currentColor" fillOpacity={0.2} />
      <path d="M5 13l6 6" />
      <path d="M3.5 20.5 6 18" />
    </>
  ),
  swipe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 15.5c2-3.5 4-5.5 8.5-7" />
      <path d="M13.5 7.5l2.6.8-.8 2.6" />
    </>
  ),
  merge: (
    <>
      <path d="M3.5 6.5 9 12M3.5 17.5 9 12M9 12h5.5" />
      <path d="M12.5 9.5 15.5 12l-3 2.5" />
      <circle cx="19.5" cy="12" r="2.5" fill="currentColor" fillOpacity={0.25} />
    </>
  ),
  bump: (
    <path
      d="M12 2l2 7 7-2-4 5 4 5-7-2-2 7-2-7-7 2 4-5-4-5 7 2z"
      fill="currentColor"
      fillOpacity={0.2}
    />
  ),
  burst: (
    <>
      <circle cx="12" cy="12" r="8" strokeDasharray="2 3" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" fillOpacity={0.3} />
    </>
  ),
  xp: (
    <>
      <path d="M12 2.5l6.5 7.5L12 21.5 5.5 10z" fill="currentColor" fillOpacity={0.2} />
      <path d="M5.5 10h13M9.5 10l2.5-7.5 2.5 7.5" />
    </>
  ),
  star: (
    <path
      d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5l-5.4 3 1.2-6-4.5-4.2 6.1-.7z"
      fill="currentColor"
      fillOpacity={0.2}
    />
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity={0.2} />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity={0.15} />
      <path d="M7.5 12.5l3 3 6-6.5" />
    </>
  ),
  castle: (
    <>
      <path d="M4 21V10h3V6.5h2.5V10h5V6.5H17V10h3v11z" fill="currentColor" fillOpacity={0.2} />
      <path d="M10 21v-4.5h4V21" />
    </>
  ),
  moon: <path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.3 6.3 0 0 0 10 10z" fill="currentColor" fillOpacity={0.2} />,
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" fill="currentColor" fillOpacity={0.15} />
      <path d="M4 20.5V5.5M8.5 7.5h8M8.5 11h8" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.6 2.6 0 1 1 3.7 2.4c-.7.3-1.2.9-1.2 1.7v.4" />
      <circle cx="12" cy="17.2" r=".7" fill="currentColor" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
  replay: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 4.5v4.5H9" />
    </>
  ),
  shield: <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z" fill="currentColor" fillOpacity={0.2} />,
  wing: (
    <path
      d="M3 17c3.5-.6 6-3 7.5-7.5C12 13 15 15.5 21 15c-2.5 2.8-5.2 3.5-8.5 3.2.3 1.2.1 2.3-.6 3.3-1.2-.8-2.8-2.2-4.4-2.6A10 10 0 0 1 3 17z"
      fill="currentColor"
      fillOpacity={0.2}
    />
  ),
  twin: (
    <>
      <circle cx="8.5" cy="12" r="4.5" fill="currentColor" fillOpacity={0.2} />
      <circle cx="15.5" cy="12" r="4.5" fill="currentColor" fillOpacity={0.2} />
    </>
  ),
  flame: (
    <path
      d="M12 3c.8 3.2 4.5 5.3 4.5 9.7a4.5 4.5 0 0 1-9 0c0-2.2 1-3.6 2.2-4.6.1 1.7.8 2.8 1.9 3.2-.4-3.1.2-6.1.4-8.3z"
      fill="currentColor"
      fillOpacity={0.25}
    />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r=".9" fill="currentColor" />
    </>
  ),
  arrow: <path d="M12 3.5l7 8.5h-4.2v8.5H9.2V12H5z" fill="currentColor" fillOpacity={0.25} />,
  drop: <path d="M12 3c3.2 4.3 5.5 7.4 5.5 10.6a5.5 5.5 0 0 1-11 0C6.5 10.4 8.8 7.3 12 3z" fill="currentColor" fillOpacity={0.2} />,
  sound: (
    <>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" fillOpacity={0.2} />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" fillOpacity={0.2} />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </>
  ),
  heart: (
    <path
      d="M12 20s-7.5-4.6-7.5-10a4.2 4.2 0 0 1 7.5-2.6A4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"
      fill="currentColor"
      fillOpacity={0.25}
    />
  ),
  steps: (
    <>
      <ellipse cx="8.5" cy="16" rx="2.8" ry="4.3" fill="currentColor" fillOpacity={0.2} />
      <ellipse cx="16" cy="7.5" rx="2.4" ry="3.8" fill="currentColor" fillOpacity={0.2} />
    </>
  ),
  skull: (
    <>
      <path
        d="M12 3.5c-4 0-7 2.9-7 6.8 0 2.4 1.2 4 2.8 4.9V18h8.4v-2.8c1.6-.9 2.8-2.5 2.8-4.9 0-3.9-3-6.8-7-6.8z"
        fill="currentColor"
        fillOpacity={0.2}
      />
      <circle cx="9.3" cy="11" r="1.5" fill="currentColor" />
      <circle cx="14.7" cy="11" r="1.5" fill="currentColor" />
      <path d="M10.5 18v2.5M13.5 18v2.5" />
    </>
  ),
};

export function Icon({
  name,
  className = 'h-6 w-6',
  rotate = 0,
}: {
  name: IconName;
  className?: string;
  rotate?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {PATHS[name]}
    </svg>
  );
}
