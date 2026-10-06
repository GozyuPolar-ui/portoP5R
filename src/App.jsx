import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import P5Menu from './P5Menu'
import ResumePage from './ResumePage'
import PageTransition from './PageTransition'
import Socials from './Socials'
import AboutMe from './AboutMe'
import SideProjectsPage from './SideProjectsPage'
import { JokerTransitionProvider } from './JokerTransition'
import { useJokerNavigate } from './jokerContext'
import mainVideo from './assets/main1.mp4'
import './App.css'

const BGM_STATE_KEY = 'p5-bgm-enabled'
const BGM_VOLUME_KEY = 'p5-bgm-volume'
const DEFAULT_VOLUME = 0.45
const FADE_MS = 450

function useTouchGestures() {
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;
    const DRAG_THRESHOLD = 10;   

    const onTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isDragging = false;
    };

    const onTouchMove = (e) => {
      const currentX = e.changedTouches[0].screenX;
      const currentY = e.changedTouches[0].screenY;
      const distance = Math.hypot(currentX - touchStartX, currentY - touchStartY);
      
      if (distance > DRAG_THRESHOLD) {
        isDragging = true;
      }
    };

    const onClickCapture = (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        isDragging = false;
        return false;
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('click', onClickCapture, true);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('click', onClickCapture, true);
    };
  }, []);
}

function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  // Do not render on the main menu
  if (location.pathname === '/') return null;

  return (
    <div className="back-btn-wrapper">
      <style>{`
        .back-btn-wrapper {
          position: absolute;
          top: 3.5cqh;
          left: 2.5cqw;
          z-index: 10000;
          pointer-events: all;
        }

        .p5-back-button {
          display: flex;
          align-items: center;
          gap: 0.35cqw;
          background: #d92323;
          color: #ffffff;
          border: none;
          padding: 0.4cqh 0.8cqw 0.4cqh 0.6cqw;
          font-family: 'Persona5Main', 'Bebas Neue', sans-serif;
          font-size: 1.0cqw;
          letter-spacing: 0.1cqw;
          cursor: pointer;
          clip-path: polygon(0.4cqw 0%, 100% 0%, calc(100% - 0.4cqw) 100%, 0% 100%);
          box-shadow: 0.15cqw 0.15cqh 0px #000000;
          transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease; 
        }

        .p5-back-button:hover, .p5-back-button:focus {
          background: #ff2a2a;
          transform: translate(-0.1cqw, -0.1cqh);
          box-shadow: 0.25cqw 0.25cqh 0px #000000;
          outline: none;
        }

        .p5-back-button:active {
          transform: translate(0.05cqw, 0.05cqh);
          box-shadow: 0.1cqw 0.1cqh 0px #000000;
        }

        .back-arrow-icon {
          width: 1.0cqw;
          height: 1.0cqw;
          min-width: 12px;
          min-height: 12px;
          stroke: #ffffff;
          stroke-width: 2.5;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: transform 0.2s ease;
        }

        .p5-back-button:hover .back-arrow-icon {
          transform: translateX(-0.2cqw);
        }

        /* Mobile specific scaling */
@media (hover: none) and (pointer: coarse) and (orientation: landscape), (max-height: 500px) {
          .back-btn-wrapper {
            top: max(16px, env(safe-area-inset-top));
            left: max(16px, env(safe-area-inset-left));
          }
          .p5-back-button {
            font-size: 14px;
            padding: 6px 12px 6px 10px;
            gap: 6px;
            clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
            box-shadow: 2px 2px 0px #000000;
          }
          .back-arrow-icon {
            width: 16px;
            height: 16px;
          }
          .p5-back-button:hover, .p5-back-button:focus {
            transform: translate(-1px, -1px);
            box-shadow: 3px 3px 0px #000000;
          }
        }
      `}</style>

      <button
        type="button"
        className="p5-back-button"
        onClick={() => navigate('/')}
        aria-label="Return to Main Menu"
      >
        <svg className="back-arrow-icon" viewBox="0 0 24 24">
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
        <span>BACK</span>
      </button>
    </div>
  );
}

function BackgroundMusic() {
  const audioRef = useRef(null)
  const fadeRafRef = useRef(null)
  const autoStartRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => {
    const saved = Number(localStorage.getItem(BGM_VOLUME_KEY))
    if (Number.isFinite(saved)) return Math.min(1, Math.max(0, saved))
    return DEFAULT_VOLUME
  })

  const stopFade = () => {
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
  }

  const fadeTo = (target, done) => {
    const audio = audioRef.current
    if (!audio) return
    
    stopFade()
    const start = audio.volume
    const diff = target - start
    const begin = performance.now()

    const tick = (now) => {
      const p = Math.min(1, (now - begin) / FADE_MS)
      audio.volume = start + diff * p
      if (p < 1) {
        fadeRafRef.current = requestAnimationFrame(tick)
        return
      }
      fadeRafRef.current = null
      if (done) done()
    }

    fadeRafRef.current = requestAnimationFrame(tick)
  }

 const startMusic = async () => {
    const audio = audioRef.current
    if (!audio) return

    stopFade()
    audio.volume = 0

    try {
      await audio.play()
      fadeTo(volume)
      setIsPlaying(true)
      autoStartRef.current = false
    } catch {
      setIsPlaying(false)
    }
  }

  const stopMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    fadeTo(0, () => {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
    })
  }

  const toggleMusic = async () => {
    if (isPlaying) {
      stopMusic()
      return
    }

    await startMusic()
  }

  const onVolumeChange = (e) => {
    const next = Number(e.target.value)
    setVolume(next)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.volume = volume
    localStorage.setItem(BGM_VOLUME_KEY, String(volume))
  }, [volume, isPlaying])

  useEffect(() => {
    localStorage.setItem(BGM_STATE_KEY, isPlaying ? '1' : '0')
  }, [isPlaying])

  useEffect(() => {
    const shouldAutoStart = localStorage.getItem(BGM_STATE_KEY) === '1'
    if (!shouldAutoStart) return

    autoStartRef.current = true
    const tryAutoplay = async () => {
      if (!autoStartRef.current) return
      await startMusic()
    }

    const unlock = async () => {
      if (!autoStartRef.current) return
      await tryAutoplay()
    }

    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })
    window.addEventListener('touchend', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('touchend', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  useEffect(() => () => stopFade(), [])

  return (
    <div className="bgm-panel">
      {/* Hide BGM button when the orientation alert is triggered on mobile */}
      <style>{`
        @media (hover: none) and (pointer: coarse) and (orientation: portrait) {
          .bgm-panel {
            display: none !important;
          }
        }
      `}</style>
      <audio ref={audioRef} loop preload="none" src="/audio/background.mp3" />
      <button
        className={`bgm-toggle${isPlaying ? ' on' : ''}`}
        type="button"
        onClick={(e) => {
          toggleMusic()
          e.currentTarget.blur()
        }}
        aria-label={isPlaying ? 'Disable background music' : 'Enable background music'}
      >
        {isPlaying ? 'BGM ON' : 'BGM OFF'}
      </button>

<div className="bgm-slider-wrap" aria-label="Background music volume">
        <span className="bgm-slider-label"style={{ color: '#ffffff' }}>VOL</span>
        <input
          className="bgm-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          onKeyDown={(e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
              e.preventDefault()
            }
          }}
        />
        <span className="bgm-slider-value">{Math.round(volume * 100)}</span>
      </div>
    </div>
  )
}

function MenuScreen() {
  const navigate = useNavigate()
  const jokerNavigate = useJokerNavigate()

  const handleNavigate = (page) => {
    if (page === 'github') {
      window.open('https://github.com/GozyuPolar-ui', '_blank', 'noopener,noreferrer')
      return
    }
    // Joker landing / fail clip (random), which navigates once the screen is covered
    if (jokerNavigate) {
      jokerNavigate(page)
      return
    }
    navigate(`/${page}`)
  }

  return (
    <div id="menu-screen">
      <P5Menu onNavigate={handleNavigate} />
    </div>
  )
}

// These pages draw their own full-screen copy of the background video on top,
// so the one underneath would be decoded for nothing. Pause it once the page is
// covered (after the entry animation), resume when going back to the menu.
const OWN_VIDEO_PATHS = ['/socials', '/resume']
const COVER_DELAY_MS = 1400

function SiteBackgroundVideo() {
  const location = useLocation()
  const videoRef = useRef(null)
  const covered = OWN_VIDEO_PATHS.includes(location.pathname)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!covered) {
      video.play().catch(() => {})
      return
    }
    const t = setTimeout(() => video.pause(), COVER_DELAY_MS)
    return () => clearTimeout(t)
  }, [covered])

  return (
    <>
      <style>{`
        .site-bg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }


        @media (hover: none) and (pointer: coarse) and (orientation: landscape), (max-height: 500px) {
          .site-bg-video {
            object-position: center 3%;
            top: -8vh;
            height: 110%;
            transform: none;
          }
        }
      `}</style>
      <video
        ref={videoRef}
        className="site-bg-video"
        src={mainVideo}
        poster="/main-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        aria-hidden="true"
      />
    </>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><MenuScreen /></PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition variant="about"><AboutMe /></PageTransition>
        } />
        <Route path="/resume" element={
          <PageTransition><ResumePage /></PageTransition>
        } />
        <Route path="/socials" element={
          <PageTransition variant="socials"><Socials /></PageTransition>
        } />
        <Route path="/sideproj" element={
          <PageTransition><SideProjectsPage /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function OrientationOverlay() {
  return (
    <div className="orientation-guard" aria-hidden="true">
      <style>{`
        .orientation-guard {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(13, 13, 13, 0.88);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          color: #ffffff;
          pointer-events: all;
        }

        @media (hover: none) and (pointer: coarse) and (orientation: portrait) {
          .orientation-guard {
            display: flex;
          }
        }

        .og-badge {
          font-family: 'Persona5Main', sans-serif;
          background: #d92323;
          color: #ffffff;
          font-size: 24px;
          letter-spacing: 2px;
          padding: 6px 18px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          margin-bottom: 24px;
          box-shadow: 4px 4px 0 #000000;
        }

        .og-title {
          font-family: 'Persona5Main', sans-serif;
          font-size: 42px;
          line-height: 1;
          letter-spacing: 1px;
          margin-bottom: 12px;
          text-shadow: 0 4px 0 rgba(0,0,0,0.5);
        }

        .og-subtitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.8);
          max-width: 320px;
          margin-bottom: 40px;
        }

        .og-phone-icon {
          width: 76px;
          height: 76px;
          stroke: #ffffff;
          stroke-width: 2;
          fill: none;
          animation: og-rotate-animation 2.4s infinite cubic-bezier(0.65, 0, 0.35, 1);
        }

        @keyframes og-rotate-animation {
          0%, 15% { transform: rotate(0deg); }
          50%, 65% { transform: rotate(-90deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

      <div className="og-badge">SYSTEM ALERT</div>
      <div className="og-title">ROTATE DEVICE</div>
      <div className="og-subtitle">
        Please turn your phone to a horizontal 16:9 widescreen view to access the interface.
      </div>

      <svg className="og-phone-icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    </div>
  );
}

export default function App() {
  useTouchGestures()

  return (
    <div className="stage-container">
      <SiteBackgroundVideo />
      <OrientationOverlay />
      <div className="stage-viewport">
        <JokerTransitionProvider>
          <BackButton />
          <div className="site-content-layer">
            <AnimatedRoutes />
          </div>
          <BackgroundMusic />
        </JokerTransitionProvider>
      </div>
    </div>
  )
}
