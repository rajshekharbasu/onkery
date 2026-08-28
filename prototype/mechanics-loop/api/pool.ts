import { catalogSample } from '../lib/catalog'
import { isPoolId } from '../lib/pool-id'

export async function GET(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get('id') ?? ''
  if (!isPoolId(id)) return Response.json({ urls: [] })
  try {
    return Response.json({ urls: await catalogSample(id) })
  } catch (err) {
    console.error('pool sample failed', { id, err: err instanceof Error ? err.message : 'unknown' })
    return Response.json({ urls: [] })
  }
}
