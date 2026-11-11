import type { IconName } from '../game/types';
import { HeroScene } from './Scene';
import { Icon } from './Icons';
import { IconBtn } from './Hud';

const HOW: { icon: IconName; label: string; text: string }[] = [
  { icon: 'swipe', label: 'Slide', text: 'One swipe moves the whole battlefield.' },
  { icon: 'merge', label: 'Merge', text: 'Equal suns fuse into mightier light.' },
  { icon: 'blade', label: 'Strike', text: 'Your blade hunts shades automatically.' },
];

export function TitleScreen({
  best,
  sound,
  onSound,
  onTutorial,
  onPlay,
  onGuide,
}: {
  best: number;
  sound: boolean;
  onSound: () => void;
  onTutorial: () => void;
  onPlay: () => void;
  onGuide: () => void;
}) {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 py-5">
      <div className="flex justify-end">
        <IconBtn icon={sound ? 'sound' : 'mute'} label="Toggle sound" onClick={onSound} />
      </div>

      <div className="overflow-hidden rounded-3xl ring-1 ring-amber-300/25 shadow-[0_20px_60px_rgba(0,0,0,.6)]">
        <HeroScene />
      </div>

      <div className="text-center">
        <p className="text-[11px] tracking-[0.4em] text-amber-300/80">A DAWNBEARER&apos;S TALE</p>
        <h1 className="font-display gold-text mt-1 text-5xl font-black leading-none">NIGHTFALL</h1>
        <p className="font-display mt-3 text-[11px] tracking-[0.18em] text-rose-200/90">
          SLIDE THE DAWN · MERGE THE LIGHT · SLAY THE NIGHT
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {HOW.map((h) => (
          <div key={h.label} className="panel flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center">
            <Icon name={h.icon} className="h-7 w-7 text-amber-200" />
            <p className="font-display text-xs font-bold text-amber-100">{h.label}</p>
            <p className="text-[10px] leading-snug text-stone-400">{h.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <button type="button" className="btn-gold w-full" onClick={onTutorial}>
          <Icon name="book" className="h-5 w-5" />
          Begin the lessons
        </button>
        <button type="button" className="btn-ghost w-full" onClick={onPlay}>
          <Icon name="play" className="h-5 w-5" />
          Descend now
        </button>
        <button type="button" className="btn-ghost w-full" onClick={onGuide}>
          <Icon name="help" className="h-5 w-5" />
          Icon codex
        </button>
        <p className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <Icon name="star" className="h-3.5 w-3.5 text-amber-400" />
          Best score {best.toLocaleString()}
        </p>
      </div>
    </main>
  );
}
