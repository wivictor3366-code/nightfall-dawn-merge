export type Dir = 'up' | 'down' | 'left' | 'right';
export type Kind = 'sun' | 'shade';
export type UpgradeId = 'dawn' | 'twin' | 'burst' | 'ward' | 'swift';
export type Upgrades = Record<UpgradeId, number>;
export type Status = 'intro' | 'playing' | 'levelup' | 'floorclear' | 'won' | 'over';

export type IconName =
  | 'sun'
  | 'shade'
  | 'boss'
  | 'blade'
  | 'swipe'
  | 'merge'
  | 'bump'
  | 'burst'
  | 'xp'
  | 'star'
  | 'lock'
  | 'check'
  | 'castle'
  | 'moon'
  | 'book'
  | 'help'
  | 'play'
  | 'replay'
  | 'shield'
  | 'wing'
  | 'twin'
  | 'flame'
  | 'target'
  | 'arrow'
  | 'drop'
  | 'sound'
  | 'mute'
  | 'heart'
  | 'steps'
  | 'skull';

/** A tile on the board. Sun tiles hold power, shade tiles hold HP in `v`. */
export interface Tile {
  id: number;
  kind: Kind;
  v: number;
  max: number;
  boss: boolean;
  r: number;
  c: number;
  fresh: boolean;
  hit: boolean;
  merged: boolean;
}

export type Cell = Tile | null;

/** Per-turn event log used for effects, sound and tutorial goals. */
export interface Events {
  moved: boolean;
  merges: number[];
  mergedMax: number;
  bumps: number[];
  kills: number[];
  strike: number;
  strikeDmg: number;
  bossDown: boolean;
  bossSpawn: boolean;
  levelUp: boolean;
}

export interface TutState {
  step: number;
  passed: boolean;
  wrong: number;
}

export interface GameState {
  grid: Cell[];
  nextId: number;
  floor: number;
  steps: number;
  score: number;
  level: number;
  xp: number;
  xpNeed: number;
  pending: number;
  upgrades: Upgrades;
  bossSpawned: boolean;
  bossDown: boolean;
  status: Status;
  choices: UpgradeId[];
  events: Events;
  turn: number;
  tut: TutState | null;
  lastMove: number;
}

export interface SetupTile {
  r: number;
  c: number;
  kind: Kind;
  v: number;
  boss?: boolean;
}
