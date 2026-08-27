import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

const POOL = /^[a-z0-9-]+$/

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const parsed = clientPayload ? (JSON.parse(clientPayload) as { pool?: string }) : {}
        const pool = parsed.pool ?? ''
        if (!POOL.test(pool)) throw new Error('unknown pool')
        return {
          allowedContentTypes: ['video/webm', 'video/mp4', 'video/quicktime'],
          addRandomSuffix: true,
          maximumSizeInBytes: 8 * 1024 * 1024,
          tokenPayload: JSON.stringify({ pool }),
        }
      },
      onUploadCompleted: async () => {},
    })
    return Response.json(json)
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 })
  }
}
