/**
 * Question: does a procedural cut of many strangers answering one ask read as
 * scale, or as a shuffle?
 */

import type { PoolClip } from './bin'

export type Cut = { src: string; ms: number; line?: string; mine: boolean }

/** Cuts held back from the acceleration so the montage can land instead of stop. */
const TAIL = 2

function cutMs(i: number, n: number): number {
  const body = Math.max(n - TAIL, 1)
  if (i < body) {
    const t = body === 1 ? 0 : i / (body - 1)
    return Math.round(1000 - 560 * t)
  }
  return i === body ? 900 : 2000
}

/**
 * Strangers ordered along the gradient. The participant's own takes splice
 * unmarked into the fast stretch, late enough to jolt, never in the tail.
 * The tail belongs to whoever carries the Line.
 */
export function buildMontage(pool: PoolClip[], mine: string[]): Cut[] {
  const cuts: Cut[] = [...pool]
    .sort((a, b) => a.gradient - b.gradient)
    .map((c) => ({ src: c.src, line: c.line, mine: false, ms: 0 }))

  const body = Math.max(cuts.length - TAIL, 0)
  mine.forEach((src, k) => {
    const at = Math.min(Math.round(body * (0.62 + k * 0.14)), body)
    cuts.splice(at + k, 0, { src, mine: true, ms: 0 })
  })

  return cuts.map((c, i, all) => ({
    ...c,
    ms: cutMs(i, all.length),
    line: i === all.length - 1 ? c.line : undefined,
  }))
}
