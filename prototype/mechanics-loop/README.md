# Onkery session one (throwaway)

Question: if each sitting deals a different pair of asks, and you answer a stranger by filming, does the sitting stop feeling like the same plant every time?

```bash
cd prototype/mechanics-loop
npm install
npm run prototype
```

Open the HTTPS URL on a phone (same Wi-Fi). Accept the certificate warning. Portrait only. Camera on, no audio.

Prompts and the full sitting: [docs/onkery-prompts.md](../../docs/onkery-prompts.md)

## The sitting

Welcome, then camera grant, then the chooser. Camera lesson, then two asks drawn from the deck. A stranger who got the same ask can answer back. Then the montage, looping until you tap. Then an Opener drawn to match the second ask's relation. Then you film "Show me yours." No typing.

The deck is delay, residue, keeping, and just-done. A sitting picks two different relations and skips whatever you saw last time (sessionStorage). Indoor has 12 asks, outdoor has 10.

## Filling the pool

`src/bin.ts` ships empty. Keys are `delay`, `residue`, `keeping`, `justdone`. Meeting stays off until you put real opted-in clips in.

Drop 1-2s clips in `public/bin/`. List them in `POOL`. Give each a `gradient` from 0 (dark, still) to 1 (bright, moving). Only a clip shown alone, or last in a montage, needs a `line`.

Until the bin is filmed, `MONTAGE_FROM_OWN_TAKES` runs the montage off your own takes. That tests the cut rhythm. It does not test scale. About fifteen clips is the floor.

The plant clip at `public/opener.mp4` is one opener, the delay-care one. Other openers have no clip yet, so the live camera stands in. Do not invent a Line for them.

`src/loop.ts` is the reducer. `src/opener.ts` is the deck. `src/montage.ts` is the cut curve. The rest is throwaway.
