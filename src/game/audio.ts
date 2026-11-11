/* Tiny WebAudio synth: a few oscillator blips, no assets, negligible CPU. */

let ctx: AudioContext | null = null;
let enabled = true;

export function soundOn(): boolean {
  return enabled;
}

export function setSound(v: boolean): void {
  enabled = v;
}

function getCtx(): AudioContext | null {
  if (!enabled) return null;
  if (!ctx) {
    const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const AC = W.AudioContext ?? W.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo = 0, delay = 0): void {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo > 0) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  swipe: () => tone(260, 0.12, 'triangle', 0.05, 180),
  merge: () => tone(620, 0.16, 'sine', 0.09, 980),
  bump: () => tone(140, 0.16, 'sawtooth', 0.05, 70),
  strike: () => tone(880, 0.12, 'square', 0.03, 440),
  kill: () => tone(520, 0.28, 'triangle', 0.09, 110),
  deny: () => tone(180, 0.1, 'square', 0.03, 120),
  level: () => {
    tone(523, 0.18, 'triangle', 0.09);
    tone(659, 0.18, 'triangle', 0.09, 0, 0.12);
    tone(784, 0.3, 'triangle', 0.09, 0, 0.24);
  },
  over: () => tone(300, 0.6, 'sawtooth', 0.06, 80),
};
