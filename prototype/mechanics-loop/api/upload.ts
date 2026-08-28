import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { catalogAdd } from '../lib/catalog'
import { isPoolId, poolFromJson } from '../lib/pool-id'

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const pool = poolFromJson(clientPayload)
        if (!pool) throw new Error('unknown pool')
        return {
          allowedContentTypes: ['video/webm', 'video/mp4', 'video/quicktime'],
          addRandomSuffix: true,
          maximumSizeInBytes: 8 * 1024 * 1024,
          tokenPayload: JSON.stringify({ pool }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const pool = poolFromJson(tokenPayload)
        if (!isPoolId(pool)) throw new Error('unknown pool')
        await catalogAdd({ pool, url: blob.url, uploadedAt: Date.now() })
      },
    })
    return Response.json(json)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'upload failed'
    console.error('upload failed', { message })
    return Response.json({ error: message }, { status: 400 })
  }
}
