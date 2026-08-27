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

Welcome, then camera grant, then the chooser. Camera lesson, then a looping montage of that pool. Two asks drawn from the deck, each followed by that ask's montage. Then an Opener drawn to match the second ask's relation. Then you film "Show me yours." No typing.

The deck is delay, residue, keeping, and just-done. A sitting picks two different relations and skips whatever you saw last time (sessionStorage). Indoor has 12 asks, outdoor has 10.

## Filling the pool

OK on a take stores it on the phone and uploads it into that ask's pool. Later sittings, including other people, draw from there. Do not drop user videos in the repo.

Until a pool has three other people, the montage plays whatever exists plus your own take, with the ask's caption on every cut.

The plant clip at `public/opener.mp4` is one opener, the delay-care one. Other openers have no clip yet, so the live camera stands in. Do not invent a Line for them.

`src/loop.ts` is the reducer. `src/opener.ts` is the deck. `src/montage.ts` is the cut curve. The rest is throwaway.
