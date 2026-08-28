import { del, list } from '@vercel/blob'
import { Redis } from '@upstash/redis'
import { KEEP, SAMPLE } from './limits'
import { isPoolId, poolFromPathname } from './pool-id'

const POOLS = 'onkery:pools'
const EMPTY_TTL_SEC = 60 * 60

type Clip = { url: string; at: number }

let redis: Redis | null | undefined

function getRedis(): Redis | null {
  if (redis !== undefined) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  redis = url && token ? new Redis({ url, token }) : null
  return redis
}

function poolKey(pool: string): string {
  return `onkery:pool:${pool}`
}

function emptyKey(pool: string): string {
  return `onkery:empty:${pool}`
}

function asUrls(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const left = a[i]
    const right = a[j]
    if (left === undefined || right === undefined) continue
    a[i] = right
    a[j] = left
  }
  return a
}

async function listPool(pool: string): Promise<Clip[]> {
  const { blobs } = await list({ prefix: `pool/${pool}/`, limit: 100 })
  return blobs.map((b) => ({ url: b.url, at: b.uploadedAt.getTime() }))
}

async function indexPool(client: Redis, pool: string, clips: Clip[]): Promise<void> {
  await client.del(poolKey(pool))
  const first = clips[0]
  if (!first) {
    await client.srem(POOLS, pool)
    await client.set(emptyKey(pool), '1', { ex: EMPTY_TTL_SEC })
    return
  }
  await client.zadd(
    poolKey(pool),
    { score: first.at, member: first.url },
    ...clips.slice(1).map((c) => ({ score: c.at, member: c.url })),
  )
  await client.sadd(POOLS, pool)
  await client.del(emptyKey(pool))
}

export async function catalogAdd(input: { pool: string; url: string; uploadedAt: number }): Promise<void> {
  const client = getRedis()
  if (!client) return
  await client.zadd(poolKey(input.pool), { score: input.uploadedAt, member: input.url })
  await client.sadd(POOLS, input.pool)
  await client.del(emptyKey(input.pool))
}

export async function catalogSample(pool: string): Promise<string[]> {
  const client = getRedis()
  if (!client) {
    return shuffle(await listPool(pool))
      .slice(0, SAMPLE)
      .map((c) => c.url)
  }
  if (await client.exists(emptyKey(pool))) return []
  const cached = asUrls(await client.zrange(poolKey(pool), 0, -1))
  if (cached.length) return shuffle(cached).slice(0, SAMPLE)
  const clips = await listPool(pool)
  await indexPool(client, pool, clips)
  return shuffle(clips)
    .slice(0, SAMPLE)
    .map((c) => c.url)
}

async function deleteUrls(urls: string[]): Promise<void> {
  for (let i = 0; i < urls.length; i += 100) {
    const batch = urls.slice(i, i + 100)
    if (batch.length) await del(batch)
  }
}

export async function decayPools(): Promise<{ kept: number; removed: number }> {
  const byPool = new Map<string, Clip[]>()
  let cursor: string | undefined
  do {
    const page = await list({ prefix: 'pool/', cursor, limit: 250 })
    for (const blob of page.blobs) {
      const pool = poolFromPathname(blob.pathname)
      if (!pool) continue
      const rows = byPool.get(pool) ?? []
      rows.push({ url: blob.url, at: blob.uploadedAt.getTime() })
      byPool.set(pool, rows)
    }
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)

  let kept = 0
  let removed = 0
  const live = new Set<string>()
  const client = getRedis()

  for (const [pool, rows] of byPool) {
    if (!isPoolId(pool)) continue
    rows.sort((a, b) => b.at - a.at)
    const keep = rows.slice(0, KEEP)
    const drop = rows.slice(KEEP)
    if (drop.length) await deleteUrls(drop.map((c) => c.url))
    if (client) await indexPool(client, pool, keep)
    if (keep.length) live.add(pool)
    kept += keep.length
    removed += drop.length
  }

  if (client) {
    const previous = asUrls(await client.smembers(POOLS))
    for (const pool of previous) {
      if (live.has(pool)) continue
      await client.del(poolKey(pool))
      await client.srem(POOLS, pool)
    }
  }

  return { kept, removed }
}
