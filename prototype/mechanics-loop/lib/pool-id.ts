const POOL_ID = /^[a-z0-9-]+$/
const PATH = /^pool\/([a-z0-9-]+)\//

export function isPoolId(value: unknown): value is string {
  return typeof value === 'string' && POOL_ID.test(value)
}

export function poolFromPathname(pathname: string): string | null {
  const match = PATH.exec(pathname)
  const id = match?.[1]
  return id && isPoolId(id) ? id : null
}

export function poolFromJson(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw === '') return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || !('pool' in parsed)) return null
    return isPoolId(parsed.pool) ? parsed.pool : null
  } catch {
    return null
  }
}
