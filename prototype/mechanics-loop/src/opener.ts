/**
 * Slot for the curated-real Opener, plus the film-ask deck.
 * Replace an opener's src with a real opted-in fragment when you have one.
 */

export type Place = 'inside' | 'outside'

export type FilmAsk = {
  id: string
  ask: string
  relation: string
  teach?: boolean
  after?: string
  bin?: string
  montage?: string
}

export type Opener = {
  id: string
  ask: string
  relation: string
  src?: string
  line?: string
}

export const FRAME = ['Someone else was asked this too.']

export const HOLD = ['Your turn.']

export const LAST_ASK = 'Show me yours.'

export const WELCOME = {
  title: 'This is Onkery.',
  body: 'You film small things from where you are. Other people who were asked the same thing show you theirs.',
  trust: 'Your videos stay inside Onkery. They are not sold, not used to train anything, and not used for anything else. No audio.',
  next: 'Continue',
}

export const GRANT = {
  ask: 'Onkery needs the camera.',
  hint: 'Nothing is recorded until you press the shutter.',
  allow: 'Allow camera',
}

const TEACH: Record<Place, FilmAsk> = {
  inside: {
    id: 'teach-in',
    ask: 'Show me anything.',
    relation: 'teach',
    teach: true,
    after: 'There. You captured a clip.',
  },
  outside: {
    id: 'teach-out',
    ask: 'Show me anything.',
    relation: 'teach',
    teach: true,
    after: 'There. You captured a clip.',
  },
}

/**
 * Relation, not object class. Delay, residue, keeping, just-done.
 * Constraint at the end so they do not tidy for the camera.
 */
const DECK: Record<Place, FilmAsk[]> = {
  inside: [
    { id: 'in-delay-care', relation: 'delay', ask: 'Show me something you keep meaning to take care of. Do not touch it.' },
    { id: 'in-delay-sit', relation: 'delay', ask: 'Show me something that has been sitting there.' },
    { id: 'in-delay-unfinished', relation: 'delay', ask: 'Show me something unfinished.' },
    { id: 'in-res-used', relation: 'residue', ask: 'Show me the last thing you used and did not put away.' },
    { id: 'in-res-mess', relation: 'residue', ask: 'Show me a mess you made.' },
    { id: 'in-res-out', relation: 'residue', ask: 'Show me something that is still out from earlier.' },
    { id: 'in-keep-near', relation: 'keeping', ask: 'Show me something you keep nearby.' },
    { id: 'in-keep-not', relation: 'keeping', ask: 'Show me something here that is not yours.' },
    { id: 'in-keep-sit', relation: 'keeping', ask: 'Show me what sits next to where you sit.' },
    { id: 'in-just-doing', relation: 'justdone', ask: 'Show me what you were just doing. Do not set it up.' },
    { id: 'in-just-hands', relation: 'justdone', ask: 'Show me the last thing your hands were on.' },
    { id: 'in-just-stood', relation: 'justdone', ask: 'Show me where you were standing before this.' },
  ],
  outside: [
    { id: 'out-delay-left', relation: 'delay', ask: 'Show me something out here that has been left.' },
    { id: 'out-delay-wait', relation: 'delay', ask: 'Show me something that looks like it is waiting.' },
    { id: 'out-res-trash', relation: 'residue', ask: 'Show me some garbage.' },
    { id: 'out-res-someone', relation: 'residue', ask: 'Show me something someone left.' },
    { id: 'out-keep-not', relation: 'keeping', ask: 'Show me something out here that is not yours.' },
    { id: 'out-keep-brought', relation: 'keeping', ask: 'Show me something you brought with you.' },
    { id: 'out-just-weather', relation: 'justdone', ask: 'Show me the weather you have been under.' },
    { id: 'out-just-feet', relation: 'justdone', ask: "Show me what's under your feet." },
    { id: 'out-just-moving', relation: 'justdone', ask: 'Show me something moving that is not you.' },
    { id: 'out-just-before', relation: 'justdone', ask: 'Show me where you were before you stopped.' },
  ],
}

/**
 * Drawn per sitting. Only the delay plant has a clip today. Other openers
 * fall back to the live camera and show the ask, not a made-up Line.
 */
const OPENERS: Opener[] = [
  { id: 'op-delay-care', relation: 'delay', ask: 'Show me something you keep meaning to take care of. Do not touch it.', src: '/opener.mp4' },
  { id: 'op-delay-sit', relation: 'delay', ask: 'Show me something that has been sitting there.' },
  { id: 'op-res-used', relation: 'residue', ask: 'Show me the last thing you used and did not put away.' },
  { id: 'op-res-mess', relation: 'residue', ask: 'Show me a mess you made.' },
  { id: 'op-keep-near', relation: 'keeping', ask: 'Show me something you keep nearby.' },
  { id: 'op-keep-not', relation: 'keeping', ask: 'Show me something here that is not yours.' },
  { id: 'op-just-doing', relation: 'justdone', ask: 'Show me what you were just doing. Do not set it up.' },
  { id: 'op-just-hands', relation: 'justdone', ask: 'Show me the last thing your hands were on.' },
]

export type Sitting = {
  asks: Record<Place, FilmAsk[]>
  opener: Opener
}

const RECENT_KEY = 'onkery-recent-asks'

let sitting: Sitting = emptySitting()

function emptySitting(): Sitting {
  return {
    asks: {
      inside: [TEACH.inside],
      outside: [TEACH.outside],
    },
    opener: OPENERS[0],
  }
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function recentIds(): string[] {
  try {
    const raw = sessionStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function remember(ids: string[]) {
  try {
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(ids))
  } catch {
    /* private mode */
  }
}

function pickAsks(place: Place, recent: string[]): FilmAsk[] {
  const deck = DECK[place]
  const fresh = deck.filter((a) => !recent.includes(a.id))
  const source = fresh.length >= 2 ? fresh : deck
  const picked: FilmAsk[] = []
  for (const a of shuffle(source)) {
    if (picked.some((p) => p.relation === a.relation)) continue
    picked.push(a)
    if (picked.length === 2) break
  }
  if (picked.length < 2) {
    for (const a of shuffle(deck)) {
      if (picked.some((p) => p.id === a.id)) continue
      picked.push(a)
      if (picked.length === 2) break
    }
  }
  const a0 = { ...picked[0], bin: picked[0].relation }
  const a1 = { ...picked[1], bin: picked[1].relation, montage: a0.bin }
  return [TEACH[place], a0, a1]
}

function pickOpener(relation: string, recent: string[]): Opener {
  const unused = OPENERS.filter((o) => !recent.includes(o.id))
  const match = unused.filter((o) => o.relation === relation)
  const pool = match.length ? match : unused.length ? unused : OPENERS
  return shuffle(pool)[0]
}

export function dealSitting(place: Place): Sitting {
  const recent = recentIds()
  const asks = pickAsks(place, recent)
  const opener = pickOpener(asks[2]?.relation ?? 'delay', recent)
  sitting = {
    asks: {
      inside: place === 'inside' ? asks : [TEACH.inside],
      outside: place === 'outside' ? asks : [TEACH.outside],
    },
    opener,
  }
  remember([asks[1].id, asks[2].id, opener.id])
  return sitting
}

export function getSitting(): Sitting {
  return sitting
}

export function sittingOpener(): Opener {
  return sitting.opener
}
