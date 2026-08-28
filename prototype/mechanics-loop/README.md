# Onkery session one (throwaway)

Question: if each sitting is a named flow on the relation ring, and you answer a stranger by filming, does the sitting stop feeling like the same plant every time?

```bash
cd prototype/mechanics-loop
npm install
npm run prototype
```

Open the HTTPS URL on a phone (same Wi-Fi). Accept the certificate warning. Portrait only. Camera on, no audio. A laptop shows a phone-only screen.

Purpose: [docs/purpose.md](../../docs/purpose.md)

Prompts and the full sitting: [docs/onkery-prompts.md](../../docs/onkery-prompts.md)

## The sitting

Welcome, then camera grant, then the chooser. Inside walks A then B then C. Outside walks D then E then F. Camera lesson only after a chooser, then a looping montage of that pool. Two asks from the named flow, each followed by that ask's montage. Then an Opener for Ask B. Then you film "Show me yours" into Ask B's pool. Tap That's it to dissolve into the next flow, or back to the chooser after C or F. No typing.

The ring is keeping → delay → residue → justdone. A short pool widens into an adjacent relation. A and B both end on delay-care, so the plant at `public/opener.mp4` shows twice inside. Line: `I'll get to it`. Other openers have no clip, so the live camera stands in. Do not invent a Line for them.

## Filling the pool

OK on a take stores it on the phone and uploads it into that ask's pool. Later sittings, including other people, draw from there. Do not drop user videos in the repo.

On a Vercel deploy, the file lives in Blob. A Redis catalog remembers `{pool, url, uploadedAt}` so a montage samples 12 instead of listing the store. A daily cron keeps the newest 24 per pool and deletes the rest. Local `npm run prototype` still uses `.pool/` on disk.

Until a pool has three other people, the montage widens into a neighbor on the ring, with the ask's caption on every cut.

`src/loop.ts` is the reducer. `src/opener.ts` is the flows. `src/montage.ts` is the cut curve. The rest is throwaway.
