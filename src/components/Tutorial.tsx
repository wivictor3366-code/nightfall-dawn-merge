import { GUIDE, TUTORIAL } from '../game/content';
import type { Dir, GameState } from '../game/types';
import { Icon } from './Icons';

const ROT: Record<Dir, number> = { up: 0, right: 90, down: 180, left: -90 };

/** Locked lesson card. Next lesson only unlocks once the goal is met. */
export function TutorialCard({
  game,
  onContinue,
  onSkip,
  onGuide,
}: {
  game: GameState;
  onContinue: () => void;
  onSkip: () => void;
  onGuide: () => void;
}) {
  const tut = game.tut;
  if (!tut) return null;
  const step = TUTORIAL[tut.step];
  const last = tut.step === TUTORIAL.length - 1;

  return (
    <section className="panel anim-pop rounded-2xl p-3.5">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-400/15 ring-1 ring-amber-300/40">
          <Icon name={step.icon} className="h-7 w-7 text-amber-200" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.25em] text-amber-300/80">
            LESSON {tut.step + 1} OF {TUTORIAL.length}
          </p>
          <h2 className="font-display flex items-center gap-2 text-base font-bold text-amber-100">
            {step.title}
            {tut.passed && <Icon name="check" className="h-5 w-5 text-emerald-300" />}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-stone-300">{step.body}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5" aria-label="Lesson progress">
        {TUTORIAL.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < tut.step || (i === tut.step && tut.passed)
                ? 'bg-amber-400'
                : i === tut.step
                  ? 'bg-amber-200/80'
                  : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-black/30 px-2.5 py-1.5 ring-1 ring-white/10">
          {step.dirs === 'all' ? (
            <Icon name="swipe" className="h-5 w-5 text-amber-200" />
          ) : (
            step.dirs.map((d) => <Icon key={d} name="arrow" rotate={ROT[d]} className="h-5 w-5 text-amber-200" />)
          )}
          <span className="text-xs font-semibold text-amber-100">{step.goalText}</span>
        </div>
        {tut.passed ? (
          <button type="button" className="btn-gold btn-sm" onClick={onContinue}>
            {last ? 'Begin descent' : 'Next lesson'}
            <Icon name="play" className="h-4 w-4" />
          </button>
        ) : (
          <span className="flex items-center gap-1 text-[11px] text-stone-400">
            <Icon name="lock" className="h-4 w-4" />
            Locked until done
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-widest text-stone-500">KEY ICONS</span>
          {step.guide.map((n) => (
            <Icon key={n} name={n} className="h-4 w-4 text-stone-300" />
          ))}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-stone-400">
          <button type="button" onClick={onGuide} className="flex items-center gap-1 hover:text-amber-200">
            <Icon name="help" className="h-3.5 w-3.5" />
            Icon guide
          </button>
          <button type="button" onClick={onSkip} className="hover:text-amber-200">
            Skip
          </button>
        </div>
      </div>
    </section>
  );
}

/** Shown after prolonged inactivity during real play. */
export function StuckBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="anim-pop flex items-center gap-3 rounded-2xl bg-rose-950/80 p-3 text-left ring-1 ring-rose-400/40"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500/20">
        <Icon name="help" className="h-6 w-6 text-rose-200" />
      </span>
      <span>
        <span className="font-display block text-sm font-bold text-rose-100">Feeling stuck?</span>
        <span className="block text-xs text-rose-200/80">Open the Icon Codex to decode every symbol.</span>
      </span>
    </button>
  );
}

/** Icon codex: a visual legend of every tile, action and blessing. */
export function IconGuide({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Icon codex"
    >
      <div
        className="panel anim-pop max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Icon name="book" className="h-8 w-8 text-amber-300" />
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.25em] text-amber-300/80">FIELD GUIDE</p>
            <h2 className="font-display text-xl font-bold text-amber-100">Icon Codex</h2>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost btn-sm">
            Close
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2.5">
          {GUIDE.map((g, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-black/25 p-2.5 ring-1 ring-white/5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <Icon name={g.icon} className="h-6 w-6 text-amber-200" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-amber-100">{g.title}</p>
                <p className="text-xs leading-snug text-stone-300">{g.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-amber-400/10 p-3 text-xs leading-relaxed text-amber-100 ring-1 ring-amber-300/25">
          <p className="mb-1 font-semibold">One control, one rule</p>
          Swipe anywhere on the board, or press Arrow keys / WASD. Every swipe is one step deeper into the castle.
        </div>
      </div>
    </div>
  );
}
