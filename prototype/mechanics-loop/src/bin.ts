/**
 * The pool for one sitting.
 *
 * Drop 1-2s opted-in .mp4 files in public/bin/{delay,residue,keeping,justdone}/
 * and redeploy. The build picks them up. Do not invent a Line for a clip that
 * has no real person behind it.
 *
 * Optional `line` keyed by src, for a clip shown alone or last in a montage.
 * `gradient` is filled from filename order (dark/still first if you sort that way).
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
