import basicSsl from '@vitejs/plugin-basic-ssl'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

const RELATIONS = ['delay', 'residue', 'keeping', 'justdone'] as const

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

export default defineConfig(({ command }) => ({
  plugins: [binPlugin(), ...(command === 'serve' ? [basicSsl()] : [])],
  server: {
    host: true,
  },
}))
