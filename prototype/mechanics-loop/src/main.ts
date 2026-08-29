import { upload } from '@vercel/blob/client'
import { inject } from '@vercel/analytics'
import { drawablyButton } from 'drawably'
import 'drawably/style.css'
import { RefreshCcw, type IconNode } from 'lucide'
import { poolFor, type PoolClip } from './bin'
import { buildMontage, OTHER_MIN } from './montage'
import { askB, BRIEF, codaAsk, getSitting, GRANT, LAST_ASK, poolIdsForMontage, RECORD_HINT, THANKS, WELCOME, type FilmAsk, type Place } from './opener'
import { saveTake, takesFor } from './store'
import {
  filmAsk,
  frameLine,
  holdLine,
  initial,
  openerAsk,
  openerLine,
  openerSrc,
  RECORD_MS,
  reduce,
  type Action,
  type Step,
} from './loop'

// Initialize Vercel Web Analytics
inject()

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
let shownOpener: string | null = null
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
    const poolId = step.name === 'coda' ? codaAsk().pool : filmAsk(step.place, step.i).pool
    void persistTake(poolId, lastTake)
  }
  if (action.type === 'skip' || action.type === 'exit') {
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
  shownOpener = null
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
    const res = await fetch(`/api/pool?id=${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return uniqueClips([...seed, ...local])
    const live = clipsFrom(urlsFrom(await res.json()))
    if (live.length) return uniqueClips([...seed, ...live])
    return uniqueClips([...seed, ...local])
  } catch {
    return uniqueClips([...seed, ...local])
  }
}

async function fetchMontagePool(ask: FilmAsk, place: Place): Promise<PoolClip[]> {
  const ids = poolIdsForMontage(ask, place)
  const ownId = ids[0] ?? ask.pool
  const own = await fetchPool(ownId)
  if (own.length >= OTHER_MIN) return own
  const rest = await Promise.all(ids.slice(1).map(fetchPool))
  return uniqueClips([own, ...rest].flat())
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

function pickOtherSrc(clips: PoolClip[], mine: string | null): string | undefined {
  const others = clips.filter((c) => c.src !== mine)
  if (others.length === 0) return undefined
  return others[Math.floor(Math.random() * others.length)].src
}

function bindOpenerClip(el: HTMLVideoElement) {
  const play = (src: string) => {
    if (!el.isConnected) return
    el.srcObject = null
    el.src = src
    el.muted = true
    el.loop = true
    el.playsInline = true
    void el.play()
  }

  if (shownOpener) {
    play(shownOpener)
    return
  }

  const other = fetchMontagePool(askB(), getSitting().place).then((pool) => pickOtherSrc(pool, lastTake))
  const useOther = () => {
    void other.then((src) => {
      if (!src || !el.isConnected || shownOpener) return
      shownOpener = src
      play(src)
    })
  }

  const plant = openerSrc()
  if (!plant) {
    useOther()
    return
  }
  el.onerror = () => {
    el.onerror = null
    useOther()
  }
  el.onloadeddata = () => {
    shownOpener = plant
  }
  play(plant)
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

function montageAsk(step: Step & { name: 'montage' }): FilmAsk {
  return step.coda ? codaAsk() : filmAsk(step.place, step.i)
}

function stateDump(): string {
  const lines = Object.entries(step).map(([k, v]) => `${k}: ${v}`)
  const sit = getSitting()
  lines.push(`flow: ${sit.flow}`)
  const asks = sit.asks.filter((a) => !a.teach).map((a) => a.id)
  if (asks.length) lines.push(`asks: ${asks.join(', ')}`)
  lines.push(`opener: ${sit.opener.id}`)
  if (step.name === 'montage') {
    lines.push(`pool: ${montageAsk(step).pool}`)
  }
  return lines.join('\n')
}


const SIT_MS = 180
const LEAVE_MS = 220

function ensureFrame() {
  if (app.querySelector('.stages')) return
  app.innerHTML = `
    <div class="landscape">Turn the phone upright.</div>
    <div class="desk">
      <p class="title">This is Onkery.</p>
      <p class="lead">It lives on a phone. Open this there.</p>
    </div>
    <video class="live room off" autoplay muted playsinline></video>
    <div class="stages"></div>
    ${new URLSearchParams(location.search).has('debug') ? '<pre class="state"></pre>' : ''}`
}

function liveOn(on: boolean) {
  const el = app.querySelector<HTMLVideoElement>('video.room')
  if (!el) return
  el.classList.toggle('off', !on)
  if (on) bindLive(el)
}

function paint(inner: string, instant = false): HTMLElement {
  ensureFrame()
  const dump = app.querySelector('.state')
  if (dump) dump.textContent = stateDump()
  const stages = app.querySelector('.stages')!
  const prev = [...stages.querySelectorAll<HTMLElement>('.stage')]
  const next = document.createElement('div')
  next.className = instant ? 'stage instant show' : 'stage'
  next.innerHTML = inner
  stages.appendChild(next)
  if (instant) {
    prev.forEach((el) => el.remove())
    return next
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.classList.add('show')
      prev.forEach((el) => el.classList.remove('show'))
    })
  })
  window.setTimeout(() => prev.forEach((el) => el.remove()), SIT_MS + 40)
  return next
}

function dissolveThen(done: () => void) {
  const shown = app.querySelector<HTMLElement>('.stage.show')
  shown?.classList.remove('show')
  window.setTimeout(done, LEAVE_MS)
}


function leavePopMarkup(): string {
  return `
    <div class="leave-pop">
      <button class="choice" type="button" data-skip-ask>Skip</button>
      <button class="choice" type="button" data-exit>Exit</button>
    </div>`
}

function bindLeavePop(root: HTMLElement) {
  const pop = root.querySelector<HTMLElement>('.leave-pop')
  const skip = root.querySelector<HTMLButtonElement>('[data-skip]')
  if (!pop || !skip) return
  const open = () => {
    pop.classList.add('show')
    pop.querySelectorAll<HTMLButtonElement>('.choice').forEach((btn) => {
      if (btn.dataset.sketched) return
      sketchButton(btn)
      btn.dataset.sketched = '1'
    })
  }
  skip.onclick = (e) => {
    e.stopPropagation()
    if (pop.classList.contains('show')) pop.classList.remove('show')
    else open()
  }
  pop.querySelector<HTMLButtonElement>('[data-skip-ask]')!.onclick = (e) => {
    e.stopPropagation()
    leaveRecord({ type: 'skip' })
  }
  pop.querySelector<HTMLButtonElement>('[data-exit]')!.onclick = (e) => {
    e.stopPropagation()
    leaveRecord({ type: 'exit' })
  }
}

function pressShutter() {
  const existing = app.querySelector<HTMLButtonElement>('.stage .shutter')
  if (!existing) return false
  requestAnimationFrame(() => {
    requestAnimationFrame(() => existing.setAttribute('aria-pressed', 'true'))
  })
  return true
}

function render() {
  const recording =
    step.name === 'recording' || (step.name === 'coda' && step.phase === 'recording')
  if (recording && pressShutter()) return
  clearSketches()
  stopCuts()

  if (step.name === 'welcome') {
    liveOn(false)
    const root = paint(`
      <div class="copy copy-home">
        <p class="title">${esc(WELCOME.title)}</p>
        <p class="lead">${esc(WELCOME.lead)}</p>
        <button class="choice" type="button" data-next>${esc(WELCOME.next)}</button>
      </div>`)
    const next = root.querySelector<HTMLButtonElement>('[data-next]')!
    sketchButton(next)
    next.onclick = () => dispatch({ type: 'next' })
    return
  }

  if (step.name === 'brief') {
    liveOn(false)
    const lines = BRIEF.lines.map((line) => `<p class="prompt">${esc(line)}</p>`).join('')
    const root = paint(`
      <div class="copy copy-brief">
        <div class="copy-stack">${lines}</div>
        <button class="choice" type="button" data-next>${esc(BRIEF.next)}</button>
      </div>`)
    const next = root.querySelector<HTMLButtonElement>('[data-next]')!
    sketchButton(next)
    next.onclick = () => dispatch({ type: 'next' })
    return
  }

  if (step.name === 'grant') {
    liveOn(false)
    const root = paint(`
      <div class="copy copy-home">
        <div class="copy-stack">
          <p class="prompt">${esc(GRANT.ask)}</p>
          <p class="hint">${esc(GRANT.hint)}</p>
        </div>
        <button class="choice" type="button" data-allow>${esc(GRANT.allow)}</button>
      </div>`)
    const allow = root.querySelector<HTMLButtonElement>('[data-allow]')!
    sketchButton(allow)
    allow.onclick = async () => {
      allow.dataset.state = 'loading'
      allow.disabled = true
      const ok = await ensureCamera()
      if (ok) dispatch({ type: 'next' })
    }
    return
  }

  if (step.name === 'chooser') {
    liveOn(true)
    void ensureCamera().then((ok) => {
      if (ok) liveOn(true)
    })
    const root = paint(`
      <div class="copy copy-mid">
        <p class="prompt">Are you outside, or indoors, right now?</p>
        <button class="choice" type="button" data-place="inside">I'm indoors</button>
        <button class="choice" type="button" data-place="outside">I'm outside</button>
        <p class="hint">It doesn't work very well inside a vehicle.</p>
      </div>`)
    root.querySelectorAll<HTMLButtonElement>('[data-place]').forEach((btn) => {
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
    liveOn(false)
    const root = paint(`
      <div class="copy copy-home">
        <div class="copy-stack">
          <p class="prompt">You won't be able to continue unless you grant access to the camera.</p>
          <p class="hint">No audio will be recorded.</p>
        </div>
        <button class="choice" type="button" data-again>Try again</button>
      </div>`)
    const again = root.querySelector<HTMLButtonElement>('[data-again]')!
    sketchButton(again)
    again.onclick = () => dispatch({ type: 'again' })
    return
  }

  if (step.name === 'between') {
    liveOn(true)
    const root = paint(`
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">${esc(step.text)}</p>
        </div>
      </div>`)
    root.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
    return
  }

  if (step.name === 'ready' || step.name === 'recording') {
    const ask = filmAsk(step.place, step.i)
    const pressed = step.name === 'recording' ? 'true' : 'false'
    const hint = ask.teach && step.i === 0 ? `<p class="hint">${esc(RECORD_HINT)}</p>` : ''
    liveOn(true)
    const root = paint(`
      <div class="copy copy-top">
        <p class="prompt">${esc(ask.ask)}</p>
        ${hint}
      </div>
      <div class="chrome">
        <button class="icon-btn" type="button" data-skip aria-label="Skip">${iconX()}</button>
        ${shutterMarkup(false)}
        <span class="chrome-slot"></span>
        ${leavePopMarkup()}
      </div>`, recording)
    bindLeavePop(root)
    root.querySelector<HTMLButtonElement>('.shutter')!.onclick = () => {
      if (step.name !== 'ready') return
      dispatch({ type: 'tap' })
      startRecording()
    }
    return
  }

  if (step.name === 'review') {
    const first = filmAsk(step.place, step.i).teach
    liveOn(false)
    const root = paint(`
      <video class="replay" playsinline loop muted></video>
      <div class="copy copy-top">
        ${first ? `<p class="prompt">Press OK to continue, or refresh to redo.</p>` : ''}
      </div>
      <div class="chrome">
        <button class="icon-btn" type="button" data-skip aria-label="Skip">${iconX()}</button>
        <button class="icon-btn" type="button" data-redo aria-label="Redo">${lucideIcon(RefreshCcw)}</button>
        <button class="ok" type="button">OK</button>
        ${leavePopMarkup()}
      </div>`)
    const replay = root.querySelector<HTMLVideoElement>('video.replay')!
    if (takeUrl) {
      replay.src = takeUrl
      replay.muted = true
      void replay.play()
    }
    sketchButton(root.querySelector<HTMLButtonElement>('.ok')!)
    root.querySelector<HTMLButtonElement>('[data-redo]')!.onclick = () => {
      stopRecording()
      revokeTake()
      dispatch({ type: 'redo' })
    }
    root.querySelector<HTMLButtonElement>('.ok')!.onclick = () => leaveRecord({ type: 'keep' })
    bindLeavePop(root)
    return
  }

  if (step.name === 'montage') {
    const ask = montageAsk(step)
    const hold = lastTake
    if (hold) liveOn(false)
    else liveOn(true)
    const root = paint(`
      ${hold ? `<video class="replay hold-v on" playsinline loop muted></video>` : ''}
      <video class="replay montage-v" playsinline muted></video>
      <video class="replay montage-v" playsinline muted></video>
      <div class="tap-layer tap-next">
        <div class="copy copy-caption"><p class="line montage-line">${esc(ask.caption)}</p></div>
      </div>`)
    const holdEl = root.querySelector<HTMLVideoElement>('video.hold-v')
    if (holdEl && hold) {
      holdEl.src = hold
      holdEl.muted = true
      void holdEl.play()
    }
    const vids = [...root.querySelectorAll<HTMLVideoElement>('video.montage-v')]

    const playCuts = (cuts: ReturnType<typeof buildMontage>) => {
      if (!cuts.length || !vids[0].isConnected) {
        dispatch({ type: 'next' })
        return
      }
      const play = (i: number) => {
        if (!vids[0].isConnected) return
        const el = vids[i % 2]
        if (el.getAttribute('src') !== cuts[i].src) el.src = cuts[i].src
        el.muted = true
        let shown = false
        const show = () => {
          if (shown || !el.isConnected) return
          shown = true
          void el.play()
          vids.forEach((v) => v.classList.toggle('on', v === el))
          holdEl?.classList.remove('on', 'join')
          liveOn(false)
          const nxt = cuts[(i + 1) % cuts.length]
          const ahead = vids[(i + 1) % 2]
          if (ahead !== el) {
            ahead.src = nxt.src
            ahead.load()
          }
          cutTimer = window.setTimeout(() => play((i + 1) % cuts.length), cuts[i].ms)
        }
        if (el.readyState >= 2) show()
        else {
          const wait = window.setTimeout(show, 180)
          el.addEventListener('loadeddata', () => {
            window.clearTimeout(wait)
            show()
          }, { once: true })
        }
      }
      play(0)
    }

    const readyThen = (cuts: ReturnType<typeof buildMontage>) => {
      if (!cuts.length) {
        playCuts(cuts)
        return
      }
      const first = vids[0]
      if (!first) {
        playCuts(cuts)
        return
      }
      let started = false
      const go = () => {
        if (started) return
        started = true
        if (holdEl?.classList.contains('on')) {
          holdEl.classList.add('join')
          window.setTimeout(() => playCuts(cuts), SIT_MS)
          return
        }
        playCuts(cuts)
      }
      first.src = cuts[0].src
      first.muted = true
      first.addEventListener('loadeddata', go, { once: true })
      window.setTimeout(go, 6000)
    }

    void fetchMontagePool(ask, step.place).then((pool) => {
      readyThen(buildMontage(pool, lastTake ? [lastTake] : []))
    })

    root.querySelector('.tap-next')!.addEventListener('click', () => {
      stopCuts()
      dispatch({ type: 'next' })
    })
    return
  }

  if (step.name === 'frame') {
    liveOn(false)
    const root = paint(`
      <video class="replay opener-clip" playsinline loop muted></video>
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">${esc(frameLine(step.i))}</p>
        </div>
      </div>`)
    bindOpenerClip(root.querySelector<HTMLVideoElement>('video.opener-clip')!)
    root.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
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
    liveOn(false)
    const root = paint(`
      <video class="replay opener-clip" playsinline loop muted></video>
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">${body}</div>
      </div>`)
    bindOpenerClip(root.querySelector<HTMLVideoElement>('video.opener-clip')!)
    root.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
    return
  }

  if (step.name === 'hold') {
    liveOn(true)
    const root = paint(`
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">${esc(holdLine(step.i))}</p>
        </div>
      </div>`)
    root.querySelector('.tap-next')!.addEventListener('click', () => dispatch({ type: 'next' }))
    return
  }

  if (step.name === 'coda') {
    const pressed = step.phase === 'recording' ? 'true' : 'false'
    if (step.phase === 'ready' || step.phase === 'recording') {
      liveOn(true)
      const root = paint(`
        <div class="copy copy-top">
          <p class="prompt">${esc(LAST_ASK)}</p>
          <p class="hint">${esc(askB().ask)}</p>
        </div>
        <div class="chrome">
          <button class="icon-btn" type="button" data-skip aria-label="Skip">${iconX()}</button>
          ${shutterMarkup(false)}
          <span class="chrome-slot"></span>
          ${leavePopMarkup()}
        </div>`, recording)
      bindLeavePop(root)
      root.querySelector<HTMLButtonElement>('.shutter')!.onclick = () => {
        if (step.name !== 'coda' || step.phase !== 'ready') return
        dispatch({ type: 'tap' })
        startRecording()
      }
      return
    }
    liveOn(false)
    const root = paint(`
      <video class="replay" playsinline loop muted></video>
      <div class="chrome">
        <button class="icon-btn" type="button" data-skip aria-label="Skip">${iconX()}</button>
        <button class="icon-btn" type="button" data-redo aria-label="Redo">${lucideIcon(RefreshCcw)}</button>
        <button class="ok" type="button">OK</button>
        ${leavePopMarkup()}
      </div>`)
    const replay = root.querySelector<HTMLVideoElement>('video.replay')!
    if (takeUrl) {
      replay.src = takeUrl
      replay.muted = true
      void replay.play()
    }
    sketchButton(root.querySelector<HTMLButtonElement>('.ok')!)
    root.querySelector<HTMLButtonElement>('[data-redo]')!.onclick = () => {
      stopRecording()
      revokeTake()
      dispatch({ type: 'redo' })
    }
    root.querySelector<HTMLButtonElement>('.ok')!.onclick = () => leaveRecord({ type: 'keep' })
    bindLeavePop(root)
    return
  }

  if (step.name === 'leave') {
    liveOn(true)
    const root = paint(`
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">That's it.</p>
        </div>
      </div>`)
    root.querySelector('.tap-next')!.addEventListener('click', () => {
      dissolveThen(() => {
        resetSitting()
        dispatch({ type: 'again' })
      })
    })
    return
  }

  if (step.name === 'thanks') {
    liveOn(false)
    const root = paint(`
      <div class="tap-layer tap-next">
        <div class="copy copy-mid">
          <p class="prompt">${esc(THANKS)}</p>
        </div>
      </div>`)
    root.querySelector('.tap-next')!.addEventListener('click', () => {
      dissolveThen(() => {
        resetSitting()
        dispatch({ type: 'again' })
      })
    })
  }
}

render()
