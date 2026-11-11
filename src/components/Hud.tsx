import type { ReactNode } from 'react';
import { FLOORS, STEPS_PER_FLOOR, UPGRADES, UPGRADE_IDS } from '../game/content';
import type { GameState, IconName } from '../game/types';
import { Icon } from './Icons';

export function IconBtn({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 transition active:scale-95 hover:bg-white/10"
    >
      <Icon name={icon} className="h-5 w-5 text-amber-100" />
    </button>
  );
}

function Stat({ label, value, pct, sub, icon }: { label: string; value: ReactNode; pct?: number; sub?: string; icon?: IconName }) {
  return (
    <div className="panel rounded-xl px-2.5 py-2">
      <p className="flex items-center gap-1 text-[9px] tracking-[0.2em] text-stone-400">
        {icon && <Icon name={icon} className="h-3 w-3 text-amber-300" />}
        {label}
      </p>
      <p className="font-display text-base font-bold leading-tight text-amber-100">{value}</p>
      {pct !== undefined && (
        <div className="bar mt-1">
          <div style={{ width: `${pct}%` }} />
        </div>
      )}
      {sub && <p className="text-[10px] text-stone-400">{sub}</p>}
    </div>
  );
}

export function Hud({
  game,
  best,
  sound,
  onGuide,
  onMenu,
  onSound,
}: {
  game: GameState;
  best: number;
  sound: boolean;
  onGuide: () => void;
  onMenu: () => void;
  onSound: () => void;
}) {
  const tutorial = game.tut !== null;
  const floor = FLOORS[game.floor - 1];
  const stepPct = Math.min(100, ((game.steps * 100) / STEPS_PER_FLOOR) | 0);
  const xpPct = Math.min(100, ((game.xp * 100) / game.xpNeed) | 0);
  const bossIn = game.bossSpawned ? 'Herald awake' : `Herald in ${Math.max(0, STEPS_PER_FLOOR - game.steps)}`;

  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/10 ring-1 ring-amber-300/30">
          <Icon name={tutorial ? 'book' : 'castle'} className="h-6 w-6 text-amber-200" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.25em] text-amber-300/80">{tutorial ? 'TRAINING GROUNDS' : `FLOOR ${game.floor} OF ${FLOORS.length}`}</p>
          <p className="font-display truncate text-base font-bold text-amber-100">{tutorial ? 'The Dawn Lessons' : floor.name}</p>
        </div>
        <IconBtn icon="help" label="Open icon guide" onClick={onGuide} />
        <IconBtn icon={sound ? 'sound' : 'mute'} label="Toggle sound" onClick={onSound} />
        <IconBtn icon="castle" label="Back to title" onClick={onMenu} />
      </div>

      {!tutorial && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="STEPS" icon="steps" value={`${game.steps}/${STEPS_PER_FLOOR}`} pct={stepPct} sub={bossIn} />
          <Stat label="LEVEL" icon="star" value={`Lv ${game.level}`} pct={xpPct} sub={`${game.xp}/${game.xpNeed} XP`} />
          <Stat label="SCORE" icon="sun" value={game.score.toLocaleString()} sub={`Best ${best.toLocaleString()}`} />
        </div>
      )}
    </header>
  );
}

export function HeroBar({ game }: { game: GameState }) {
  let shades = 0;
  for (const t of game.grid) if (t && t.kind === 'shade') shades++;
  const dmg = 2 + game.upgrades.dawn * 2;
  const owned = UPGRADE_IDS.filter((id) => game.upgrades[id] > 0);

  return (
    <section className="panel flex items-center gap-3 rounded-2xl p-3">
      <div
        className="grid h-14 w-14 shrink-0 place-items-center rounded-full ring-2 ring-amber-200/60"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #fffbeb, #fbbf24 45%, #b45309)',
          boxShadow: '0 0 24px rgba(251,191,36,.45)',
        }}
      >
        <Icon name="blade" className="h-8 w-8 text-amber-950" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold text-amber-100">Dawnblade</p>
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-stone-300">
          <span className="flex items-center gap-1">
            <Icon name="target" className="h-3.5 w-3.5 text-amber-300" />
            {dmg} dmg / step
          </span>
          <span className="flex items-center gap-1">
            <Icon name="shade" className="h-3.5 w-3.5 text-rose-300" />
            {shades} on board
          </span>
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {owned.length > 0 ? (
            owned.map((id) => (
              <span
                key={id}
                className="flex items-center gap-1 rounded-md bg-amber-400/10 px-1.5 py-0.5 text-[10px] text-amber-200 ring-1 ring-amber-300/25"
              >
                <Icon name={UPGRADES[id].icon} className="h-3 w-3" />
                {UPGRADES[id].name} {game.upgrades[id]}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-stone-500">No blessings yet. Level up to choose one.</span>
          )}
        </div>
      </div>
    </section>
  );
}
