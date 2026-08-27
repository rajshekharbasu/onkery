# Onkery — prompts and sitting

Source of the ask lists: `prototype/mechanics-loop/src/opener.ts`. This file is the readable inventory of what the phone says, and the order of a sitting.

No typing. The participant answers by filming.

## Sitting

A sitting is dealt when they pick inside or outside. Two asks from different relations, not the ones from last time. The opener matches the second ask's relation. Kept clips upload into a pool for that ask. Other sittings draw from it.

1. Welcome
2. Camera grant
3. Inside or outside
4. Camera lesson: *Show me anything.* Then a looping montage of that pool, caption *anything*.
5. Ask A. Then a looping montage of that ask's pool, with its caption on every cut.
6. Ask B. Same.
7. Frame: *Someone else was asked this too.*
8. Opener. They were asked the same relation. Plant clip only if that opener has a file. Otherwise the live camera stands in. No invented Line.
9. *Your turn.*
10. *Show me yours.* Then a montage of that pool, caption *yours*.
11. *That's it.* Tap to sit again (skips welcome, keeps the camera).

A montage wants at least three other people when the pool has them, and loops until they tap. Your own take is in it unmarked. Do not put clips in the repo. OK on a take sends it to the pool.

## Welcome and grant

This is Onkery.

You film small things from where you are. Other people who were asked the same thing show you theirs.

Your videos stay inside Onkery. They are not sold, not used to train anything, and not used for anything else. No audio.

Continue.

Onkery needs the camera.

Nothing is recorded until you press the shutter.

Allow camera.

If they refuse: *You won't be able to continue unless you grant access to the camera.* No audio. Try again, back to the grant.

## Chooser

Are you outside, or indoors, right now?

I'm indoors / I'm outside

It doesn't work very well inside a vehicle.

## Camera lesson

This is how you take a video.

Show me anything.

Tap the button below to record. It stops after a couple of seconds.

There. You captured a clip.

The second film-ask, if it has an after line: *The camera only records when you push the button.* That line is not on the current deck. Teach is the only ask with an after.

## Relations

Asks are relations, not object classes. A sitting draws two different ones.

| Relation | What it pulls |
|---|---|
| delay | something left undone |
| residue | evidence of a day |
| keeping | a chosen or borrowed thing |
| justdone | what a body was in the middle of |

## Indoor deck

**delay**

- Show me something you keep meaning to take care of. Do not touch it.
- Show me something that has been sitting there.
- Show me something unfinished.

**residue**

- Show me the last thing you used and did not put away.
- Show me a mess you made.
- Show me something that is still out from earlier.

**keeping**

- Show me something you keep nearby.
- Show me something here that is not yours.
- Show me what sits next to where you sit.

**justdone**

- Show me what you were just doing. Do not set it up.
- Show me the last thing your hands were on.
- Show me where you were standing before this.

## Outdoor deck

**delay**

- Show me something out here that has been left.
- Show me something that looks like it is waiting.

**residue**

- Show me some garbage.
- Show me something someone left.

**keeping**

- Show me something out here that is not yours.
- Show me something you brought with you.

**justdone**

- Show me the weather you have been under.
- Show me what's under your feet.
- Show me something moving that is not you.
- Show me where you were before you stopped.

## Openers

Drawn to match the second ask's relation. Only delay-care has a clip (`/opener.mp4`) today.

- Show me something you keep meaning to take care of. Do not touch it. (clip)
- Show me something that has been sitting there.
- Show me the last thing you used and did not put away.
- Show me a mess you made.
- Show me something you keep nearby.
- Show me something here that is not yours.
- Show me what you were just doing. Do not set it up.
- Show me the last thing your hands were on.

On screen: *They were asked* plus that line.

## Close

Someone else was asked this too.

Your turn.

Show me yours.

That's it.

## Montage

Procedural. Clips in the relation bin, sorted dark/still to bright/moving. Own takes spliced unmarked into the fast stretch. Cuts start around a second, accelerate, then two slower tail cuts. Then it loops from the top until they tap.
