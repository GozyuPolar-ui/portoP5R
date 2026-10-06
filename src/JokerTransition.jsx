import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { JokerContext } from './jokerContext'
import jokerLanding from './assets/jokerlanding.mp4'
import jokerFail from './assets/jokerfail.mp4'

// Both clips are green-screen footage with a blue fill. Green AND blue are keyed
// out on a canvas, so only Joker's black silhouette / white shapes / shards are
// drawn, full screen, over the live page (like the in-game cut-in).
//
// Times are seconds of video time.
//   navigateAt : change page here (silhouette is big on screen, hides the swap)
//   skip       : [from, to] stretch that is empty green screen, jumped over
const CLIPS = {
  landing: { src: jokerLanding, navigateAt: 1.9, skip: [0.5, 1.65] },
  fail: { src: jokerFail, navigateAt: 0.35, skip: null },
}

// Keying runs per frame on the CPU, so touch devices use a smaller working size
// (it is stretched to fill the screen anyway; the silhouette stays smooth).
const isTouch = () => window.matchMedia?.('(pointer: coarse)').matches
const keySize = () => (isTouch() ? [640, 360] : [960, 540])
const PREPARE_MS = 2500 // max wait for a clip to get ready before giving up on it
const SAFETY_MS = 8000

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 10000000, // above .stage-container (z-index 999)
  display: 'none',
  pointerEvents: 'auto', // swallow clicks while the transition runs
}

const canvasStyle = {
  display: 'block',
  width: '100vw',
  height: '100dvh',
  objectFit: 'cover', // always fills the whole window
}

// Source <video>s stay mounted and preloaded, but invisible; only the keyed canvas shows.
const sourceStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: 2,
  height: 2,
  opacity: 0,
  pointerEvents: 'none',
}

const waitFor = (target, event, ms) =>
  new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer)
      target.removeEventListener(event, done)
      resolve()
    }
    const timer = setTimeout(done, ms)
    target.addEventListener(event, done, { once: true })
  })

export function JokerTransitionProvider({ children }) {
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  const overlayRef = useRef(null)
  const canvasRef = useRef(null)
  const videoRefs = useRef({ landing: null, fail: null })
  const busyRef = useRef(false)
  const abortRef = useRef(null)

  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])

  // Warm both clips up front so the selected one is ready the moment it's needed.
  useEffect(() => {
    Object.values(videoRefs.current).forEach((v) => v?.load())
  }, [])

  // Leave nothing running if the provider unmounts mid-transition.
  useEffect(() => () => abortRef.current?.(), [])

  const start = useCallback(async (page) => {
    if (busyRef.current) return

    const to = `/${page}`
    const overlay = overlayRef.current
    const canvas = canvasRef.current
    const kind = Math.random() < 0.5 ? 'landing' : 'fail'
    const video = videoRefs.current[kind]
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (!overlay || !canvas || !video || reduceMotion) {
      navigateRef.current(to, { state: { joker: true } })
      return
    }

    busyRef.current = true
    const clip = CLIPS[kind]
    const [KEY_W, KEY_H] = keySize()
    canvas.width = KEY_W
    canvas.height = KEY_H
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    let navigated = false
    let stopped = false
    let skipped = false
    let rafId = 0
    let safetyTimer = 0
    let lastTime = -1
    let shown = false

    const go = () => {
      if (navigated) return
      navigated = true
      navigateRef.current(to, { state: { joker: true } })
    }

    const finish = () => {
      if (stopped) return
      stopped = true
      cancelAnimationFrame(rafId)
      clearTimeout(safetyTimer)
      video.onended = null
      video.pause()
      try {
        video.currentTime = 0 // next run starts on a fresh first frame
      } catch {
        /* ignore */
      }
      overlay.style.display = 'none'
      ctx.clearRect(0, 0, KEY_W, KEY_H)
      busyRef.current = false
      abortRef.current = null
    }

    const drawKeyed = () => {
      ctx.drawImage(video, 0, 0, KEY_W, KEY_H)
      const frame = ctx.getImageData(0, 0, KEY_W, KEY_H)
      const px = frame.data
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i]
        const g = px[i + 1]
        const b = px[i + 2]
        const rb = r > b ? r : b
        const rg = r > g ? r : g
        const greenDom = g - rb // ~237 on the green key
        const blueDom = b - rg // ~141..249 on the blue fill
        if (greenDom > 40) {
          // green screen: fully transparent at >=200, partial on anti-aliased edges
          px[i + 3] = greenDom >= 200 ? 0 : ((200 - greenDom) * 255) / 160
          px[i + 1] = rb // despill the green fringe
        } else if (blueDom > 40) {
          // blue fill: fully transparent at >=130
          px[i + 3] = blueDom >= 130 ? 0 : ((130 - blueDom) * 255) / 90
          px[i + 2] = rg // despill the blue fringe
        }
      }
      ctx.putImageData(frame, 0, 0)
    }

    const tick = () => {
      if (stopped) return
      if (video.readyState >= 2 && video.currentTime !== lastTime) {
        lastTime = video.currentTime
        drawKeyed()
        if (!shown) {
          shown = true
          overlay.style.display = 'block' // only now: the first keyed frame is ready
        }
        if (clip.skip && !skipped && lastTime >= clip.skip[0]) {
          skipped = true
          video.currentTime = clip.skip[1] // jump over the empty green stretch
        }
        if (lastTime >= clip.navigateAt) go()
      }
      rafId = requestAnimationFrame(tick)
    }

    abortRef.current = finish

    // 1) Prepare: nothing changes on screen (menu stays as is) until the clip is
    //    buffered and rewound to its first frame.
    if (video.readyState < 3) await waitFor(video, 'canplay', PREPARE_MS)
    if (stopped) return
    if (video.currentTime !== 0) {
      video.currentTime = 0
      await waitFor(video, 'seeked', PREPARE_MS)
      if (stopped) return
    }

    // 2) Play. The overlay appears on the first drawn frame; the page changes
    //    later, when the silhouette is on screen.
    video.onended = () => {
      go()
      finish()
    }
    safetyTimer = setTimeout(() => {
      go()
      finish()
    }, SAFETY_MS)

    try {
      await video.play()
    } catch {
      go() // couldn't play the clip: just change page
      finish()
      return
    }
    if (stopped) return
    rafId = requestAnimationFrame(tick)
  }, [])

  return (
    <JokerContext.Provider value={start}>
      {children}
      {createPortal(
        <>
          <div ref={overlayRef} style={overlayStyle} aria-hidden="true">
            <canvas ref={canvasRef} style={canvasStyle} />
          </div>
          <video
            ref={(el) => {
              videoRefs.current.landing = el
            }}
            src={jokerLanding}
            style={sourceStyle}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <video
            ref={(el) => {
              videoRefs.current.fail = el
            }}
            src={jokerFail}
            style={sourceStyle}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </>,
        document.body,
      )}
    </JokerContext.Provider>
  )
}
