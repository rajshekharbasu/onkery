import { upload } from '@vercel/blob/client'
import { drawablyButton } from 'drawably'
import 'drawably/style.css'
import { RefreshCcw, type IconNode } from 'lucide'
import { poolFor, type PoolClip } from './bin'
import { buildMontage } from './montage'
import { CODA_ASK, getSitting, GRANT, WELCOME } from './opener'
import { saveTake, takesFor } from './store'
import {
  filmAsk,
  frameLine,
  holdLine,
  initial,
  lastAsk,
  openerAsk,
  openerLine,
  openerSrc,
  RECORD_MS,
  reduce,
  type Action,
  type Step,
} from './loop'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')

const ink = { stroke: '#f4f1ea', paper: 'transparent', fill: 'transparent', width: 2 }

let step: Step = initial()
let stream: MediaStream | null = null
let recorder: MediaRecorder | null = null
let chunks: Blob[] = []
let takeUrl: string | null = null
let lastTake: string | null = null
let lastSavedId: string | null = null
let stopTimer: number | null = null
let cutTimer: number | null = null
let sketches: { destroy(): void }[] = []

function dispatch(action: Action) {
  step = reduce(step, action)
  render()
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function clearSketches() {
  sketches.forEach((s) => s.destroy())
  sketches = []
}

function sketchButton(el: HTMLButtonElement, opts: { variant?: 'outline' | 'solid' | 'scribble' } = {}) {
  sketches.push(drawablyButton(el, { ...ink, variant: opts.variant ?? 'outline' }))
}

function lucideIcon(node: IconNode): string {
  const inner = node
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')
      return `<${tag} ${a} />`
    })
    .join('')
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`
}

function revokeTake() {
  if (takeUrl) {
    URL.revokeObjectURL(takeUrl)
    takeUrl = null
  }
}

/** Kept take joins the pool, and this sitting's montage. */
function leaveRecord(action: Action) {
  if (recorder) recorder.onstop = () => {}
  stopRecording()
  recorder = null
  if (action.type === 'keep' && takeUrl) {
    if (lastTake && lastTake !== takeUrl) URL.revokeObjectURL(lastTake)
    lastTake = takeUrl
    takeUrl = null
    const poolId = step.name === 'coda' ? CODA_ASK.pool : filmAsk(step.place, step.i).pool
    void persistTake(poolId, lastTake)
  }
  if (action.type === 'skip') {
    if (lastTake) URL.revokeObjectURL(lastTake)
    lastTake = null
  }
  revokeTake()
  dispatch(action)
}

function resetSitting() {
  if (lastTake) URL.revokeObjectURL(lastTake)
  lastTake = null
  lastSavedId = null
  revokeTake()
}

function clipsFrom(src: string[]): PoolClip[] {
  return src.map((item, i, all) => ({
    src: item,
    gradient: all.length <= 1 ? 0.5 : i / (all.length - 1),
  }))
}

function uniqueClips(clips: PoolClip[]): PoolClip[] {
  const seen = new Set<string>()
  const out: PoolClip[] = []
  for (const clip of clips) {
    if (seen.has(clip.src)) continue
    seen.add(clip.src)
    out.push(clip)
  }
  return out
}

function urlsFrom(data: unknown): string[] {
  if (typeof data !== 'object' || data === null || !('urls' in data)) return []
  const urls = data.urls
  if (!Array.isArray(urls)) return []
  return urls.filter((u): u is string => typeof u === 'string')
}

async function persistTake(pool: string, url: string) {
  let blob: Blob
  try {
    blob = await fetch(url).then((r) => r.blob())
  } catch {
    return
  }
  try {
    lastSavedId = await saveTake(pool, blob)
  } catch {
    /* private mode */
  }
  if (import.meta.env.DEV) {
    try {
      await fetch(`/api/dev-pool?pool=${encodeURIComponent(pool)}`, {
        method: 'POST',
        headers: { 'content-type': blob.type || 'video/webm' },
        body: blob,
      })
    } catch {
      /* vite middleware missing */
    }
    return
  }
  try {
    await uploadTake(pool, blob)
  } catch {
    /* no /api */
  }
}

async function uploadTake(pool: string, blob: Blob) {
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm'
  const file = new File([blob], `take.${ext}`, { type: blob.type || 'video/webm' })
  await upload(`pool/${pool}/take.${ext}`, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    clientPayload: JSON.stringify({ pool }),
  })
}

async function fetchPool(id: string): Promise<PoolClip[]> {
  const seed = poolFor(id)
  let local: PoolClip[] = []
  try {
    const takes = await takesFor(id)
    local = clipsFrom(takes.filter((t) => t.id !== lastSavedId).map((t) => t.url))
  } catch {
    /* private mode */
  }
  try {
    const res = await fetch(`/api/pool?id=${encodeURIComponent(id)}`)
    if (!res.ok) return uniqueClips([...seed, ...local])
    const live = clipsFrom(urlsFrom(await res.json()))
    if (live.length) return uniqueClips([...seed, ...live])
    return uniqueClips([...seed, ...local])
  } catch {
    return uniqueClips([...seed, ...local])
  }
}

async function ensureCamera(): Promise<boolean> {
  if (stream) return true
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    })
    return true
  } catch {
    dispatch({ type: 'denyCamera' })
    return false
  }
}

function bindLive(el: HTMLVideoElement) {
  if (!stream) return
  el.removeAttribute('src')
  el.srcObject = stream
  el.muted = true
  el.playsInline = true
  void el.play()
}

function bindOpenerClip(el: HTMLVideoElement) {
  const src = openerSrc()
  if (!src) {
    bindLive(el)
    return
  }
  el.srcObject = null
  el.src = src
  el.muted = true
  el.loop = true
  el.playsInline = true
  el.onerror = () => {
    el.removeAttribute('src')
    bindLive(el)
  }
  void el.play()
}

function stopCuts() {
  if (cutTimer != null) {
    window.clearTimeout(cutTimer)
    cutTimer = null
  }
}

function startRecording() {
  if (!stream) return
  chunks = []
  const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
    ? 'video/webm;codecs=vp8'
    : MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : ''
  recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
  const rec = recorder
  rec.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data)
  }
  rec.onstop = () => {
    const type = rec.mimeType || 'video/webm'
    revokeTake()
    const blob = new Blob(chunks, { type })
    takeUrl = URL.createObjectURL(blob)
    recorder = null
    dispatch({ type: 'autoStop' })
  }
  rec.start()
  stopTimer = window.setTimeout(() => {
    stopRecording()
  }, RECORD_MS)
}

function stopRecording() {
  if (stopTimer != null) {
    window.clearTimeout(stopTimer)
    stopTimer = null
  }
  if (recorder && recorder.state !== 'inactive') recorder.stop()
  recorder = null
}

function iconX(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`
}

function shutterMarkup(pressed: boolean): string {
  return `
    <button class="shutter" type="button" aria-pressed="${pressed}" aria-label="Record" style="--record-ms:${RECORD_MS}ms">
      <svg class="shutter-ring" viewBox="0 0 36 36" aria-hidden="true">
        <circle class="track" cx="18" cy="18" r="16" />
        <circle class="fill" cx="18" cy="18" r="16" />
      </svg>
      <span class="shutter-core"></span>
    </button>`
}

function stateDump(): string {
  const lines = Object.entries(step).map(([k, v]) => `${k}: ${v}`)
  const sit = getSitting()
  if ('place' in step) {
    const asks = sit.asks[step.place].filter((a) => !a.teach).map((a) => a.id)
    lines.push(`asks: ${asks.join(', ')}`)
  }
  lines.push(`opener: ${sit.opener.id}`)
  if (step.name === 'montage') {
    const ask = step.coda ? CODA_ASK : filmAsk(step.place, step.i)
    lines.push(`pool: ${ask.pool}`)
  }
  return lines.join('\n')
}

function shell(inner: string): string {
  return `
    <div class="landscape">Turn the phone upright.</div>
    ${inner}
    <pre class="state">${esc(stateDump())}</pre>`
}

function render() {
  clearSketches()
  stopCuts()
  const live = `<video class="live" autoplay muted playsinline></video>`

  if (step.name === 'welcome') {
    app.innerHTML = shell(`
      <div class="copy copy-mid">
        <p class="title">${esc(WELCOME.title)}</p>
        <p class="prompt">${esc(WELCOME.body)}</p>
        <p class="hint">${esc(WELCOME.trust)}</p>
        <button class="choice" type="button" data-next>${esc(WELCOME.next)}</button>
      </div>`)
    const next = app.querySelector<HTMLButtonElement>('[data-next]')!
    sketchButton(next)
    next.onclick = () => dispatch({ type: 'next' })
    return
  }

  if (step.name === 'grant') {
    app.innerHTML = shell(`
      <div class="copy copy-mid">
        <p class="prompt">${esc(GRANT.ask)}</p>
        <p class="hint">${esc(GRANT.hint)}</p>
        <button class="choice" type="button" data-allow>${esc(GRANT.allow)}</button>
      </div>`)
    const allow = app.querySelector<HTMLButtonElement>('[data-allow]')!
    sketchButton(allow)
    allow.onclick = async () => {
      const ok = await ensureCamera()
      if (ok) dispatch({ type: 'next' })
    }
    return
  }

  if (step.name === 'chooser') {
    app.innerHTML = shell(`
      ${live}
      <div class="copy copy-mid">
        <p class="prompt">Are you outside, or indoors, right now?</p>
        <button class="choice" type="button" data-place="inside">I'm indoors</button>
        <button class="choice" type="button" data-place="outside">I'm outside</button>
        <p class="hint">It doesn't work very well inside a vehicle.</p>
      </div>`)
    const video = app.querySelector<HTMLVideoElement>('video.live')!
    void ensureCamera().then((ok) => {
      if (ok) bindLive(video)
    })
    app.querySelectorAll<HTMLButtonElement>('[data-place]').forEach((btn) => {
      sketchButton(btn)
      btn.onclick = async () => {
        const place = btn.dataset.place === 'outside' ? 'outside' : 'inside'
        const ok = await ensureCamera()
        if (ok) dispatch({ type: 'choose', place })
      }
    })
    return
  }

  if (step.name === 'denied') {
    app.innerHTML = shell(`
      <div class="copy copy-mid">
        <p class="prompt">You won't be able to continue unless you grant access to the camera.</p>
        <p class="hint">No audio will be recorded.</p>
        <button class="choice" type="button" data-again>Try again</button>
      </div>`)
    const again = app.querySelector<HTMLButtonElement>('[data-again]')!
    sketchButton(again)
    again.onclick = () => dispatch({ type: 'again' })
    return
  }

  if (step.name === 'teach') {
    app.innerHTML = shell(`
      ${live}
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">This is how you take a video.</p>
        </div>
      </div>`)
    bindLive(app.querySelector('video.live')!)
    app.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
    return
  }

  if (step.name === 'between') {
    app.innerHTML = shell(`
      ${live}
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">${esc(step.text)}</p>
        </div>
      </div>`)
    bindLive(app.querySelector('video.live')!)
    app.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
    return
  }

  if (step.name === 'ready' || step.name === 'recording') {
    const ask = filmAsk(step.place, step.i)
    const pressed = step.name === 'recording' ? 'true' : 'false'
    const hint = ask.teach
      ? `<p class="hint">Tap the button below to record.<br>It stops after a couple of seconds.</p>`
      : ''
    app.innerHTML = shell(`
      ${live}
      <div class="copy copy-top">
        <p class="prompt">${esc(ask.ask)}</p>
        ${hint}
      </div>
      <div class="chrome">
        <button class="icon-btn" type="button" data-skip aria-label="Skip">${iconX()}</button>
        ${shutterMarkup(pressed === 'true')}
        <span class="chrome-slot"></span>
      </div>`)
    bindLive(app.querySelector('video.live')!)
    app.querySelector<HTMLButtonElement>('[data-skip]')!.onclick = () => leaveRecord({ type: 'skip' })
    app.querySelector<HTMLButtonElement>('.shutter')!.onclick = () => {
      if (step.name !== 'ready') return
      dispatch({ type: 'tap' })
      startRecording()
    }
    return
  }

  if (step.name === 'review') {
    const first = filmAsk(step.place, step.i).teach
    app.innerHTML = shell(`
      <video class="replay" playsinline loop muted></video>
      <div class="copy copy-top">
        ${first ? `<p class="prompt">Press OK to continue, or refresh to redo.</p>` : ''}
      </div>
      <div class="chrome">
        <button class="icon-btn" type="button" data-skip aria-label="Skip">${iconX()}</button>
        <button class="icon-btn" type="button" data-redo aria-label="Redo">${lucideIcon(RefreshCcw)}</button>
        <button class="ok" type="button">OK</button>
      </div>`)
    const replay = app.querySelector<HTMLVideoElement>('video.replay')!
    if (takeUrl) {
      replay.src = takeUrl
      replay.muted = true
      void replay.play()
    }
    sketchButton(app.querySelector<HTMLButtonElement>('.ok')!)
    app.querySelector<HTMLButtonElement>('[data-redo]')!.onclick = () => {
      stopRecording()
      revokeTake()
      dispatch({ type: 'redo' })
    }
    app.querySelector<HTMLButtonElement>('.ok')!.onclick = () => leaveRecord({ type: 'keep' })
    app.querySelector<HTMLButtonElement>('[data-skip]')!.onclick = () => leaveRecord({ type: 'skip' })
    return
  }

  if (step.name === 'montage') {
    const ask = step.coda ? CODA_ASK : filmAsk(step.place, step.i)
    app.innerHTML = shell(`
      <video class="replay montage-v on" playsinline muted></video>
      <video class="replay montage-v" playsinline muted></video>
      <div class="tap-layer tap-next">
        <div class="copy copy-caption"><p class="line montage-line">${esc(ask.caption)}</p></div>
      </div>`)
    const vids = [...app.querySelectorAll<HTMLVideoElement>('video.montage-v')]
    const caption = app.querySelector<HTMLParagraphElement>('.montage-line')!

    const pulseCaption = () => {
      caption.textContent = ask.caption
      caption.classList.remove('cut')
      void caption.offsetWidth
      caption.classList.add('cut')
    }

    const playCuts = (cuts: ReturnType<typeof buildMontage>) => {
      if (!cuts.length || !vids[0].isConnected) {
        dispatch({ type: 'next' })
        return
      }
      const play = (i: number) => {
        if (!vids[0].isConnected) return
        const el = vids[i % 2]
        el.src = cuts[i].src
        el.muted = true
        void el.play()
        vids.forEach((v) => v.classList.toggle('on', v === el))
        pulseCaption()
        const next = cuts[(i + 1) % cuts.length]
        const ahead = vids[(i + 1) % 2]
        if (ahead !== el) {
          ahead.src = next.src
          ahead.load()
        }
        cutTimer = window.setTimeout(() => play((i + 1) % cuts.length), cuts[i].ms)
      }
      play(0)
    }

    void fetchPool(ask.pool).then((pool) => {
      playCuts(buildMontage(pool, lastTake ? [lastTake] : []))
    })

    app.querySelector('.tap-next')!.addEventListener('click', () => {
      stopCuts()
      dispatch({ type: 'next' })
    })
    return
  }

  if (step.name === 'frame') {
    app.innerHTML = shell(`
      ${live}
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">${esc(frameLine(step.i))}</p>
        </div>
      </div>`)
    bindLive(app.querySelector('video.live')!)
    app.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
    return
  }

  if (step.name === 'opener') {
    const ask = openerAsk()
    const line = openerLine()
    const body =
      step.beat === 0
        ? `<p class="was">They were asked</p><p class="prompt">${esc(ask)}</p>`
        : line
          ? `<p class="line">${esc(line)}</p>`
          : ''
    app.innerHTML = shell(`
      <video class="replay opener-clip" playsinline loop muted></video>
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">${body}</div>
      </div>`)
    bindOpenerClip(app.querySelector<HTMLVideoElement>('video.opener-clip')!)
    app.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
    return
  }

  if (step.name === 'hold') {
    app.innerHTML = shell(`
      ${live}
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">${esc(holdLine(step.i))}</p>
        </div>
      </div>`)
    bindLive(app.querySelector('video.live')!)
    app.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
    return
  }

  if (step.name === 'coda') {
    const pressed = step.phase === 'recording' ? 'true' : 'false'
    if (step.phase === 'ready' || step.phase === 'recording') {
      app.innerHTML = shell(`
        ${live}
        <div class="copy copy-top">
          <p class="prompt">${esc(lastAsk(step.place))}</p>
        </div>
        <div class="chrome">
          <button class="icon-btn" type="button" data-skip aria-label="Skip">${iconX()}</button>
          ${shutterMarkup(pressed === 'true')}
          <span class="chrome-slot"></span>
        </div>`)
      bindLive(app.querySelector('video.live')!)
      app.querySelector<HTMLButtonElement>('[data-skip]')!.onclick = () => leaveRecord({ type: 'skip' })
      app.querySelector<HTMLButtonElement>('.shutter')!.onclick = () => {
        if (step.name !== 'coda' || step.phase !== 'ready') return
        dispatch({ type: 'tap' })
        startRecording()
      }
      return
    }
    app.innerHTML = shell(`
      <video class="replay" playsinline loop muted></video>
      <div class="chrome">
        <button class="icon-btn" type="button" data-skip aria-label="Skip">${iconX()}</button>
        <button class="icon-btn" type="button" data-redo aria-label="Redo">${lucideIcon(RefreshCcw)}</button>
        <button class="ok" type="button">OK</button>
      </div>`)
    const replay = app.querySelector<HTMLVideoElement>('video.replay')!
    if (takeUrl) {
      replay.src = takeUrl
      replay.muted = true
      void replay.play()
    }
    sketchButton(app.querySelector<HTMLButtonElement>('.ok')!)
    app.querySelector<HTMLButtonElement>('[data-redo]')!.onclick = () => {
      stopRecording()
      revokeTake()
      dispatch({ type: 'redo' })
    }
    app.querySelector<HTMLButtonElement>('.ok')!.onclick = () => leaveRecord({ type: 'keep' })
    app.querySelector<HTMLButtonElement>('[data-skip]')!.onclick = () => leaveRecord({ type: 'skip' })
    return
  }

  if (step.name === 'leave') {
    app.innerHTML = shell(`
      <video class="live" autoplay muted playsinline></video>
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">That's it.</p>
        </div>
      </div>`)
    bindLive(app.querySelector('video.live')!)
    app.querySelector('.tap-next')!.addEventListener('click', () => {
      resetSitting()
      dispatch({ type: 'again' })
    })
  }
}

render()
