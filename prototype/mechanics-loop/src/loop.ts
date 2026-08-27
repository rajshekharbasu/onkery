/**
 * Question: can session one hold as one stranger answering an ask, then
 * many at once, then a slow Opener, then one last film?
 */

import { FRAME, HOLD, LAST_ASK, dealSitting, getSitting, type FilmAsk, type Place } from './opener'

export type { Place }
export type OpenerBeat = 0 | 1
export type RecordPhase = 'ready' | 'recording' | 'review'

export type Step =
  | { name: 'welcome' }
  | { name: 'grant' }
  | { name: 'chooser' }
  | { name: 'denied' }
  | { name: 'teach'; place: Place }
  | { name: 'ready'; place: Place; i: number }
  | { name: 'recording'; place: Place; i: number }
  | { name: 'review'; place: Place; i: number }
  | { name: 'between'; place: Place; i: number; text: string }
  | { name: 'montage'; place: Place; i: number; coda?: boolean }
  | { name: 'frame'; place: Place; i: number }
  | { name: 'opener'; place: Place; beat: OpenerBeat }
  | { name: 'hold'; place: Place; i: number }
  | { name: 'coda'; place: Place; phase: RecordPhase }
  | { name: 'leave'; place: Place }

export type Action =
  | { type: 'choose'; place: Place }
  | { type: 'denyCamera' }
  | { type: 'next' }
  | { type: 'tap' }
  | { type: 'autoStop' }
  | { type: 'keep' }
  | { type: 'redo' }
  | { type: 'skip' }
  | { type: 'seen' }
  | { type: 'again' }

export const RECORD_MS = 2000

export function openerLine(): string | undefined {
  return getSitting().opener.line
}

export function openerAsk(): string {
  return getSitting().opener.ask
}

export function openerSrc(): string | undefined {
  return getSitting().opener.src
}

export function frameLine(i: number): string {
  return FRAME[i] ?? FRAME[0]
}

export function holdLine(i: number): string {
  return HOLD[i] ?? HOLD[0]
}

export function lastAsk(_place: Place): string {
  return LAST_ASK
}

export function filmAsks(place: Place): FilmAsk[] {
  return getSitting().asks[place]
}

export function filmAsk(place: Place, i: number): FilmAsk {
  return filmAsks(place)[i] ?? filmAsks(place)[0]
}

export function initial(): Step {
  return { name: 'welcome' }
}

function advanceHunt(place: Place, i: number): Step {
  if (i + 1 < filmAsks(place).length) return { name: 'ready', place, i: i + 1 }
  return { name: 'frame', place, i: 0 }
}

function postAsk(place: Place, i: number, stage: PostStage, _skipped = false): Step {
  if (stage !== 'montage') return { name: 'montage', place, i }
  return advanceHunt(place, i)
}

/**
 * After an ask resolves, the next screen is the montage for that ask.
 */
type PostStage = 'ask' | 'between' | 'meet' | 'montage'

function afterHunt(place: Place, i: number, skipped: boolean): Step {
  return postAsk(place, i, 'ask', skipped)
}

export function reduce(state: Step, action: Action): Step {
  switch (state.name) {
    case 'welcome':
      if (action.type === 'next') return { name: 'grant' }
      return state
    case 'grant':
      if (action.type === 'next') return { name: 'chooser' }
      if (action.type === 'denyCamera') return { name: 'denied' }
      return state
    case 'chooser':
      if (action.type === 'choose') {
        dealSitting(action.place)
        return { name: 'teach', place: action.place }
      }
      if (action.type === 'denyCamera') return { name: 'denied' }
      return state
    case 'denied':
      if (action.type === 'again') return { name: 'grant' }
      return state
    case 'teach':
      if (action.type === 'next') return { name: 'ready', place: state.place, i: 0 }
      return state
    case 'ready':
      if (action.type === 'tap') return { name: 'recording', place: state.place, i: state.i }
      if (action.type === 'skip') return afterHunt(state.place, state.i, true)
      return state
    case 'recording':
      if (action.type === 'autoStop') return { name: 'review', place: state.place, i: state.i }
      if (action.type === 'skip') return afterHunt(state.place, state.i, true)
      return state
    case 'review':
      if (action.type === 'keep') return afterHunt(state.place, state.i, false)
      if (action.type === 'redo') return { name: 'ready', place: state.place, i: state.i }
      if (action.type === 'skip') return afterHunt(state.place, state.i, true)
      return state
    case 'between':
      if (action.type === 'next') return postAsk(state.place, state.i, 'between')
      return state
    case 'montage':
      if (action.type !== 'next' && action.type !== 'seen') return state
      if (state.coda) return { name: 'leave', place: state.place }
      return postAsk(state.place, state.i, 'montage')
    case 'frame':
      if (action.type !== 'next') return state
      if (state.i + 1 < FRAME.length) return { name: 'frame', place: state.place, i: state.i + 1 }
      return { name: 'opener', place: state.place, beat: 0 }
    case 'opener':
      if (action.type !== 'seen' && action.type !== 'next') return state
      if (state.beat < 1) return { name: 'opener', place: state.place, beat: 1 }
      return { name: 'hold', place: state.place, i: 0 }
    case 'hold':
      if (action.type !== 'next') return state
      if (state.i + 1 < HOLD.length) return { ...state, i: state.i + 1 }
      return { name: 'coda', place: state.place, phase: 'ready' }
    case 'coda':
      if (state.phase === 'ready') {
        if (action.type === 'tap') return { ...state, phase: 'recording' }
        if (action.type === 'skip') return { name: 'leave', place: state.place }
        return state
      }
      if (state.phase === 'recording') {
        if (action.type === 'autoStop') return { ...state, phase: 'review' }
        if (action.type === 'skip') return { name: 'leave', place: state.place }
        return state
      }
      if (action.type === 'keep') return { name: 'montage', place: state.place, i: 0, coda: true }
      if (action.type === 'skip') return { name: 'leave', place: state.place }
      if (action.type === 'redo') return { ...state, phase: 'ready' }
      return state
    case 'leave':
      if (action.type === 'again') return { name: 'chooser' }
      return state
  }
}
