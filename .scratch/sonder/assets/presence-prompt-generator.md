# Generate seed Presences and prompts

Give this file to Claude (or another model) as the brief. It should output a **seed pack** for Sonder’s one chapter: three Presences, Motif clips to film for the seed, and the indoor / outdoor prompt lists in chapter order. It should not invent a second product.

## What Sonder is

A Motto-like chapter on a phone: the participant films when asked; strangers’ clips appear inside authored text; a later visit draws different clips of the **same** handful. The switch-up is **Presence** — a someone behind a clip, not a profile, not the narrator’s daydream.

Working name: Sonder. Do not rename the project in the output.

## Locked rules (do not break)

**Presence.** Exactly **three** someones in this chapter. The participant brushes against each more than once. You know them by a **Motif** (hands, a window, an object, a quality of light), never by a name, unique face, place-name, or bio. The chapter’s voice treats a clip as a life and **never names their feeling** (not tired, lonely, glad, struggling).

**Voice.** Unnamed. Speaks to the participant as **you** when asking to film. Speaks of a Presence as **someone** / **someone’s** when a clip is on screen. Never “show me” as a hungry narrator. Never a ghost, never a named character, never “we.”

**Arc.** One short chapter. Motto-style **inside / outside chooser**, then the **same arc** with two prompt lists:

1. Teach the mechanic (tap to film, auto-stop, keep / redo, skip) with a commonplace ask.
2. Meet Presence A (Motif clip + someone-line).
3. Continue from **A’s Motif**, not from what the participant just filmed. Not a chat.
4. Meet B, continue from B; meet C, continue from C (order may vary, but always continue from the *last Presence shown*, not from the participant).
5. Later in the chapter, meet at least one of them **again** (different clip, same someone).
6. Leave.

**Prompts.** Motto-genre: easy, in-the-room (or in-the-place), not artistic, not a confession. **Chosen so they can yield Motifs** — not Motto’s square / soft / toes list copied blindly, and **not** “show me a window” / “show me your hands” by name. Never ask for a face. If a face appears in a seed description, the eyes are covered.

**Clips on screen.** Plain clips of a life, type on them. No ghost VFX, mirror chorus, or shaders.

**Pool (for how you describe seed clips).** Silently grouped by Presence, drawn by Motif. Skip still has a next beat (the chapter plays a seed clip anyway). A Presence’s second meeting is **later**, not an instant echo. The participant’s own take is **not** one of these three; do not write a beat that presents “your clip.” A Return visit uses the **same three** with **different files** — seed must include extra Motif clips per Presence so Return is not the same film.

**Out of scope.** No live chat. No story branch from the participant’s past answers. No profiles, likes, comments, names, cities, bios.

## Motifs

Use only this set (a Presence need not use all four, but across the three someones all four should appear in the chapter):

- Hands
- Window (indoor) / sky or open light (outdoor counterpart — still not named as a city or landmark)
- A carried or nearby object
- A quality of light

Each Presence needs a **recognizable but unnamed** Motif signature: the *kind* of hands, window, object, or light that can recur without becoming a costume or a name. Example of the right grain: “hands with a chipped mug” is too identifying; “hands around a mug, seen twice” is enough. Prefer ordinary, lo-fi, filmable by anyone.

## What to output

Write a single markdown document with these sections:

### 1. Presence cards (silent)

For each of the three, use a silent label `P1`, `P2`, `P3` — never a personal name.

For each:

- Motif signature (one or two fragments that will recur)
- Indoor seed clips (at least **two** distinct clip descriptions per Motif they use — first visit vs Return)
- Outdoor seed clips (same: at least two per Motif they use)
- What must **never** appear in their clips (faces identifiable, text with place-names, name on an object, etc.)

Clip descriptions are **what to film for the seed**, 1–2 seconds, commonplace, no audio. Write them as instructions to a seed-filmer, not as poetry.

### 2. Chapter beat sheet — indoor

Numbered beats. For each beat:

- `voice:` the line on screen (you / someone register, short)
- `prompt:` the film-ask, or `none`
- `play:` which Presence + Motif clip (e.g. `P2 / hands / indoor-a`), or `none`
- Notes: onboarding vs continue-from-last vs later return

First beats teach the mechanic. Later beats continue from the last Presence’s Motif. At least one later beat is a second meeting.

### 3. Chapter beat sheet — outdoor

Same arc and Presence order. Different prompt list and outdoor clips so Motifs fit being outside. Do not write a second plot.

### 4. Prompt inventory

Two lists (indoor / outdoor) of every `prompt:` used, in order, with which Motif it is meant to yield. Confirm none name the Motif, none ask for a face, none ask for a confession.

### 5. Return pack

For each Presence, which **alternate** clip files the Return visit should draw instead, still the same three someones.

## Style of the voice lines

Small, specific, astute. Third person for them; second person for asks. Examples of the **register** (do not copy as the chapter):

- “Someone’s window at this hour.”
- “You can film that. Tap and hold still.”
- “Someone’s hands again. Not the same hour.”

Refuse:

- “They look lonely.”
- “This is Alex’s kitchen in Montreal.”
- “Show me a window.”
- “Remember what you filmed yesterday.”

## Stop when

Three Presences, two beat sheets, prompt inventory, Return pack, all rules above intact. Do not generate app code, UI chrome, or a six-chapter outline.
