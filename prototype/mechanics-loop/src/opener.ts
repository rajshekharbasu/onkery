/**
 * Named flows on the relation ring, plus the opener slot.
 * Unused asks stay listed so the inventory is complete; they are not dealt.
 */

export type Place = 'inside' | 'outside'

export type Relation = 'keeping' | 'delay' | 'residue' | 'justdone'

export type FlowId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export type FilmAsk = {
  id: string
  ask: string
  relation: Relation | 'teach' | 'coda'
  caption: string
  pool: string
  teach?: boolean
  after?: string
  bin?: string
  montage?: string
}

export type Opener = {
  id: string
  ask: string
  relation: Relation
  pool: string
  src?: string
  line?: string
}

export const FRAME = ['Someone else was asked this too.']

export const HOLD = ['Your turn.']

export const LAST_ASK = 'Show me yours.'

export const RING: Relation[] = ['keeping', 'delay', 'residue', 'justdone']

export const WELCOME = {
  title: 'This is Onkery.',
  lead: 'You film small things from where you are.',
  next: 'Continue',
}

export const BRIEF = {
  lines: [
    'You get directions to take a video.',
    'Then you see how strangers answered.',
    'No names. Your videos stay inside Onkery.',
  ],
  next: 'Continue',
}

export const GRANT = {
  ask: 'Onkery needs the camera.',
  hint: 'Nothing is recorded until you press the shutter.',
  allow: 'Allow camera',
}

export const RECORD_HINT = 'Tap the button to record a short video.'

export const THANKS = 'Thank you for being a part of Onkery.'

const TEACH: Record<Place, FilmAsk> = {
  inside: {
    id: 'teach-in',
    ask: 'Show me anything.',
    relation: 'teach',
    caption: 'anything',
    pool: 'anything',
    teach: true,
  },
  outside: {
    id: 'teach-out',
    ask: 'Show me anything.',
    relation: 'teach',
    caption: 'anything',
    pool: 'anything',
    teach: true,
  },
}

type RelAsk = FilmAsk & { relation: Relation }

const ASK = {
  'in-delay-care': {
    id: 'in-delay-care',
    relation: 'delay' as const,
    pool: 'in-delay-care',
    caption: 'meaning to',
    ask: 'Show me something you keep meaning to take care of. Do not touch it.',
  },
  'in-res-used': {
    id: 'in-res-used',
    relation: 'residue' as const,
    pool: 'in-res-used',
    caption: 'still out',
    ask: 'Show me the last thing you used and did not put away.',
  },
  'in-res-mess': {
    id: 'in-res-mess',
    relation: 'residue' as const,
    pool: 'in-res-mess',
    caption: 'a mess',
    ask: 'Show me a mess you made.',
  },
  'in-keep-sit': {
    id: 'in-keep-sit',
    relation: 'keeping' as const,
    pool: 'in-keep-sit',
    caption: 'next to you',
    ask: 'Show me what sits next to where you sit.',
  },
  'in-just-doing': {
    id: 'in-just-doing',
    relation: 'justdone' as const,
    pool: 'in-just-doing',
    caption: 'in the middle',
    ask: 'Show me what you were just doing. Do not set it up.',
  },
  'out-delay-left': {
    id: 'out-delay-left',
    relation: 'delay' as const,
    pool: 'out-delay-left',
    caption: 'left behind',
    ask: 'Show me something out here that has been left.',
  },
  'out-delay-wait': {
    id: 'out-delay-wait',
    relation: 'delay' as const,
    pool: 'out-delay-wait',
    caption: 'waiting rn',
    ask: 'Show me something that looks like it is waiting.',
  },
  'out-res-someone': {
    id: 'out-res-someone',
    relation: 'residue' as const,
    pool: 'out-res-someone',
    caption: 'someone left',
    ask: 'Show me something someone left.',
  },
  'out-keep-not': {
    id: 'out-keep-not',
    relation: 'keeping' as const,
    pool: 'out-keep-not',
    caption: 'not yours',
    ask: 'Show me something out here that is not yours.',
  },
  'out-keep-brought': {
    id: 'out-keep-brought',
    relation: 'keeping' as const,
    pool: 'out-keep-brought',
    caption: 'brought with',
    ask: 'Show me something you brought with you.',
  },
  'out-just-weather': {
    id: 'out-just-weather',
    relation: 'justdone' as const,
    pool: 'out-just-weather',
    caption: 'the weather',
    ask: 'Show me the weather you have been under.',
  },
} satisfies Record<string, RelAsk>

/** Listed in the prompts inventory. Not dealt. */
export const UNUSED_ASKS: FilmAsk[] = [
  { id: 'in-delay-sit', relation: 'delay', pool: 'in-delay-sit', caption: 'sitting there', ask: 'Show me something that has been sitting there.' },
  { id: 'in-delay-unfinished', relation: 'delay', pool: 'in-delay-unfinished', caption: 'unfinished', ask: 'Show me something unfinished.' },
  { id: 'in-res-out', relation: 'residue', pool: 'in-res-out', caption: 'still out', ask: 'Show me something that is still out from earlier.' },
  { id: 'in-keep-near', relation: 'keeping', pool: 'in-keep-near', caption: 'nearby', ask: 'Show me something you keep nearby.' },
  { id: 'in-keep-not', relation: 'keeping', pool: 'in-keep-not', caption: 'not yours', ask: 'Show me something here that is not yours.' },
  { id: 'in-just-hands', relation: 'justdone', pool: 'in-just-hands', caption: 'last touched', ask: 'Show me the last thing your hands were on.' },
  { id: 'in-just-stood', relation: 'justdone', pool: 'in-just-stood', caption: 'where you were', ask: 'Show me where you were standing before this.' },
  { id: 'out-res-trash', relation: 'residue', pool: 'out-res-trash', caption: 'garbage', ask: 'Show me some garbage.' },
  { id: 'out-just-feet', relation: 'justdone', pool: 'out-just-feet', caption: 'underfoot', ask: "Show me what's under your feet." },
  { id: 'out-just-moving', relation: 'justdone', pool: 'out-just-moving', caption: 'moving', ask: 'Show me something moving that is not you.' },
  { id: 'out-just-before', relation: 'justdone', pool: 'out-just-before', caption: 'before you stopped', ask: 'Show me where you were before you stopped.' },
]

const PLANT: Opener = {
  id: 'op-delay-care',
  relation: 'delay',
  ask: ASK['in-delay-care'].ask,
  pool: ASK['in-delay-care'].pool,
  src: '/opener.mp4',
  line: "I'll get to it",
}

type Flow = {
  id: FlowId
  place: Place
  a: RelAsk
  b: RelAsk
}

const FLOWS: Record<FlowId, Flow> = {
  A: { id: 'A', place: 'inside', a: ASK['in-keep-sit'], b: ASK['in-delay-care'] },
  B: { id: 'B', place: 'inside', a: ASK['in-res-used'], b: ASK['in-delay-care'] },
  C: { id: 'C', place: 'inside', a: ASK['in-res-mess'], b: ASK['in-just-doing'] },
  D: { id: 'D', place: 'outside', a: ASK['out-just-weather'], b: ASK['out-keep-brought'] },
  E: { id: 'E', place: 'outside', a: ASK['out-keep-not'], b: ASK['out-delay-left'] },
  F: { id: 'F', place: 'outside', a: ASK['out-delay-wait'], b: ASK['out-res-someone'] },
}

export const CODA_ASK: FilmAsk = {
  id: 'yours',
  ask: LAST_ASK,
  relation: 'coda',
  caption: 'yours',
  pool: 'yours',
}

export type Sitting = {
  flow: FlowId
  place: Place
  asks: [FilmAsk, ...FilmAsk[]]
  opener: Opener
}

let sitting: Sitting = emptySitting()

function emptySitting(): Sitting {
  return {
    flow: 'A',
    place: 'inside',
    asks: [withBin(TEACH.inside)],
    opener: PLANT,
  }
}

function withBin(ask: FilmAsk): FilmAsk {
  return { ...ask, bin: ask.pool, montage: ask.pool }
}

function isRelation(rel: FilmAsk['relation']): rel is Relation {
  return rel === 'keeping' || rel === 'delay' || rel === 'residue' || rel === 'justdone'
}

function openerFor(flow: Flow): Opener {
  if (flow.id === 'A' || flow.id === 'B') return PLANT
  return { id: `op-${flow.b.id}`, relation: flow.b.relation, ask: flow.b.ask, pool: flow.b.pool }
}

function dealFlow(id: FlowId, teach: boolean): Sitting {
  const flow = FLOWS[id]
  const asks: [FilmAsk, ...FilmAsk[]] = teach
    ? [withBin(TEACH[flow.place]), withBin(flow.a), withBin(flow.b)]
    : [withBin(flow.a), withBin(flow.b)]
  sitting = {
    flow: id,
    place: flow.place,
    asks,
    opener: openerFor(flow),
  }
  return sitting
}

export function dealTrioStart(place: Place): Sitting {
  return dealFlow(place === 'inside' ? 'A' : 'D', true)
}

export function nextFlowId(id: FlowId): FlowId | undefined {
  if (id === 'A') return 'B'
  if (id === 'B') return 'C'
  if (id === 'D') return 'E'
  if (id === 'E') return 'F'
  return undefined
}

export function dealNextInTrio(): Sitting | undefined {
  const next = nextFlowId(sitting.flow)
  if (!next) return undefined
  return dealFlow(next, false)
}

export function getSitting(): Sitting {
  return sitting
}

export function sittingOpener(): Opener {
  return sitting.opener
}

export function askB(): FilmAsk {
  const filmed = sitting.asks.filter((a) => !a.teach)
  return filmed[filmed.length - 1] ?? sitting.asks[0]
}

export function codaAsk(): FilmAsk {
  const b = askB()
  return {
    ...CODA_ASK,
    relation: isRelation(b.relation) ? b.relation : 'coda',
    pool: b.pool,
    bin: b.pool,
    montage: b.pool,
  }
}

const ADJACENT: Record<Place, Record<Relation, Relation[]>> = {
  inside: {
    keeping: ['delay'],
    delay: ['keeping', 'residue'],
    residue: ['delay', 'justdone'],
    justdone: ['residue'],
  },
  outside: {
    justdone: ['keeping'],
    keeping: ['justdone', 'delay'],
    delay: ['keeping', 'residue'],
    residue: ['delay'],
  },
}

/**
 * Own pool first. If that is short, same-relation pools (any place),
 * then adjacent relations in this place. Inside does not wrap keeping
 * to justdone. Outside does not wrap residue to justdone.
 */
export function adjacentRelations(rel: Relation, place: Place): Relation[] {
  return ADJACENT[place][rel]
}

type Dealt = { place: Place; relation: Relation; pool: string }

const FLOW_IDS: FlowId[] = ['A', 'B', 'C', 'D', 'E', 'F']

function dealt(): Dealt[] {
  const out: Dealt[] = []
  for (const id of FLOW_IDS) {
    const flow = FLOWS[id]
    out.push({ place: flow.place, relation: flow.a.relation, pool: flow.a.pool })
    out.push({ place: flow.place, relation: flow.b.relation, pool: flow.b.pool })
  }
  return out
}

export function poolIdsForMontage(ask: FilmAsk, place: Place): string[] {
  if (!isRelation(ask.relation)) return [ask.pool]
  const all = dealt()
  const ids = [ask.pool]
  for (const row of all) {
    if (row.relation === ask.relation && row.pool !== ask.pool) ids.push(row.pool)
  }
  const adj = adjacentRelations(ask.relation, place)
  for (const row of all) {
    if (row.place === place && adj.includes(row.relation)) ids.push(row.pool)
  }
  return [...new Set(ids)]
}
