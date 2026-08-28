import { decayPools } from '../lib/catalog'

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  try {
    const result = await decayPools()
    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'decay failed'
    console.error('decay failed', { message })
    return Response.json({ error: message }, { status: 500 })
  }
}
