import { FLOORS, MAX_UPGRADE, STEPS_PER_FLOOR, UPGRADE_IDS } from './content';
import type { Cell, Dir, Events, GameState, Kind, SetupTile, Status, Tile, TutState, UpgradeId, Upgrades } from './types';

type Grid = Cell[];

/* ---------- precomputed traversal lines (leading edge first) ---------- */

function buildLine(dir: Dir, i: number): number[] {
  const line: number[] = [];
  for (let k = 0; k < 4; k++) {
    let r = 0;
    let c = 0;
    if (dir === 'left') {
      r = i;
      c = k;
    } else if (dir === 'right') {
      r = i;
      c = 3 - k;
    } else if (dir === 'up') {
      r = k;
      c = i;
    } else {
      r = 3 - k;
      c = i;
    }
    line.push(r * 4 + c);
  }
  return line;
}

function buildLines(dir: Dir): number[][] {
  return [0, 1, 2, 3].map((i) => buildLine(dir, i));
}

const LINES: Record<Dir, number[][]> = {
  left: buildLines('left'),
  right: buildLines('right'),
  up: buildLines('up'),
  down: buildLines('down'),
};

/* ---------- small helpers ---------- */

export function xpNeeded(level: number): number {
  return 30 + level * 20;
}

function emptyUpgrades(): Upgrades {
  return { dawn: 0, twin: 0, burst: 0, ward: 0, swift: 0 };
}

function emptyEvents(): Events {
  return {
    moved: false,
    merges: [],
    mergedMax: 0,
    bumps: [],
    kills: [],
    strike: -1,
    strikeDmg: 0,
    bossDown: false,
    bossSpawn: false,
    levelUp: false,
  };
}

function makeTile(id: number, kind: Kind, v: number, boss = false): Tile {
  return { id, kind, v, max: v, boss, r: 0, c: 0, fresh: true, hit: false, merged: false };
}

function freeCells(g: Grid): number[] {
  const out: number[] = [];
  for (let i = 0; i < 16; i++) if (!g[i]) out.push(i);
  return out;
}

function placeRandom(g: Grid, t: Tile): boolean {
  const free = freeCells(g);
  if (free.length === 0) return false;
  const idx = free[(Math.random() * free.length) | 0];
  t.r = idx >> 2;
  t.c = idx & 3;
  g[idx] = t;
  return true;
}

function pairOk(a: Tile, b: Tile): boolean {
  if (a.kind !== b.kind) return true; // sun vs shade is always a legal bump
  if (a.boss || b.boss) return false;
  return a.v === b.v;
}

function hasMove(g: Grid): boolean {
  for (let i = 0; i < 16; i++) {
    const a = g[i];
    if (!a) return true;
    const r = i >> 2;
    const c = i & 3;
    if (c < 3) {
      const b = g[i + 1];
      if (!b || pairOk(a, b)) return true;
    }
    if (r < 3) {
      const b = g[i + 4];
      if (!b || pairOk(a, b)) return true;
    }
  }
  return false;
}

/* ---------- slide & resolve (one pass, O(16)) ---------- */

interface SlideResult {
  grid: Grid;
  xp: number;
  score: number;
}

function slide(g: Grid, dir: Dir, ev: Events): SlideResult {
  const out: Grid = new Array(16).fill(null);
  const lines = LINES[dir];
  let xp = 0;
  let score = 0;

  for (let li = 0; li < 4; li++) {
    const line = lines[li];
    const st: Tile[] = [];

    for (let k = 0; k < 4; k++) {
      const src = g[line[k]];
      if (!src) continue;
      const cur: Tile = { ...src, fresh: false, hit: false, merged: false };
      const n = st.length;
      if (n === 0) {
        st.push(cur);
        continue;
      }
      const top = st[n - 1];

      // same kind: merge (suns double, equal shades evolve) or stack
      if (cur.kind === top.kind) {
        if (!cur.boss && !top.boss && !top.merged && cur.v === top.v) {
          top.v *= 2;
          top.max = top.v;
          top.merged = true;
          top.hit = true;
          score += top.v;
          ev.moved = true;
          if (top.kind === 'sun') {
            ev.merges.push(line[n - 1]);
            if (top.v > ev.mergedMax) ev.mergedMax = top.v;
          }
        } else {
          st.push(cur);
        }
        continue;
      }

      // different kinds: combat at the contact point
      ev.moved = true;
      const pos = line[n - 1];
      if (cur.kind === 'sun') {
        // sun strikes the shade on top
        top.v -= cur.v;
        top.hit = true;
        if (top.v > 0) {
          ev.bumps.push(pos); // sun is spent
        } else {
          st.pop();
          ev.kills.push(pos);
          xp += top.max;
          score += top.max;
          if (top.boss) ev.bossDown = true;
          cur.hit = true;
          st.push(cur); // sun takes the shade's cell
        }
      } else {
        // shade drains the sun on top and grows
        st.pop();
        cur.v += top.v;
        if (cur.v > cur.max) cur.max = cur.v;
        cur.hit = true;
        ev.bumps.push(pos);
        st.push(cur);
      }
    }

    for (let j = 0; j < st.length; j++) {
      const t = st[j];
      const idx = line[j];
      if (t.r * 4 + t.c !== idx) ev.moved = true;
      t.r = idx >> 2;
      t.c = idx & 3;
      out[idx] = t;
    }
  }

  return { grid: out, xp, score };
}

/* ---------- post-slide systems ---------- */

function hitShade(g: Grid, i: number, dmg: number, ev: Events): number {
  const t = g[i];
  if (!t || t.kind !== 'shade') return 0;
  t.v -= dmg;
  t.hit = true;
  if (t.v > 0) return 0;
  g[i] = null;
  ev.kills.push(i);
  if (t.boss) ev.bossDown = true;
  return t.max;
}

/** Solar Burst: merged suns scorch the four neighbours. */
function burst(g: Grid, ev: Events, level: number): number {
  let xp = 0;
  for (const m of ev.merges) {
    const src = g[m];
    if (!src || src.kind !== 'sun') continue;
    const dmg = (src.v >> 1) * level;
    const r = m >> 2;
    const c = m & 3;
    if (r > 0) xp += hitShade(g, m - 4, dmg, ev);
    if (r < 3) xp += hitShade(g, m + 4, dmg, ev);
    if (c > 0) xp += hitShade(g, m - 1, dmg, ev);
    if (c < 3) xp += hitShade(g, m + 1, dmg, ev);
  }
  return xp;
}

/** Dawnblade auto-strike: hits the Herald if present, otherwise the weakest shade. */
function strike(g: Grid, dmg: number, ev: Events): number {
  let best = -1;
  let bestV = 1e9;
  for (let i = 0; i < 16; i++) {
    const t = g[i];
    if (!t || t.kind !== 'shade') continue;
    if (t.boss) {
      best = i;
      break;
    }
    if (t.v < bestV) {
      bestV = t.v;
      best = i;
    }
  }
  if (best < 0) return 0;
  ev.strike = best;
  ev.strikeDmg = dmg;
  return hitShade(g, best, dmg, ev);
}

export function pickChoices(up: Upgrades): UpgradeId[] {
  const pool: UpgradeId[] = [];
  for (const id of UPGRADE_IDS) if (up[id] < MAX_UPGRADE) pool.push(id);
  const out: UpgradeId[] = [];
  while (out.length < 3 && pool.length > 0) {
    const i = (Math.random() * pool.length) | 0;
    out.push(pool[i]);
    pool[i] = pool[pool.length - 1];
    pool.pop();
  }
  return out;
}

/** Ensures a pending level-up always has valid choices (or is cleared). */
function withLevelChoices(s: GameState): GameState {
  if (s.pending <= 0) return { ...s, choices: [] };
  const choices = pickChoices(s.upgrades);
  if (choices.length === 0) {
    return { ...s, pending: 0, choices: [], status: s.status === 'levelup' ? 'playing' : s.status };
  }
  return { ...s, choices, status: s.status === 'playing' ? 'levelup' : s.status };
}

function baseState(grid: Grid, nextId: number, floor: number, status: Status, tut: TutState | null): GameState {
  return {
    grid,
    nextId,
    floor,
    steps: 0,
    score: 0,
    level: 1,
    xp: 0,
    xpNeed: xpNeeded(1),
    pending: 0,
    upgrades: emptyUpgrades(),
    bossSpawned: false,
    bossDown: false,
    status,
    choices: [],
    events: emptyEvents(),
    turn: 0,
    tut,
    lastMove: Date.now(),
  };
}

/* ---------- public API ---------- */

export function createGame(): GameState {
  const grid: Grid = new Array(16).fill(null);
  let nextId = 1;
  for (let i = 0; i < 2; i++) placeRandom(grid, makeTile(nextId++, 'sun', 2));
  return baseState(grid, nextId, 1, 'intro', null);
}

export function createTutorial(step: number, setup: SetupTile[]): GameState {
  const grid: Grid = new Array(16).fill(null);
  let nextId = 1;
  for (const s of setup) {
    const t = makeTile(nextId++, s.kind, s.v, !!s.boss);
    t.r = s.r;
    t.c = s.c;
    t.fresh = false;
    grid[s.r * 4 + s.c] = t;
  }
  return baseState(grid, nextId, 1, 'playing', { step, passed: false, wrong: 0 });
}

/** One swipe = one step. Returns null when the swipe changes nothing. */
export function swipe(s: GameState, dir: Dir): GameState | null {
  const ev = emptyEvents();
  const slid = slide(s.grid, dir, ev);
  if (!ev.moved) return null;

  const grid = slid.grid;
  const up = s.upgrades;
  const tut = s.tut !== null;
  const floorDef = FLOORS[s.floor - 1];
  let gained = slid.xp;
  const score = s.score + slid.score;

  if (up.burst > 0 && ev.merges.length > 0) gained += burst(grid, ev, up.burst);
  gained += strike(grid, 2 + up.dawn * 2, ev);

  const steps = s.steps + 1;
  let nextId = s.nextId;
  let bossSpawned = s.bossSpawned;
  const bossDown = s.bossDown || ev.bossDown;

  if (!tut) {
    gained += up.swift;

    if (!bossSpawned && steps >= STEPS_PER_FLOOR) {
      const boss = makeTile(nextId++, 'shade', floorDef.bossHp, true);
      if (placeRandom(grid, boss)) {
        bossSpawned = true;
        ev.bossSpawn = true;
      }
    }

    const pShade = Math.min(0.5, 0.18 + s.floor * 0.05 + steps * 0.003);
    const spawns = up.twin > 0 ? 2 : 1;
    for (let i = 0; i < spawns; i++) {
      let t: Tile;
      if (Math.random() < pShade) {
        let hp = floorDef.shadeHp * (Math.random() < 0.5 ? 1 : 2);
        hp = Math.max(2, hp >> up.ward);
        t = makeTile(nextId++, 'shade', hp);
      } else {
        t = makeTile(nextId++, 'sun', Math.random() < 0.85 ? 2 : 4);
      }
      placeRandom(grid, t);
    }
  }

  let xp = s.xp;
  let level = s.level;
  let need = s.xpNeed;
  let pending = s.pending;
  if (!tut) {
    xp += gained;
    while (xp >= need) {
      xp -= need;
      level++;
      need = xpNeeded(level);
      pending++;
      ev.levelUp = true;
    }
  }

  const over = !tut && freeCells(grid).length === 0 && !hasMove(grid);
  let status: Status = 'playing';
  if (over) status = 'over';
  else if (bossDown) status = s.floor >= FLOORS.length ? 'won' : 'floorclear';
  else if (pending > 0) status = 'levelup';

  return withLevelChoices({
    ...s,
    grid,
    nextId,
    steps,
    score,
    xp,
    level,
    xpNeed: need,
    pending,
    bossSpawned,
    bossDown,
    status,
    events: ev,
    turn: s.turn + 1,
  });
}

export function applyUpgrade(s: GameState, id: UpgradeId): GameState {
  if (s.status !== 'levelup') return s;
  const upgrades: Upgrades = { ...s.upgrades, [id]: s.upgrades[id] + 1 };
  return withLevelChoices({ ...s, upgrades, pending: s.pending - 1, status: 'playing' });
}

export function enterFloor(s: GameState): GameState {
  return withLevelChoices({ ...s, status: 'playing' });
}

export function descend(s: GameState): GameState {
  const grid: Grid = s.grid.map((t) => (t && t.kind === 'shade' ? null : t));
  let nextId = s.nextId;
  // Dawn gift: a sun of 16 rises with the new floor.
  placeRandom(grid, makeTile(nextId++, 'sun', 16));
  return {
    ...s,
    grid,
    nextId,
    floor: Math.min(s.floor + 1, FLOORS.length),
    steps: 0,
    bossSpawned: false,
    bossDown: false,
    status: 'intro',
    choices: [],
    events: emptyEvents(),
    turn: s.turn + 1,
  };
}
