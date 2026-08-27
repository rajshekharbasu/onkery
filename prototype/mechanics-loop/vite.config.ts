import basicSsl from '@vitejs/plugin-basic-ssl'
import { createReadStream, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, type Plugin } from 'vite'

const RELATIONS = ['delay', 'residue', 'keeping', 'justdone'] as const
const POOL_ID = /^[a-z0-9-]+$/
const POOL_FILE = /^[a-z0-9.-]+$/

function scanBin() {
  const files: Record<string, { src: string; gradient: number }[]> = {}
  for (const relation of RELATIONS) {
    const dir = join('public', 'bin', relation)
    const clips = existsSync(dir)
      ? readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.mp4')).sort()
      : []
    files[relation] = clips.map((name, i) => ({
      src: `/bin/${relation}/${name}`,
      gradient: clips.length <= 1 ? 0.5 : i / (clips.length - 1),
    }))
  }
  return files
}

function binPlugin(): Plugin {
  const virtual = 'virtual:onkery-bin'
  const resolved = `\0${virtual}`
  return {
    name: 'onkery-bin',
    resolveId(id) {
      if (id === virtual) return resolved
    },
    load(id) {
      if (id === resolved) {
        return `export const FILES = ${JSON.stringify(scanBin())}`
      }
    },
  }
}

function inside(root: string, file: string): boolean {
  const rel = relative(resolve(root), resolve(file))
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

function json(res: ServerResponse, body: unknown) {
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    req.on('end', () => resolveBody(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

/** Kept takes on this machine. Not the git repo. */
function localPoolPlugin(): Plugin {
  const dir = resolve('.pool')
  return {
    name: 'onkery-local-pool',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://onkery.local')
        void (async () => {
          if (url.pathname === '/api/pool' && req.method === 'GET') {
            const id = url.searchParams.get('id') ?? ''
            if (!POOL_ID.test(id)) {
              json(res, { urls: [] })
              return
            }
            const folder = join(dir, id)
            const files = existsSync(folder) ? readdirSync(folder).filter((f) => POOL_FILE.test(f)) : []
            json(res, { urls: files.map((f) => `/pool/${id}/${f}`) })
            return
          }
          if (url.pathname === '/api/dev-pool' && req.method === 'POST') {
            const id = url.searchParams.get('pool') ?? ''
            if (!POOL_ID.test(id)) {
              res.statusCode = 400
              res.end()
              return
            }
            const folder = join(dir, id)
            mkdirSync(folder, { recursive: true })
            const type = req.headers['content-type'] ?? ''
            const ext = type.includes('mp4') ? 'mp4' : 'webm'
            const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`
            writeFileSync(join(folder, name), await readBody(req))
            json(res, { ok: true })
            return
          }
          if (req.method === 'GET' && url.pathname.startsWith('/pool/')) {
            const rest = url.pathname.slice('/pool/'.length)
            const [id, name] = rest.split('/')
            if (!id || !name || !POOL_ID.test(id) || !POOL_FILE.test(name)) {
              res.statusCode = 404
              res.end()
              return
            }
            const file = join(dir, id, name)
            if (!inside(dir, file) || !existsSync(file)) {
              res.statusCode = 404
              res.end()
              return
            }
            res.setHeader('content-type', name.endsWith('.mp4') ? 'video/mp4' : 'video/webm')
            createReadStream(file).pipe(res)
            return
          }
          next()
        })().catch(next)
      })
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [
    binPlugin(),
    ...(command === 'serve' ? [localPoolPlugin(), basicSsl()] : []),
  ],
  server: {
    host: true,
  },
}))
