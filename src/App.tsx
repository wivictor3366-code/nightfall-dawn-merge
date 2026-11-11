import { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './components/Board';
import { HeroBar, Hud } from './components/Hud';
import { EndModal, FloorClearModal, IntroModal, LevelUpModal } from './components/Overlays';
import { IconGuide, StuckBanner, TutorialCard } from './components/Tutorial';
import { TitleScreen } from './components/Title';
import { TUTORIAL } from './game/content';
import { setSound, sfx, soundOn } from './game/audio';
import { applyUpgrade, createGame, createTutorial, descend, enterFloor, swipe } from './game/engine';
import type { Dir, GameState, UpgradeId } from './game/types';

type Screen = 'title' | 'play';

const BEST_KEY = 'nightfall.best';
const STUCK_MS = 25000;
const TUT_STUCK_MS = 18000;
const KEYS: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
};

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(v: number): void {
  try {
    localStorage.setItem(BEST_KEY, String(v));
  } catch {
    /* storage unavailable: ignore */
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [game, setGame] = useState<GameState>(createGame);
  const gameRef = useRef(game);
  const [best, setBest] = useState(readBest);
  const [guideOpen, setGuideOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [flash, setFlash] = useState(0);
  const [sound, setSoundState] = useState(soundOn);

  // Single source of truth for event handlers; always updated synchronously.
  const commit = useCallback((next: GameState) => {
    gameRef.current = next;
    setGame(next);
  }, []);

  const denied = useCallback(() => {
    sfx.deny();
    setFlash((f) => f + 1);
  }, []);

  const miss = useCallback(
    (prev: GameState) => {
      denied();
      if (prev.tut && !prev.tut.passed) {
        const wrong = prev.tut.wrong + 1;
        commit({ ...prev, tut: { ...prev.tut, wrong } });
        if (wrong >= 2) setStuck(true);
      }
    },
    [commit, denied],
  );

  const move = useCallback(
    (dir: Dir) => {
      const prev = gameRef.current;
      if (prev.status !== 'playing') return;
      const tut = prev.tut;

      if (tut) {
        if (tut.passed) return;
        const step = TUTORIAL[tut.step];
        if (step.dirs !== 'all' && !step.dirs.includes(dir)) {
          miss(prev);
          return;
        }
      }

      const moved = swipe(prev, dir);
      if (!moved) {
        miss(prev);
        return;
      }

      let next: GameState = moved;
      if (tut && TUTORIAL[tut.step].goal(next.events)) {
        next = { ...next, tut: { ...tut, passed: true } };
      }
      next = { ...next, lastMove: Date.now() };
      commit(next);
      setStuck(false);

      const ev = next.events;
      sfx.swipe();
      if (ev.merges.length) sfx.merge();
      if (ev.strike >= 0) sfx.strike();
      if (ev.kills.length) sfx.kill();
      else if (ev.bumps.length) sfx.bump();
      if (ev.levelUp) sfx.level();
      if (next.status === 'over') sfx.over();
    },
    [commit, miss],
  );

  /* Persist best score */
  useEffect(() => {
    if (game.score > best) {
      setBest(game.score);
      saveBest(game.score);
    }
  }, [game.score, best]);

  /* Idle detection: offer help when the player stalls */
  useEffect(() => {
    const id = window.setInterval(() => {
      const g = gameRef.current;
      if (g.status !== 'playing') return;
      if (g.tut && g.tut.passed) return;
      const limit = g.tut ? TUT_STUCK_MS : STUCK_MS;
      if (Date.now() - g.lastMove > limit) setStuck(true);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  /* Lessons auto-open the codex when the player keeps failing */
  useEffect(() => {
    if (stuck && screen === 'play' && gameRef.current.tut) setGuideOpen(true);
  }, [stuck, screen]);

  /* Keyboard controls */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGuideOpen(false);
        return;
      }
      if (screen !== 'play' || guideOpen) return;
      const d = KEYS[e.key];
      if (d) {
        e.preventDefault();
        move(d);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, guideOpen, move]);

  /* Actions */
  const startGame = () => {
    commit({ ...createGame(), lastMove: Date.now() });
    setStuck(false);
    setScreen('play');
  };

  const startTutorial = () => {
    commit({ ...createTutorial(0, TUTORIAL[0].setup), lastMove: Date.now() });
    setStuck(false);
    setScreen('play');
  };

  const tutorialNext = () => {
    const cur = gameRef.current.tut;
    if (!cur) return;
    const nextStep = cur.step + 1;
    if (nextStep >= TUTORIAL.length) {
      startGame();
      return;
    }
    commit({ ...createTutorial(nextStep, TUTORIAL[nextStep].setup), lastMove: Date.now() });
    setStuck(false);
  };

  const pickUpgrade = (id: UpgradeId) => {
    sfx.merge();
    commit({ ...applyUpgrade(gameRef.current, id), lastMove: Date.now() });
  };

  const descendFloor = () => {
    commit({ ...descend(gameRef.current), lastMove: Date.now() });
    setStuck(false);
  };

  const enter = () => {
    commit({ ...enterFloor(gameRef.current), lastMove: Date.now() });
  };

  const toggleSound = () => {
    const v = !sound;
    setSound(v);
    setSoundState(v);
  };

  const g = game;
  const playing = screen === 'play';

  return (
    <div className="night-bg relative min-h-dvh overflow-hidden text-stone-200">
      <div className="fog" style={{ top: '-10%' }} />
      <div className="fog" style={{ top: '60%', animationDelay: '-7s' }} />

      {!playing ? (
        <TitleScreen
          best={best}
          sound={sound}
          onSound={toggleSound}
          onTutorial={startTutorial}
          onPlay={startGame}
          onGuide={() => setGuideOpen(true)}
        />
      ) : (
        <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-3 pb-6 pt-4">
          <Hud
            game={g}
            best={best}
            sound={sound}
            onGuide={() => setGuideOpen(true)}
            onMenu={() => setScreen('title')}
            onSound={toggleSound}
          />

          {g.tut && (
            <TutorialCard
              game={g}
              onContinue={tutorialNext}
              onSkip={startGame}
              onGuide={() => setGuideOpen(true)}
            />
          )}

          <div
            className="relative mx-auto w-full"
            style={{ maxWidth: 'min(100%, max(260px, calc(100dvh - 350px)))' }}
          >
            <Board grid={g.grid} turn={g.turn} events={g.events} flash={flash} onSwipe={move} />
          </div>

          {!g.tut && <HeroBar game={g} />}

          {!g.tut && stuck && <StuckBanner onOpen={() => setGuideOpen(true)} />}

          <p className="text-center text-[11px] text-stone-500">
            Swipe the board or use Arrow keys / WASD. Every swipe is one step.
          </p>

          {g.status === 'intro' && !g.tut && <IntroModal floorIndex={g.floor - 1} onEnter={enter} />}
          {g.status === 'levelup' && (
            <LevelUpModal choices={g.choices} upgrades={g.upgrades} level={g.level} onPick={pickUpgrade} />
          )}
          {g.status === 'floorclear' && <FloorClearModal floorIndex={g.floor - 1} onDescend={descendFloor} />}
          {(g.status === 'won' || g.status === 'over') && (
            <EndModal
              won={g.status === 'won'}
              score={g.score}
              best={best}
              onRetry={startGame}
              onMenu={() => setScreen('title')}
            />
          )}
        </main>
      )}

      {guideOpen && <IconGuide onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
