# Onkery

## Destination

A working prototype you can hold on a phone — one short chapter that still contains the full loop: authored story, a few film prompts, strangers' clips inside the story, and a return visit where the pool has reshuffled. Each clip is a Presence: a someone behind the clip, not a profile, and not just the narrator's daydream.

## Notes

- Domain: interactive narrative; Motto's body with sonder as the switch-up.
- Skills every session should consult: grilling, domain-modeling, prototype. Research tickets use research.
- Execution is in-scope for this map, but only as far as the holdable prototype. Do not grow this into a shipped product on this map.
- Motto's body unless a ticket says otherwise: mobile web, camera as the interface, little chrome, no accounts, no likes/comments/follower counts.
- Working name **Onkery**. Tracker folder is still `.scratch/sonder/`.
- Tracker: local markdown in `.scratch/sonder/`. Refer to tickets by name (the title wrapping a link), never by bare number.
- Glossary: [CONTEXT.md](../../CONTEXT.md).
- North star (not a map decision): [docs/sonder-narrative.md](../../docs/sonder-narrative.md) — people as the spine, video+text, async branching, interpretation hinge. It reopens conversation-branching the map currently cuts; do not treat the doc as reversing Out of scope.
- After [Playable one-chapter loop](issues/07-playable-one-chapter-loop.md), session one is specified; the next sitting is [Playable session one](issues/10-playable-session-one.md). [Put the three Presences in the loop](issues/08-put-the-three-presences-in-the-loop.md) stays parked until that is holdable.

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- Motto's phone loop is a mobile-web ghost story: tap-to-film prompts, delayed clips mixed into the narrator's tale, cookies for progress, skip allowed but lesser; details in the research file. See [Research Motto's loop](issues/01-research-mottos-loop.md).
- A Presence is one of a handful of someones you meet more than once, known by a Motif (hands, window, object, light), never by name, face, place, or bio; the chapter's voice treats the clip as a life and never diagnoses them. See [What is Presence](issues/02-what-is-presence.md).
- The surface is Motto's disappearing UI (vertical phone, type on video, teach-by-doing, tap/keep/redo/skip) with commonplace Motif-yielding prompts and plain clips; no ghost VFX, chapter menu, or share. See [How Motto is the surface](issues/03-how-motto-is-the-surface.md).
- The pool is silently grouped by Presence and drawn by Motif; the handful is seeded; skip still plays pool clips; a Presence returns later in the chapter; your clip becomes a new Presence for others, never shown as yours this visit; a Return is the same handful, different clips. See [How the pool draws and accepts clips](issues/04-how-the-pool-draws-and-accepts-clips.md).
- One chapter, three Presences: inside/outside chooser, same noticing arc, you/someone voice that continues from the last Presence's Motif; generate seed and prompts from the asset. See [What is the one chapter](issues/05-what-is-the-one-chapter.md).
- The cheap artifact is mechanics only (chooser, one prompt, tap/keep/redo/skip); the seed pack is parked until Presences go into the loop. See [Cheap Presence artifact](issues/06-cheap-presence-artifact.md).
- The holdable phone loop is Motto record chrome only (chooser, one prompt, tap / auto-stop / keep / redo / skip), no Presences; it is the chrome session one drops into. See [Playable one-chapter loop](issues/07-playable-one-chapter-loop.md).
- Session one is the product for people who only sit once: light film-ask, then one real opted-in Opener (clip + Line as type on video, light register), then "What were they carrying?" (no skip); they leave holding the stranger's Line. See [What is session one](issues/09-what-is-session-one.md).
- The piece is named **Onkery**. Tracker folder is still `.scratch/sonder/`.

## Not yet specified

- Tech stack.
- Who the one real opted-in Opener is, and the actual clip + Line (light register).
- Consent and legal copy for storing contributed clips.
- Languages.
- Rewrite of the three Presence Motifs/voice (seed pack parked; too close to hobbies/profiles). [Put the three Presences in the loop](issues/08-put-the-three-presences-in-the-loop.md) may rewrite or drop this after session one is holdable.
- Whether the destination stays an authored chapter of three Presences, or becomes the north-star ritual, once session one is holdable.
- Whether to reopen personal branching on purpose (still Out of scope until a ticket says otherwise).

## Out of scope

- Personal branching from *your* past answers ("a conversation a couple of days ago" as a mechanic) — replay is pool-reshuffle only.
- Live chat / messaging.
- A six-chapter Motto-scale piece.
- Profiles, identity, or any judgment surface (likes, comments, social graph).
- Native app stores.
