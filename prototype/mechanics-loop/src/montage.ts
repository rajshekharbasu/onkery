/**
 * Question: does a procedural cut of many strangers answering one ask read as
 * scale, or as a shuffle?
 */

import type { PoolClip } from './bin'

export type Cut = { src: string; ms: number; mine: boolean }

export const TAIL = 2
export const OTHER_MIN = 3
const CAP = 12

function cutMs(i: number, n: number): number {
  const body = Math.max(n - TAIL, 1)
  if (i < body) {
    const t = body === 1 ? 0 : i / (body - 1)
    return Math.round(1000 - 560 * t)
  }
  return i === body ? 900 : 2000
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Take at least three other people when the pool has them, cap at 12.
 * Own takes splice unmarked into the fast stretch.
 */
export function buildMontage(pool: PoolClip[], mine: string[]): Cut[] {
  const n = pool.length >= OTHER_MIN ? Math.min(CAP, pool.length) : pool.length
  const others = shuffle(pool).slice(0, n)
  const cuts: Cut[] = others.map((c) => ({ src: c.src, mine: false, ms: 0 }))
  const body = Math.max(cuts.length - TAIL, 0)
  mine.forEach((src, k) => {
    const at = Math.min(Math.round(body * (0.62 + k * 0.14)), body)
    cuts.splice(at + k, 0, { src, mine: true, ms: 0 })
  })
  return cuts.map((c, i, all) => ({ ...c, ms: cutMs(i, all.length) }))
}
