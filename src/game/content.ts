import type { Dir, Events, IconName, SetupTile, UpgradeId } from './types';

export const STEPS_PER_FLOOR = 25;
export const MAX_UPGRADE = 3;
export const UPGRADE_IDS: UpgradeId[] = ['dawn', 'twin', 'burst', 'ward', 'swift'];

export interface FloorDef {
  name: string;
  boss: string;
  bossHp: number;
  shadeHp: number;
  intro: string;
  outro: string;
}

export const FLOORS: FloorDef[] = [
  {
    name: 'The Gilded Gate',
    boss: 'Herald Mordrel',
    bossHp: 40,
    shadeHp: 2,
    intro:
      "Dusk spills through the gate and the Count's brood follows. The Dawnblade is the last light left in the castle. Slide, merge and burn them back into the dark.",
    outro: "Mordrel's crown cracks and turns to ash. Beyond the gate, the Hall of Brides glows with crimson mist.",
  },
  {
    name: 'The Hall of Brides',
    boss: 'Lady Sanguina',
    bossHp: 90,
    shadeHp: 4,
    intro:
      'Crimson mist curls between the pillars. The brides pair up, and every shade they feed on grows stronger.',
    outro: 'Sanguina shrieks and dissolves into the mist. Only the Throne of Night remains.',
  },
  {
    name: 'The Throne of Night',
    boss: 'Count Vexmor',
    bossHp: 160,
    shadeHp: 8,
    intro:
      'Count Vexmor rises from his throne and swallows the last sun. Forge the brightest light you can and end his reign before dawn.',
    outro: 'The Count falls. Light floods the castle and the first sunrise in a century spills over the hills.',
  },
];

export const UPGRADES: Record<UpgradeId, { name: string; desc: string; icon: IconName }> = {
  dawn: { name: 'Dawnfire', desc: 'Dawnblade strikes deal +2 damage.', icon: 'flame' },
  twin: { name: 'Twin Suns', desc: 'Two new suns rise every step.', icon: 'twin' },
  burst: { name: 'Solar Burst', desc: 'Merged suns scorch nearby shades.', icon: 'burst' },
  ward: { name: 'Holy Ward', desc: 'New shades arrive with less HP.', icon: 'shield' },
  swift: { name: 'Swift Wings', desc: '+1 XP every step.', icon: 'wing' },
};

export interface TutorialStep {
  title: string;
  body: string;
  icon: IconName;
  goalText: string;
  dirs: Dir[] | 'all';
  guide: IconName[];
  setup: SetupTile[];
  goal: (e: Events) => boolean;
}

/** Locked, ordered lessons. Each lesson only unlocks after the previous goal is met. */
export const TUTORIAL: TutorialStep[] = [
  {
    title: 'Dawn Breaks',
    body: 'Every swipe slides ALL tiles one step, like the sun crossing the castle. Your first lesson: slide the Sun Relic to the right.',
    icon: 'swipe',
    goalText: 'Swipe RIGHT',
    dirs: ['right'],
    guide: ['sun', 'swipe'],
    setup: [{ r: 3, c: 0, kind: 'sun', v: 2 }],
    goal: (e) => e.moved,
  },
  {
    title: 'Equal Suns Merge',
    body: 'Two suns of the same power fuse into one with double power. Swipe LEFT to join them.',
    icon: 'merge',
    goalText: 'Swipe LEFT',
    dirs: ['left'],
    guide: ['merge', 'sun'],
    setup: [
      { r: 3, c: 0, kind: 'sun', v: 2 },
      { r: 3, c: 2, kind: 'sun', v: 2 },
    ],
    goal: (e) => e.merges.length > 0,
  },
  {
    title: 'Shades Bite Back',
    body: "Shades are vampire spawn and their number is their HP. A sun with more power than a shade's HP destroys it. Swipe RIGHT to strike.",
    icon: 'bump',
    goalText: 'Swipe RIGHT',
    dirs: ['right'],
    guide: ['shade', 'bump'],
    setup: [
      { r: 3, c: 0, kind: 'sun', v: 4 },
      { r: 3, c: 3, kind: 'shade', v: 4 },
    ],
    goal: (e) => e.kills.length > 0,
  },
  {
    title: 'Dawnblade Strikes',
    body: "Your blade strikes the weakest shade on every step, like a hunter's reflex. Swipe any way and watch the shade's health bar drop.",
    icon: 'blade',
    goalText: 'Swipe any way',
    dirs: 'all',
    guide: ['blade', 'target'],
    setup: [
      { r: 0, c: 0, kind: 'shade', v: 6 },
      { r: 3, c: 1, kind: 'sun', v: 2 },
    ],
    goal: (e) => e.strike >= 0,
  },
  {
    title: 'Chain Reactions',
    body: 'A tile can merge only once per swipe, so line your pairs up carefully. Forge a sun of 8 power or more. Swipe LEFT.',
    icon: 'star',
    goalText: 'Swipe LEFT',
    dirs: ['left'],
    guide: ['merge', 'star'],
    setup: [
      { r: 3, c: 0, kind: 'sun', v: 2 },
      { r: 3, c: 1, kind: 'sun', v: 2 },
      { r: 3, c: 2, kind: 'sun', v: 4 },
      { r: 3, c: 3, kind: 'sun', v: 4 },
    ],
    goal: (e) => e.mergedMax >= 8,
  },
  {
    title: 'The Herald Awakens',
    body: 'Every 25 steps a Herald boss rises from the floor, with far more HP than any shade. Swipe any way to begin your descent.',
    icon: 'boss',
    goalText: 'Swipe any way',
    dirs: 'all',
    guide: ['boss', 'castle', 'xp'],
    setup: [
      { r: 3, c: 0, kind: 'sun', v: 8 },
      { r: 0, c: 3, kind: 'shade', v: 8 },
    ],
    goal: (e) => e.moved,
  },
];

export const GUIDE: { icon: IconName; title: string; text: string }[] = [
  { icon: 'sun', title: 'Sun Relic', text: 'Light tile. Its number is its power. Equal suns merge and double.' },
  { icon: 'shade', title: 'Shade', text: 'Vampire spawn. The number is its HP. Hit it with a stronger sun.' },
  { icon: 'boss', title: 'Herald', text: 'Floor boss. Appears after 25 steps. Defeat it to descend.' },
  { icon: 'blade', title: 'Dawnblade', text: 'Your hero. Auto-strikes the weakest shade on every step.' },
  { icon: 'swipe', title: 'Slide', text: 'Swipe the board or press Arrow keys / WASD. Every tile moves.' },
  { icon: 'merge', title: 'Merge', text: 'Two equal suns side by side fuse into one with double power.' },
  { icon: 'bump', title: 'Bump', text: 'A sun that hits a shade either destroys it or is spent.' },
  { icon: 'burst', title: 'Solar Burst', text: 'Blessing: merged suns scorch the shades beside them.' },
  { icon: 'xp', title: 'XP Shards', text: 'Kills and steps give XP. Fill the bar to level up and choose a blessing.' },
  { icon: 'castle', title: 'Floor', text: 'Each floor is 25 steps deep. Reach the end and the Herald waits.' },
  { icon: 'lock', title: 'Locked Lesson', text: 'Lessons unlock one at a time. Complete the goal to continue.' },
  { icon: 'target', title: 'Goal', text: 'The arrows on the lesson card tell you which way to swipe.' },
];
