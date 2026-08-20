# What Motto actually does on a phone

Motto is a mobile-web interactive novella: a nameless narrator tells a ghost story about a missing spirit named September, and the phone’s camera is how the participant answers. Tiny lo-fi clips — the participant’s own, other people’s, and a seeded bank — are woven into that story. This file describes that loop from first-party sources only.

**Observation limits.** Motto is phone-only and portrait-only. A desktop visit is told to go to motto.io on a phone; landscape is blocked. This research did not complete a live camera session. Claims about on-phone copy, chapter titles, prompts, skip paths, and indoor/outdoor splits come from Motto’s own published HTML, locale strings, and chapter task files (`/data/tasks_in1.json` through `tasks_out4.json`) plus NFB/AATOAA write-ups. Chapters 5 and 6 were not at those same public filenames (404). Secondary write-ups (blogs, Wikipedia, Electronic Literature Directory) are not used unless a first-party page already said the same thing.

Sources used throughout:

- [motto.io](https://www.motto.io/) — About, legal notices, credits, device copy, chapter menu, locale strings, published chapter task files
- [AATOAA: Motto](https://www.aatoaa.com/motto) — studio page
- [NFB press kit / Media Space](https://mediaspace.nfb.ca/motto) (same kit at [mediaspace.nfb.ca/epk/motto](https://mediaspace.nfb.ca/epk/motto))
- [NFB press release, 28 May 2020](https://mediaspace.nfb.ca/comm/discover-vincent-morissets-motto-nfb-an-interactive-experience-exclusively-for-your-phone-available-as-of-now-at-motto-io/)
- [NFB case study, 30 Nov 2020](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/) — Interactive studio / Cédric Mal, with the creators
- [Sean Michaels on NFB Blog, 8 June 2020](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/) — Motto’s writer, first-party

---

## Overview

Motto is “an interactive website for your phone,” free at motto.io, English and French, six chapters taken at the participant’s own pace, indoors or out. ([press release](https://mediaspace.nfb.ca/comm/discover-vincent-morissets-motto-nfb-an-interactive-experience-exclusively-for-your-phone-available-as-of-now-at-motto-io/); [press kit](https://mediaspace.nfb.ca/motto))

The kit’s short form: a playful interactive novella that uses thousands of tiny videos to tell “the thousand-year tale of a kindhearted spirit named September.” Part ghost story, part scavenger hunt, documentary and fiction — “incorporating participants’ lo-fi, unstaged footage into its own emotional narrative.” ([press kit](https://mediaspace.nfb.ca/motto); same synopsis on [motto.io](https://www.motto.io/) and [AATOAA](https://www.aatoaa.com/motto))

On the phone, the loop is: read authored text → film a short clip when asked (or skip) → see that clip and strangers’ clips appear later inside the story → stop and resume across visits via cookies. Vincent Morisset: “The camera becomes our interface and our mode of interacting.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) AATOAA: clips become “stand-ins for the narrator’s daydreams and mementos,” added anonymously to “a pool of collective memory.” ([AATOAA](https://www.aatoaa.com/motto); [press kit, “About the User Experience”](https://mediaspace.nfb.ca/motto))

It is a browser experience, not an app-store app. Morisset chose the web “because it’s free, instantaneous and I’m a lover of the web and open and free platforms.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) AATOAA’s studio page says “Launch motto.io on mobile.” ([AATOAA](https://www.aatoaa.com/motto))

Credits (consistent across motto.io, AATOAA, press kit): directed by Vincent Morisset, written by Sean Michaels, coded by Édouard Lanctôt-Benoit, edited by Caroline Robert; studio AATOAA; produced by the National Film Board of Canada. Third NFB–Morisset collaboration after BLA BLA (2011) and Way to Go (2015). ([motto.io](https://www.motto.io/); [press kit](https://mediaspace.nfb.ca/motto))

---

## Prompts

Prompts are short film asks inside the authored story — “a scavenger hunt of miniature video clips, each one an easy, digestible task.” ([press kit](https://mediaspace.nfb.ca/motto); [AATOAA](https://www.aatoaa.com/motto))

They are written to be doable by anyone, not “artists.” Caroline Robert: the opening images are “quite raw and commonplace, the kinds of shots that we can all take on our phones,” so people are not expected to make “beautiful” contributions. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) Morisset’s own filming note, quoted in the case study: “Film what you see without embellishment / Frame the subject / Be succinct / Try things / Be yourself.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**How a prompt is taught (chapter 1, indoor path).** Motto does not assume the participant already knows the camera UI. The chapter script says “This is how you take a video in Motto,” then:

- “Show me anything” — tap to record; Motto “will automatically stop recording after a couple seconds.”
- After filming: “Now that Motto has finished recording, press ‘OK’ to continue, or the backwards arrow icon to redo the video.”
- “There. You captured your first clip.” / “The camera only records when you push the button.”
- Then “Now show me something square.” then “Next, touch something soft.” ([motto.io `tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))

Sean Michaels later names the archive as “wiggling toes and ravishing trash, ‘things that are soft’ and ‘things that are square.’” ([Michaels, NFB Blog](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/))

**Kinds of asks in the published chapter scripts (ch. 1–4).** Not a full prompt list; a sample of what the phone actually asks:

- Everyday objects and gestures: anything; something square; touch something soft; wiggle toes; wiggle fingers; look toward a window; close a door / reopen it; a chair; a hat (“Please put it on”); photos nearby. ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json), [`tasks_in2.json`](https://www.motto.io/data/tasks_in2.json))
- Place: “What does it look like where you are?” ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))
- Face (front camera): “Hellooo!” with optional skip-hint “If you ever want to skip a task, just hit X.” ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))
- Drawing and writing: write MOTTO; write your name; draw a circle / triangle / square. ([`tasks_in3.json`](https://www.motto.io/data/tasks_in3.json))
- Carryable objects: “Find something that matters to you. Something small enough to carry in one hand.” / “Pick it up.” / “Show it to me.” ([`tasks_in4.json`](https://www.motto.io/data/tasks_in4.json))
- Live camera as a beat, not a saved clip: after “What does it look like where you are?”, a live feed overlay can say “I see some cool stuff.” Computer vision is also used for small actions (case study examples: turn around, put a hand in front of the camera). ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json); [case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Tone of the asks.** Michaels: getting people to “supply surprising answers to unexpected requests” was key; sentences are stripped down, intimate, “small, and astute.” Location (kitchen, balcony, street, and more fundamentally inside vs outside) is “pivotal to every prompt.” Morisset: “the context and reality of the participants become part of the story.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**What the prompts are not.** They are not a social feed, not scored, not a scavenger hunt with a leaderboard. The case study likens Motto’s attention economy to a book, not Twitter; Way to Go’s “No one’s waiting, no one’s keeping score” is cited as the same family of pace. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

---

## Camera as interface

Motto runs in the phone’s web browser at motto.io. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/); [press release](https://mediaspace.nfb.ca/comm/discover-vincent-morissets-motto-nfb-an-interactive-experience-exclusively-for-your-phone-available-as-of-now-at-motto-io/))

**Device constraints (motto.io’s own copy):**

- Portrait only: “Sorry, Motto only works in vertical (portrait) mode!” ([motto.io](https://www.motto.io/))
- Desktop: “Hi! You can’t experience Motto on {device}. Please visit motto.io on your phone and we can get started together.” ([motto.io English locale](https://www.motto.io/))
- Older device / no WebGL: “Sorry—we couldn’t find a way to make Motto work on this device. Capitalism is the worst, but we hope you will try again on a newer machine.” ([motto.io locale](https://www.motto.io/))
- Stale browser: asks the participant to update and reload. In-app browsers: “Motto is an experience designed for your browser. To continue, please open {browser} and type in: motto.io.” ([motto.io locale](https://www.motto.io/))
- Vehicles: “Motto doesn’t work very well inside a vehicle.” (chapter 1 indoor/outdoor chooser, [`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))

The interface is meant to disappear. Lanctôt-Benoit: “as fluid as possible, with few user prompts. You need to be able to understand it without a tutorial. The aim is for everything to be magical.” Everyone must be able to film, save, and send clips; Motto then adds text and effects so the result is the same across phones. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Recording, not browsing.** Recording is tap-to-record, short (chapter 1 durations are about 1.5–2 seconds), auto-stopping. Front or back camera depending on the prompt (face uses front; most object/place prompts use back). After a take: keep (OK) or redo (backwards arrow). A skip control (X) sits on the record view. ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json); motto.io record UI: skip / capture-yes / capture-redo assets)

**Audio.** Motto’s camera grant copy: “No audio will be recorded and we won’t give these videos to anyone else.” Return visits: “We still won’t ever record any audio.” ([motto.io locale `allowCameraFirst` / `allowCameraReturn`](https://www.motto.io/)) Chapter 2 can invite the participant to play their own music in another app: “If you’d like, you can put some music on. With your phone—just change apps and hit play. Your own soundtrack. You don’t have to if you don’t want to.” ([`tasks_in2.json`](https://www.motto.io/data/tasks_in2.json)) The case study also says there is “no sound or intonation in Motto” as authored soundtrack — “and yet we have the feeling that a small voice is whispering in our ear.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Permission is required to continue, separate from submitting a clip.** Legal: authorizing the camera grants the NFB the right to use captured images “exclusively as part of the Motto project and for promotional and rollout purposes.” ([motto.io legal notices](https://www.motto.io/)) If the camera is refused: “Sorry, you won’t be able to continue with MOTTO unless you grant it access to the camera. We won’t submit your videos without permission, and no audio will ever be recorded.” iOS/Android copy then explains how to turn camera access on in Settings. ([motto.io locale `camera.refused*`](https://www.motto.io/)) After grant: “Great, the camera’s working!” Later chapters re-ask: “We have to authorize your camera again for the chapter.” ([`tasks_in2.json`](https://www.motto.io/data/tasks_in2.json); motto.io `allowCameraChapter`)

**Computer vision, used sparingly.** The press kit: “a mixture of live video analysis, neural-network-assisted computer vision and its own custom curation system.” ([press kit, “About the Technology”](https://mediaspace.nfb.ca/motto)) The case study: AI montage was mostly dropped as not poetic enough; what they kept is real-time analysis so Motto can wait for a small action (cover the lens, turn around) and respond. Face-masking is the other surviving CV piece. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/); [Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/): “Besides Motto’s face-masking technology, little of this made it into the final project.”)

**Little chrome.** Chapter 1 is a tutorial-by-doing, not a help screen. Menu: All Chapters, Restart, language (EN/FR), About, credits, share (Facebook, Twitter, Copy Link), NFB logo. ([motto.io HTML](https://www.motto.io/)) Can be added to the home screen (continue-later copy). No accounts.

---

## Cookies / progress

Motto is six chapters and “you may not complete the entire experience in one visit.” Cookies “allow you to enjoy Motto over several sessions without losing your progress. They also save your video contributions so that these will reappear as the experience goes on.” “No personal data is collected at any time.” Disable cookies and progress is not saved; contributions are lost when the Motto window is closed. ([motto.io legal notices](https://www.motto.io/))

There is no account. Progress is device/browser state.

**Welcome back / continue later (motto.io locale):**

- Return: “Welcome back to Motto! Continue where you left off.”
- Pause: “We’ve saved your place and you can finish another time. Also, you can add this page to your home screen if you wish. See you soon!” Private mode: “If your browser is in Private mode, you need to keep this page open or we’ll lose your spot.”
- Between chapters the pause screen can offer “Continue Inside” / “Continue Outside,” or “Next chapter,” or late-story “Conclude Now” / “Continue Inside a Ghost.”

**Restart.** Menu: “Restart Motto.” Confirm: “This will reset Motto to the beginning and allow you to record new videos.” Per-chapter indoor/outdoor menu: Read / Continue / Restart inside or outside. ([motto.io HTML + locale](https://www.motto.io/))

**Pace.** Press kit: “6 × 15 min,” “an hour-plus experience presented as a series of discrete chapters,” taken “at your own pace.” ([press kit](https://mediaspace.nfb.ca/motto)) Chapter 1 title card: “First chapter of six / Each chapter takes about 15 minutes.” ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json)) The case study: everyone can consume it like a book, pick up and put down. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

---

## Anonymity and faces

Anonymity is named as a “crucial design choice.” Everybody who experiences Motto “is joining forces with those who have experienced it before, adding intimate fragments of their lives to a pool of collective memory.” ([AATOAA](https://www.aatoaa.com/motto); [press kit](https://mediaspace.nfb.ca/motto))

**Faces.** Case study: “Take a picture of yourself, and a box will cover your eyes.” The box was chosen over flashier effects because it was “the most effective — and playful: they could write on the box!” It reassures and is “immediately understandable.” “There are no recognizable faces.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

Chapter 1 front-camera hello writes on the box, e.g. “Nice to meet you.” If the participant skips, Motto shows other people’s boxed faces with lines such as “My embarrassment is concealed behind this box.” / “In real life I have eyes.” then asks again “Will you say hello?” with box text “How do you do?” A second skip: “That’s OK. Maybe later.” ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))

**No profiles, no social graph.** Legal: no personal data collected. Credits list named “First contributions” (seed participants), but the experience itself does not attach a public identity to a clip. ([motto.io credits + legal](https://www.motto.io/)) The case study: Motto is a different use of the platforms that usually trap people in feeds. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**September’s gender.** English “they” is neutral; French is not. The team randomly assigns September’s gender — “50 percent of users would encounter a male-identified ghost, 50 percent female” — so people can project without a fixed gender cue. ([Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/); [case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Image rights vs personal data.** Camera grant = NFB may use captured images for Motto and “promotional and rollout purposes.” They still claim no personal data is collected, and that they “won’t give these videos to anyone else” beyond that Motto/promo use. ([motto.io legal + allow-camera copy](https://www.motto.io/))

---

## How clips re-enter the story

AATOAA / press kit: Motto uses “an ingenious, hidden logic to weave these videos into its narrative, letting the viewers’ own images become stand-ins for the narrator’s daydreams and mementos.” Clips “reappear in surprising and even emotional ways.” ([AATOAA](https://www.aatoaa.com/motto); [press kit](https://mediaspace.nfb.ca/motto))

**Delay.** Clips are not meant to bounce back immediately. Caroline Robert: it is “much more interesting for user videos not to appear in the program right away, but much later.” “The contributions of the users become, in a way, the project’s memory.” Example: draw wind on paper; the clip “will take on a completely different meaning in another context.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) Seeing your own shots later is what attaches people to the experience. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Your clip among others.** Chapter scripts mix `user/…` (this participant’s take) with `others/…` (the pool). Example after toes: a montage of `user/toes` plus several `others/toes`. If the toes prompt was skipped, the same line (“YES, you are saying (with your toes)”) plays on `others/toes` only. After “close a door,” Motto plays `user/door_close` then `others/door_close`. Chapter 4 still calls `user/door_open` and `user/door_close` from earlier. ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json), [`tasks_in4.json`](https://www.motto.io/data/tasks_in4.json))

**Meaning is editorial, not literal.** Michaels: clips seemed “memory-like, or symbolic. Repeated clips seemed like a refrain.” Absence is the story’s hinge — videos are treated as already-gone, like photographs. “You never really show what you’re talking about, you only suggest it.” The team compared the edit to Kuleshov / a card game: 1+1=3. ([Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/); [case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Bins and labels, not live AI edit.** Videos are categorized so they can be summoned like words (“animals,” “hands,” “sky,” “dance,” plus abstract labels like “beauty,” “loneliness,” “endings”). Human curation does the “montage intelligent.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/); [Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/)) Press kit: custom curation system plus live analysis. ([press kit](https://mediaspace.nfb.ca/motto))

**Seed bank.** Motto was seeded before strangers arrived: Morisset and Robert’s archives; temporary internet/YouTube clips meant to be replaced; museum shoots (Canadian Museum of Nature, Neues Museum); Chile (Mano de Desierto). Credits list archive sources (BAnQ, NASA Apollo, Met, Wikimedia, Storyful, etc.) and named “First contributions.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/); [motto.io credits](https://www.motto.io/); [press kit](https://mediaspace.nfb.ca/motto)) Press kit: the team “seeded the work with its own collection of videos, including a handful of startling set pieces”; the piece is “growing larger every day.” ([press kit](https://mediaspace.nfb.ca/motto))

**Moderation.** “All of the videos uploaded to Motto are, of course, subject to a regular and manual curation.” Some are “permanently added to the image bank”; others “are only visible to their authors.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) Cookies are what make *your* clip reappear for you even before (or without) joining the public bank. ([motto.io legal](https://www.motto.io/))

**Effects around clips.** Split-screen mirror as “doors opening” into September’s world, and as a “chorus or as a theme song before each new chapter.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) Chapter 1 opens on a palindromic water montage titled “montage-mirror.” ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))

---

## Chapter shape

**Six discrete chapters, one linear story.** Press kit: 2020, “6 × 15 min,” “interactive website for your phone,” “hour-plus,” “told in episodes.” ([press kit](https://mediaspace.nfb.ca/motto)) Classic narrative shape: setup, conflict, climax, resolution. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) Michaels: it could not be “random morsels”; it needed beginning, middle, and end, or the playful tone would feel like popcorn. ([Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/))

**Titles in Motto’s English menu / locale** ([motto.io](https://www.motto.io/)):

| # | Title |
|---|--------|
| 1 | Motto |
| 2 | Fallen Star (locale also has `in2_alt`: “Chairs of the World”) |
| 2½ | Fallen Star in the HTML menu; locale names the outdoor counterpart `out2`: “Such Nice Garbage” |
| 3 | Unusual Friends |
| 4 | Sourdough |
| 5 | The Mind of September |
| 6 | All Saxophones |

Chapter 5 is named in the case study as well: “The Mind of September,” after the fight between the ghost and Motto following September’s “disappearance.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Story spine (first-party, not a full synopsis).** A nameless narrator; a ghost friend named September who “can walk through walls” and has gone missing. Geography in the synopsis: Québécois countryside, Chilean desert, banks of the Nile. Chile / Mano de Desierto is a structural set piece (hands, keys in sand; where narrator and September meet). ([motto.io synopsis](https://www.motto.io/); [case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) Opening of chapter 1 (indoor script): welcome; Motto “tells a story using a gigantic collection of tiny videos”; name joke (“lotto” / “Oh yes, I thought so!”); then the camera tutorial. ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))

**Chapter 1 is onboarding.** Guide gently, take people by the hand, make the participatory stake clear without a harsh hook that would lose them. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Menu vs flow.** Chapters can be opened from “All Chapters” once unlocked; Restart wipes. Chapter cards use a mirrored water montage as a refrain. ([motto.io HTML](https://www.motto.io/); [case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

**Languages.** English and French. ([press release](https://mediaspace.nfb.ca/comm/discover-vincent-morissets-motto-nfb-an-interactive-experience-exclusively-for-your-phone-available-as-of-now-at-motto-io/)) French adaptation: Catherine Leroux (credits on [motto.io/fr](https://www.motto.io/fr)). Locale switches EN/FR in the menu.

**Not six isolated shorts.** The team considered a podcast-like series of unconnected episodes and rejected it in favor of one arc. ([Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/); [case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

---

## Indoor vs outdoor

Participants can take Motto “inside their homes or out in the world, their phone in hand.” ([press release](https://mediaspace.nfb.ca/comm/discover-vincent-morissets-motto-nfb-an-interactive-experience-exclusively-for-your-phone-available-as-of-now-at-motto-io/); [press kit](https://mediaspace.nfb.ca/motto))

Indoor vs outdoor is not flavor text. “The user’s location (in a kitchen, on a balcony, on the street and, more fundamentally, inside or outside) is pivotal to every prompt.” Chapters were “often doubled-up, with different play experiences depending on whether the user is inside or outside.” ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/); [Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/))

**Chooser copy (chapter 1).** Default: “Are you outside, or indoors—right now?” with “I’m indoors” / “I’m outside,” plus “Motto doesn’t work very well inside a vehicle.” A gated branch: “For now, Motto only works if you’re indoors. We’ll unlock the outdoor option a bit later.” ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))

**Separate scripts.** Motto publishes indoor and outdoor task files for chapters 1–4 (`tasks_in1` / `tasks_out1` … `tasks_in4` / `tasks_out4`). Chapter 2’s outdoor title in the locale is “Such Nice Garbage” vs indoor “Fallen Star.” Menu actions: Read / Continue / Restart **inside** or **outside**. Continue-later can offer both directions. ([motto.io](https://www.motto.io/))

**COVID.** The case study: in spring 2020 “only three lines of text required tweaking” for global confinement — evidence they had aimed at both home and world from the start. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))

---

## Skip vs contribute

Contribute is invited, not a silent requirement for every prompt — but camera *access* is required to proceed, and skipping is written as a lesser path.

**Contribute.** “You can contribute to the story even as you explore it.” ([press kit](https://mediaspace.nfb.ca/motto)) Creators treat uploads “as a gift”; no specific quantitative engagement quota. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/)) NFB Pause line (NFB film page): “It’s like a gift exchange. People give us a small part of themselves, and in return we give them an experience that’s truly different and unique.” ([NFB Pause with Vincent Morisset and Sean Michaels](https://www.nfb.ca/film/nfb-pause-sean-michaels-vincent-morisset/))

**Skip is a real control.** Record views include an X. Chapter 1 tells skippers (then hides the hint once they have skipped): “If you ever want to skip a task, just hit X.” First skip of “Show me anything” is not a free pass: “Are you sure you want to skip recording this video?” then the prompt repeats. Skip twice and the narrator scolds: “OK, you skipped it.” / “You can skip any videos you want, but your experience of Motto will be diminished.” / “It won’t really work.” / “It’s like skydiving with your eyes closed” / “or sitting through a dance party.” Then it still asks for something square. Toes skip: “C’mon, give them a wiggle…” then “Suit yourself.” Face skip: strangers’ boxed faces, then a second hello, then “That’s OK. Maybe later.” ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))

**If you skip, the story continues with the pool.** Montages that would have led with `user/…` fall back to `others/…`. Chapter 4, if you skip showing an object: “Fine. We’ll imagine this is what you picked up.” ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json), [`tasks_in4.json`](https://www.motto.io/data/tasks_in4.json))

**Camera refuse ≠ skip.** Refusing camera access is a hard stop until the participant grants it (or fixes Settings). Motto still says it will not submit videos without permission. ([motto.io camera-refused copy](https://www.motto.io/))

**Redo is not skip.** After a take, OK keeps it; the backwards arrow redoes it. ([`tasks_in1.json` confirmMessage](https://www.motto.io/data/tasks_in1.json))

---

## Copy-or-drop notes

Facts a later ticket would have to copy, shrink, or deliberately drop — not recommendations.

- **Mobile web, not a store app.** Portrait phone browser; desktop is a bounce; can add to home screen. ([motto.io](https://www.motto.io/); [case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))
- **No accounts, no likes/comments/follower counts.** Cookies hold progress and *your* clips; legal claims no personal data. ([motto.io legal](https://www.motto.io/))
- **Camera is the interface.** Short tap-to-record, auto-stop, keep/redo, little chrome, no tutorial screen. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/); [`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))
- **Camera permission vs clip permission.** Must allow camera to continue; each clip can still be skipped; NFB gets image rights on what is captured for Motto + promo. ([motto.io legal + refused copy](https://www.motto.io/))
- **No audio recorded** by Motto; optional personal music from another app in at least chapter 2. ([motto.io](https://www.motto.io/); [`tasks_in2.json`](https://www.motto.io/data/tasks_in2.json))
- **Easy, commonplace prompts** that use the room you are in; chapter 1 teaches the loop before the story deepens. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))
- **Indoor and outdoor as different play experiences**, not one script; explicit chooser; vehicles discouraged. ([Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/); [`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))
- **Six ~15-minute chapters, one linear ghost story**, EN/FR, September’s gender randomized. ([press kit](https://mediaspace.nfb.ca/motto); [Michaels](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/))
- **Box over the eyes**, sometimes with writing on the box; no recognizable faces. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))
- **Delayed re-entry:** your clip stored, labeled into a bin, mixed later with `others/`, sometimes only visible to you until curated into the public bank. Seeded so it works before the crowd arrives. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/); [motto.io legal](https://www.motto.io/))
- **Skip exists but is narrated against;** the story still has a next beat. ([`tasks_in1.json`](https://www.motto.io/data/tasks_in1.json))
- **Hidden editorial logic** (Kuleshov, bins, human moderation) rather than a public algorithm or a social rank. AI montage largely dropped. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))
- **Mirror / chorus montages** between chapters; live analysis for a few gestures. ([case study](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/))
- **Book-like pause:** welcome back, continue later, private-mode warning, Restart wipes clips and progress. ([motto.io locale](https://www.motto.io/))
- **Scale Motto has that a one-chapter clone would not automatically have:** six chapters, thousands of clips, Chile/museum set pieces, bilingual random-gender ghost, manual moderation pipeline, promotional image-rights grant.
- **Not observed live:** the exact feel of keep/redo/skip on a real camera, how often the outdoor gate is still locked, chapters 5–6 prompt-by-prompt, or how the public pool looks in 2026 versus 2020.

---

## Sources (primary)

1. [https://www.motto.io/](https://www.motto.io/) — About, legal notices, credits, portrait warning, chapter menu, locale strings; chapter task files under `/data/tasks_in1.json`–`tasks_out4.json` (and French `tasks_in1_fr.json`). Desktop/camera/continue-later copy lives in the site’s English locale.
2. [https://www.motto.io/fr](https://www.motto.io/fr) — French About/legal; Catherine Leroux listed for French adaptation.
3. [https://www.aatoaa.com/motto](https://www.aatoaa.com/motto) — Studio page; “Launch motto.io on mobile”; user-experience paragraph (scavenger hunt, hidden logic, anonymity, pool of collective memory).
4. [https://mediaspace.nfb.ca/motto](https://mediaspace.nfb.ca/motto) — NFB press kit (also [epk/motto](https://mediaspace.nfb.ca/epk/motto)): 6 × 15 min, long synopsis, About the User Experience, About the Technology.
5. [NFB press release, 28 May 2020](https://mediaspace.nfb.ca/comm/discover-vincent-morissets-motto-nfb-an-interactive-experience-exclusively-for-your-phone-available-as-of-now-at-motto-io/) — Phone-only, free, six chapters, indoor or outdoor, EN/FR.
6. [NFB case study, 30 Nov 2020](https://blog.nfb.ca/blog/2020/11/30/motto-case-study/) — Making-of: camera as interface, cookies-adjacent progress, face box, delayed re-entry, bins, moderation, indoor/outdoor, chapter 5 title, no tutorial, web not app.
7. [Sean Michaels, NFB Blog, 8 June 2020](https://blog.nfb.ca/blog/2020/06/08/motto-making-magic-and-sharing-secrets/) — Writer’s first-party account: one story vs shorts, doubled inside/outside chapters, 50/50 September gender, prompt examples, face-masking as the CV that survived.
8. [NFB Pause with Vincent Morisset and Sean Michaels](https://www.nfb.ca/film/nfb-pause-sean-michaels-vincent-morisset/) — NFB page; “gift exchange” line.
