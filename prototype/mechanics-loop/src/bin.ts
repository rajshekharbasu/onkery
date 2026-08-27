/**
 * Optional seed clips only. Live takes never go in the repo. OK on a take
 * writes it to this phone and uploads it into the shared pool for that ask.
 *
 * Optional `line` keyed by src, for a clip shown alone or last in a montage.
 */

import { FILES } from 'virtual:onkery-bin'

export type PoolClip = {
  src: string
  gradient: number
  line?: string
}

/** Optional interior text, keyed by `/bin/{relation}/{file}.mp4`. */
export const LINES: Record<string, string> = {}

export const POOL: Record<string, PoolClip[]> = Object.fromEntries(
  Object.entries(FILES).map(([relation, clips]) => [
    relation,
    clips.map((c) => ({ ...c, line: LINES[c.src] })),
  ]),
)

/**
 * Empty pool means no montage, so this plays from your own takes instead.
 * That tests the cut rhythm. It does not test scale. Turn off once the bin
 * is filmed.
 */
export const MONTAGE_FROM_OWN_TAKES = true

export function poolFor(bin: string | undefined): PoolClip[] {
  return bin ? (POOL[bin] ?? []) : []
}
