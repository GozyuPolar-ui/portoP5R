import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { JokerContext } from './jokerContext'
import jokerLanding from './assets/jokerlanding.mp4'
import jokerFail from './assets/jokerfail.mp4'

// Both clips are green-screen footage (key color is roughly rgb(17, 254, 0)).
// Green is keyed out on a canvas so the page stays visible through it, while the
// blue wipe and Joker's black silhouette are drawn on top, like the game's cut-in.
//
//   fail    : starts see-through (old page), ends fully covered in blue
//   landing : starts fully covered in blue, opens up onto the new page, covers again
//
// navigateAt / fadeAt are in seconds of video time. navigate while the screen is
// covered in blue so the swap can't be seen, then fade the blue out.
const CLIPS = {
  landing: { src: jokerLanding, navigateAt: 0, fadeAt: 2.6, cover: '#0400fd' },
  fail: { src: jokerFail, navigateAt: 1.4, fadeAt: 1.5, cover: 'transparent' },
}

const KEY_W = 960
const KEY_H = 540
const FADE_MS = 300
const SAFETY_MS = 7000

const overlayStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 10000000,
  display: 'none',
  pointerEvents: 'auto', // swallow clicks while the transition runs
}

const canvasStyle = { display: 'block', width: '100%', height: '100%' }

// The source <video>s stay mounted (and preloaded) but invisible; only the keyed
// canvas is shown.
const sourceStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 2,
  height: 2,
  opacity: 0,
  pointerEvents: 'none',
}

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

  // Leave nothing running if the provider unmounts mid-transition.
  useEffect(() => () => abortRef.current?.(), [])

  const start = useCallback((page) => {
    if (busyRef.current) return

    const to = `/${page}`
    const overlay = overlayRef.current
    const canvas = canvasRef.current
    const kind = Math.random() < 0.5 ? 'landing' : 'fail'
    const video = videoRefs.current[kind]
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (!overlay || !canvas || !video || reduceMotion) {
      navigateRef.current(to)
      return
    }

    busyRef.current = true
    const clip = CLIPS[kind]
    canvas.width = KEY_W
    canvas.height = KEY_H
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    let navigated = false
    let fading = false
    let stopped = false
    let rafId = 0
    let fadeTimer = 0
    let safetyTimer = 0
    let lastTime = -1
    let drewFirstFrame = false

    const go = () => {
      if (navigated) return
      navigated = true
      navigateRef.current(to, { state: { joker: true } })
    }

    const finish = () => {
      if (stopped) return
      stopped = true
      cancelAnimationFrame(rafId)
      clearTimeout(fadeTimer)
      clearTimeout(safetyTimer)
      video.onended = null
      video.pause()
      try {
        video.currentTime = 0 // so the next run starts on a fresh first frame
      } catch {
        /* ignore */
      }
      overlay.style.display = 'none'
      overlay.style.transition = 'none'
      overlay.style.opacity = '1'
      ctx.clearRect(0, 0, KEY_W, KEY_H)
      busyRef.current = false
      abortRef.current = null
    }

    const fadeOut = () => {
      if (fading || stopped) return
      fading = true
      go()
      overlay.style.transition = `opacity ${FADE_MS}ms ease`
      overlay.style.opacity = '0'
      fadeTimer = setTimeout(finish, FADE_MS + 40)
    }

    const drawKeyed = () => {
      ctx.drawImage(video, 0, 0, KEY_W, KEY_H)
      const frame = ctx.getImageData(0, 0, KEY_W, KEY_H)
      const px = frame.data
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i]
        const g = px[i + 1]
        const b = px[i + 2]
        // How much greener than red/blue this pixel is: ~237 for the key color,
        // ~0 for black/white/blue. Partial values are anti-aliased edges.
        const dominance = g - (r > b ? r : b)
        if (dominance > 40) {
          px[i + 3] = dominance >= 200 ? 0 : ((200 - dominance) * 255) / 160
          px[i + 1] = r > b ? r : b // despill: remove the green fringe
        }
      }
      ctx.putImageData(frame, 0, 0)
    }

    const tick = () => {
      if (stopped) return
      if (video.readyState >= 2 && video.currentTime !== lastTime) {
        lastTime = video.currentTime
        drawKeyed()
        if (!drewFirstFrame) {
          drewFirstFrame = true
          overlay.style.background = 'transparent'
        }
        if (lastTime >= clip.navigateAt) go()
        if (lastTime >= clip.fadeAt) {
          fadeOut() // the last frame is solid blue, so just fade that out
          return
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    abortRef.current = finish
    overlay.style.background = clip.cover
    overlay.style.transition = 'none'
    overlay.style.opacity = '1'
    overlay.style.display = 'block'

    video.onended = () => {
      go()
      fadeOut()
    }
    safetyTimer = setTimeout(() => {
      go()
      fadeOut()
    }, SAFETY_MS)

    video.currentTime = 0
    video
      .play()
      .then(() => {
        rafId = requestAnimationFrame(tick)
      })
      .catch(() => {
        go() // couldn't play the clip: just change page
        finish()
      })
  }, [])

  return (
    <JokerContext.Provider value={start}>
      {children}
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
    </JokerContext.Provider>
  )
}
