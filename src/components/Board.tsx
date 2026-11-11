import { useRef, type CSSProperties, type ReactNode } from 'react';
import type { Cell, Dir, Events } from '../game/types';
import { Icon } from './Icons';

const SLOTS = Array.from({ length: 16 }, (_, i) => i);
const SPARKS: [number, number][] = [
  [0, -30],
  [21, -21],
  [30, 0],
  [21, 21],
  [0, 30],
  [-21, 21],
  [-30, 0],
  [-21, -21],
];

/* Sun palette by power tier. Linear scan over 10 entries = constant time. */
const SUN_TIERS: [number, string, string][] = [
  [2, '#fef9c3', '#f59e0b'],
  [4, '#fde68a', '#d97706'],
  [8, '#fdba74', '#c2410c'],
  [16, '#fca5a5', '#b91c1c'],
  [32, '#f9a8d4', '#be185d'],
  [64, '#d8b4fe', '#7e22ce'],
  [128, '#a5f3fc', '#0e7490'],
  [256, '#bbf7d0', '#047857'],
  [512, '#e0e7ff', '#4338ca'],
  [1024, '#fff7ed', '#ea580c'],
];

function sunColors(v: number): [string, string] {
  for (const t of SUN_TIERS) {
    if (v <= t[0]) return [t[1], t[2]];
  }
  return ['#ffffff', '#f97316'];
}

/** Grid index -> position. Translate percentages are relative to the element's own size. */
function cellStyle(i: number): CSSProperties {
  return { transform: `translate(${(i & 3) * 100}%, ${(i >> 2) * 100}%)` };
}

function SunTile({ v }: { v: number }) {
  const [a, b] = sunColors(v);
  const size = v < 100 ? 'text-3xl' : v < 1000 ? 'text-2xl' : 'text-xl';
  return (
    <div
      className="sun-core relative h-full w-full"
      style={{
        background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${a} 30%, ${b} 100%)`,
        boxShadow: `0 0 20px ${a}aa, inset 0 -5px 10px rgba(0,0,0,.25)`,
      }}
    >
      <Icon name="sun" className="rays text-amber-900/40" />
      <div className="absolute inset-0 grid place-items-center">
        <span className={`font-display font-black text-stone-900 ${size}`} style={{ textShadow: '0 1px 0 rgba(255,255,255,.6)' }}>
          {v}
        </span>
      </div>
    </div>
  );
}

function ShadeTile({ hp, max, boss }: { hp: number; max: number; boss: boolean }) {
  const pct = Math.max(0, Math.min(100, ((hp * 100) / max) | 0));
  return (
    <div
      className={`shade-body relative h-full w-full ${boss ? 'glow-boss' : ''}`}
      style={{
        background: boss
          ? 'linear-gradient(160deg,#4c0519,#9f1239 55%,#1c0a14)'
          : 'linear-gradient(160deg,#2e1065,#581c87 50%,#1e1b4b)',
        boxShadow: boss ? undefined : 'inset 0 0 0 1px rgba(244,114,182,.25)',
      }}
    >
      <Icon name={boss ? 'boss' : 'shade'} className="absolute left-[16%] top-[18%] h-[66%] w-[66%] text-rose-200/30" />
      <div className="absolute inset-0 grid place-items-center pb-[6%]">
        <span className={`font-display font-black text-rose-50 ${boss ? 'text-2xl' : 'text-xl'}`} style={{ textShadow: '0 1px 4px #000' }}>
          {hp}
        </span>
      </div>
      <div className="absolute bottom-[9%] left-[14%] right-[14%] h-[7%] overflow-hidden rounded-full bg-black/55">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#fb7185,#ef4444)', transition: 'width 200ms ease' }}
        />
      </div>
      {boss && (
        <span className="absolute left-0 right-0 top-[8%] text-center text-[8px] font-bold tracking-[0.3em] text-rose-200">
          HERALD
        </span>
      )}
    </div>
  );
}

function Fx({ events, turn }: { events: Events; turn: number }) {
  const items: ReactNode[] = [];
  events.merges.forEach((i, k) =>
    items.push(
      <div key={`m${turn}-${k}`} className="fx-cell" style={cellStyle(i)}>
        <div className="fx-ring" />
      </div>,
    ),
  );
  events.bumps.forEach((i, k) =>
    items.push(
      <div key={`b${turn}-${k}`} className="fx-cell" style={cellStyle(i)}>
        <Icon name="bump" className="fx-pop text-amber-200" />
      </div>,
    ),
  );
  events.kills.forEach((i, k) =>
    items.push(
      <div key={`k${turn}-${k}`} className="fx-cell" style={cellStyle(i)}>
        {SPARKS.map((s, j) => (
          <span key={j} className="spark" style={{ '--dx': `${s[0]}px`, '--dy': `${s[1]}px` } as CSSProperties} />
        ))}
      </div>,
    ),
  );
  if (events.strike >= 0) {
    items.push(
      <div key={`s${turn}`} className="fx-cell" style={cellStyle(events.strike)}>
        <div className="fx-strike" />
      </div>,
    );
  }
  return <div className="pointer-events-none absolute inset-0">{items}</div>;
}

interface BoardProps {
  grid: Cell[];
  turn: number;
  events: Events;
  flash: number;
  onSwipe: (d: Dir) => void;
}

export function Board({ grid, turn, events, flash, onSwipe }: BoardProps) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      className="board aspect-square w-full touch-none"
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const s = start.current;
        start.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        const ax = dx < 0 ? -dx : dx;
        const ay = dy < 0 ? -dy : dy;
        if (ax < 24 && ay < 24) return;
        if (ax > ay) onSwipe(dx > 0 ? 'right' : 'left');
        else onSwipe(dy > 0 ? 'down' : 'up');
      }}
      onPointerCancel={() => {
        start.current = null;
      }}
      role="application"
      aria-label="Battlefield board. Swipe or use arrow keys to slide tiles."
    >
      {SLOTS.map((i) => (
        <div key={i} className="slot" style={cellStyle(i)}>
          <div />
        </div>
      ))}

      {grid.map((t, i) =>
        t ? (
          <div key={t.id} className="tile-pos" style={cellStyle(i)}>
            <div key={turn} className={`tile-body ${t.hit ? 'anim-hit' : ''} ${t.fresh ? 'anim-spawn' : ''}`}>
              {t.kind === 'sun' ? <SunTile v={t.v} /> : <ShadeTile hp={t.v} max={t.max} boss={t.boss} />}
            </div>
          </div>
        ) : null,
      )}

      <Fx events={events} turn={turn} />
      {flash > 0 && <div key={flash} className="flash pointer-events-none absolute inset-0 rounded-[1.1rem]" />}
    </div>
  );
}
