import type { ReactNode } from 'react';
import { FLOORS, MAX_UPGRADE, STEPS_PER_FLOOR, UPGRADES } from '../game/content';
import type { UpgradeId, Upgrades } from '../game/types';
import { Icon } from './Icons';

function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/65 p-5 backdrop-blur-sm">
      <div className="anim-pop w-full max-w-sm" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

export function IntroModal({ floorIndex, onEnter }: { floorIndex: number; onEnter: () => void }) {
  const f = FLOORS[floorIndex];
  return (
    <Modal>
      <div className="panel rounded-3xl p-6 text-center">
        <Icon name="castle" className="mx-auto h-12 w-12 text-amber-300" />
        <p className="mt-3 text-[11px] tracking-[0.3em] text-amber-300/80">
          FLOOR {floorIndex + 1} OF {FLOORS.length}
        </p>
        <h2 className="font-display gold-text text-2xl font-black">{f.name}</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-300">{f.intro}</p>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-black/30 p-3 text-left ring-1 ring-rose-400/30">
          <Icon name="boss" className="h-9 w-9 shrink-0 text-rose-300" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] tracking-widest text-stone-400">FLOOR HERALD</p>
            <p className="font-display font-bold text-rose-200">{f.boss}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-widest text-stone-400">AFTER {STEPS_PER_FLOOR} STEPS</p>
            <p className="font-bold text-rose-200">{f.bossHp} HP</p>
          </div>
        </div>
        <button type="button" className="btn-gold mt-5 w-full" onClick={onEnter}>
          Enter the castle
          <Icon name="play" className="h-4 w-4" />
        </button>
      </div>
    </Modal>
  );
}

export function LevelUpModal({
  choices,
  upgrades,
  level,
  onPick,
}: {
  choices: UpgradeId[];
  upgrades: Upgrades;
  level: number;
  onPick: (id: UpgradeId) => void;
}) {
  return (
    <Modal>
      <div className="panel rounded-3xl p-5">
        <p className="text-center text-[11px] tracking-[0.3em] text-amber-300/80">LEVEL {level} REACHED</p>
        <h2 className="font-display gold-text mt-1 text-center text-2xl font-black">Choose a Blessing</h2>
        <div className="mt-4 flex flex-col gap-2.5">
          {choices.map((id) => {
            const u = UPGRADES[id];
            return (
              <button
                type="button"
                key={id}
                onClick={() => onPick(id)}
                className="upgrade-card flex items-center gap-3 rounded-2xl p-3 text-left"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-400/15 ring-1 ring-amber-300/40">
                  <Icon name={u.icon} className="h-7 w-7 text-amber-200" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block font-bold text-amber-100">{u.name}</span>
                  <span className="block text-xs leading-snug text-stone-300">{u.desc}</span>
                </span>
                <span className="text-[10px] font-semibold text-amber-300">
                  {upgrades[id]}/{MAX_UPGRADE}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export function FloorClearModal({ floorIndex, onDescend }: { floorIndex: number; onDescend: () => void }) {
  const f = FLOORS[floorIndex];
  return (
    <Modal>
      <div className="panel rounded-3xl p-6 text-center">
        <Icon name="check" className="mx-auto h-12 w-12 text-emerald-300" />
        <p className="mt-3 text-[11px] tracking-[0.3em] text-amber-300/80">{f.boss.toUpperCase()} DEFEATED</p>
        <h2 className="font-display gold-text text-2xl font-black">Floor Cleared</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-300">{f.outro}</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-200">
          <Icon name="sun" className="h-4 w-4" />
          A Dawn Gift sun of 16 power rises with you.
        </div>
        <button type="button" className="btn-gold mt-5 w-full" onClick={onDescend}>
          Descend deeper
          <Icon name="steps" className="h-5 w-5" />
        </button>
      </div>
    </Modal>
  );
}

export function EndModal({
  won,
  score,
  best,
  onRetry,
  onMenu,
}: {
  won: boolean;
  score: number;
  best: number;
  onRetry: () => void;
  onMenu: () => void;
}) {
  return (
    <Modal>
      <div className="panel rounded-3xl p-6 text-center">
        <Icon name={won ? 'sun' : 'moon'} className={`mx-auto h-14 w-14 ${won ? 'text-amber-300' : 'text-rose-300'}`} />
        <p className="mt-3 text-[11px] tracking-[0.3em] text-amber-300/80">{won ? 'THE NIGHT BREAKS' : 'SWALLOWED BY NIGHT'}</p>
        <h2 className="font-display gold-text text-2xl font-black">{won ? 'Dawn Restored' : 'The Dark Wins'}</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-300">
          {won
            ? 'Count Vexmor is gone and the castle sees sunlight again. You are a legend of the dawn.'
            : 'The board filled with shades and no sun could move. Regroup, merge harder, and try again.'}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-black/30 p-2.5 ring-1 ring-white/10">
            <p className="text-[10px] tracking-widest text-stone-400">SCORE</p>
            <p className="font-display text-lg font-bold text-amber-100">{score.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-black/30 p-2.5 ring-1 ring-white/10">
            <p className="text-[10px] tracking-widest text-stone-400">BEST</p>
            <p className="font-display text-lg font-bold text-amber-100">{best.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          <button type="button" className="btn-gold w-full" onClick={onRetry}>
            <Icon name="replay" className="h-5 w-5" />
            Play again
          </button>
          <button type="button" className="btn-ghost w-full" onClick={onMenu}>
            <Icon name="castle" className="h-5 w-5" />
            Title screen
          </button>
        </div>
      </div>
    </Modal>
  );
}
