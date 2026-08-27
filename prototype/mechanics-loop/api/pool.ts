import { list } from '@vercel/blob'

const POOL = /^[a-z0-9-]+$/

export async function GET(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get('id') ?? ''
  if (!POOL.test(id)) return Response.json({ urls: [] })
  const { blobs } = await list({ prefix: `pool/${id}/`, limit: 100 })
  return Response.json({ urls: blobs.map((b) => b.url) })
}
