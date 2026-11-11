# Nightfall: Dawn Merge

A 2048 x Vampire Survivors mashup. Slide the dawn, merge the light, slay the night.

## The one-control loop
- **Swipe** (or Arrow keys / WASD) slides every tile one step. Each swipe is one step deeper into the castle.
- **Sun relics** merge like 2048 tiles. Equal suns double into a stronger sun.
- **Shades** are vampire spawn with HP shown as their number. A stronger sun destroys one on contact; a weaker sun is spent. Shades can also drain suns and grow.
- **Dawnblade** auto-strikes the weakest shade every step, Vampire Survivors style.
- **XP** from kills and steps fills a level bar. Each level-up offers a blessing (Dawnfire, Twin Suns, Solar Burst, Holy Ward, Swift Wings).
- **25 steps per floor**, then a Herald boss rises. Three floors end with Count Vexmor.
- Board full with no legal move = swallowed by night.

## Lessons and help
- Six locked lessons teach the rules. Each next lesson unlocks only after the current goal is met.
- The Icon Codex (question mark button) is a visual legend. It opens automatically when you keep failing a lesson, and a banner offers it after a long pause in play.

## Run locally
```bash
npm install
npm run dev      # development
npm run build    # production build -> dist/index.html (single file)
```

## Performance notes
- Board is a fixed 4x4 array. A swipe is one linear pass over 16 cells with precomputed line indexes.
- No sorting, no per-frame math. Effects are CSS transforms and opacity only.
- Strike target search, level-up choice picking (swap-remove), and free-cell lookup are all O(16).

## Platform builds
- **Web / PWA**: the `dist/index.html` build is self-contained and runs in any browser.
- **Android APK and iOS**: wrap the web build with Capacitor (`npx cap add android`, `npx cap add ios`). A native SwiftUI rewrite would need the engine in `src/game/` ported to Swift; the engine is pure TypeScript with no DOM dependencies, so it is a straightforward port.
- **Steam**: wrap the same build with Electron, then add Steamworks via a Node wrapper for achievements.
