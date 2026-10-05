import { useState, useEffect, useRef } from "react";
import { playSelectSound } from "./utils/audio.js";

const ITEMS = [
  { id: "about",       label: "ABOUT ME",      page: "about",    fontSize: 4.0,  offsetX: 0,    offsetY: 0,   skew: -6, skewY: 10  },
  { id: "resume",      label: "RESUME",        page: "resume",   fontSize: 3.25, offsetX: 1.5,  offsetY: 5.5, skew: -4, skewY: 3   },
  { id: "sideproj",    label: "SIDE PROJECTS", page: "sideproj", fontSize: 2.8,  offsetX: 0.75, offsetY: 3.1, skew: -4, skewY: 7   },
  { id: "socials",     label: "SOCIALS",       page: "socials",  fontSize: 3.7,  offsetX: 1.2,  offsetY: 3.3, skew: -3, skewY: 5   },
  { id: "github link", label: "GITHUB LINK",   page: "github",   fontSize: 3.4,  offsetX: 0.6,  offsetY: 3.1, skew: 0,  skewY: -4  },
];

const CLIP_SHAPES = [
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
];

export default function P5Menu({ onNavigate }) {
  const [active, setActive] = useState(() => {
    const saved = sessionStorage.getItem('p5-menu-active');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [mounted, setMounted] = useState(false);
  const isFirstRenderAudio = useRef(true);
  const [animKey, setAnimKey] = useState(0);

  const activate = (idx) => {
    setActive(idx);
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    if (isFirstRenderAudio.current) {
      isFirstRenderAudio.current = false;
      return;
    }
    sessionStorage.setItem('p5-menu-active', active);
    playSelectSound();
  }, [active]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp")   activate(Math.max(0, active - 1));
      if (e.key === "ArrowDown") activate(Math.min(ITEMS.length - 1, active + 1));
      if (e.key === "Enter") {
        onNavigate?.(ITEMS[active].page);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onNavigate]);

  return (
    <>
      <style>{`
        /* =========================================================
           GLOBAL OVERRIDE
           ========================================================= */
        .bgm-panel {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          width: auto !important;
        }

        .p5-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          container-type: size;
          width: 100%;
          height: 100%;
        }

        .p5-stripe  { position:absolute; right:0; top:0; bottom:0; width:0.3cqw; background:#ffffff; z-index:10; pointer-events:none; }
        .p5-stripe2 { position:absolute; right:0.55cqw; top:0; bottom:0; width:0.12cqw; background:rgba(255,255,255,0.22); z-index:10; pointer-events:none; }

        .p5-menu {
          position: relative;
          z-index: 20;
          padding: 3cqw;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2cqh;
          pointer-events: all;
          --scale: 1;
          --y-scale: 1;
        }

        .p5-row {
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          text-decoration: none;
          opacity: 0;
          transform: translateX(2.2cqw);
          transition: opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1);
          margin-right: calc(var(--item-x) * var(--scale));
          margin-top: calc(var(--item-y) * var(--y-scale));
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .p5-row.mounted {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        .p5-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 120%; height: 200%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 70%);
          filter: blur(18px);
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .p5-row.active .p5-glow { opacity: 1; }

        .p5-skew-wrap {
          position: relative;
          display: flex;
          align-items: center;
          isolation: isolate;
          transform: skewX(var(--item-skew)) skewY(var(--item-skew-y));
        }

        @keyframes p5-shadow-pop {
          0%   { transform: translateY(-40%) translateX(-0.75cqw) scaleX(0) scaleY(1); }
          55%  { transform: translateY(-46%) translateX(-0.95cqw) scaleX(1.22) scaleY(1.18); }
          75%  { transform: translateY(-39%) translateX(-0.7cqw) scaleX(0.96) scaleY(0.97); }
          100% { transform: translateY(-40%) translateX(-0.75cqw) scaleX(1) scaleY(1); }
        }

        @keyframes p5-wiggle-poly {
          0%   { clip-path: polygon(0% 56%, 16% 0%, 76% 7%, 100% 24%, 94% 100%, 8% 88%); }
          25%  { clip-path: polygon(0% 62%, 12% 6%, 84% 0%, 100% 34%, 88% 100%, 2% 94%); }
          50%  { clip-path: polygon(0% 40%, 28% 10%, 72% 0%, 100% 44%, 98% 92%, 14% 100%); }
          75%  { clip-path: polygon(0% 52%, 22% 0%, 80% 12%, 100% 28%, 90% 100%, 6% 82%); }
          100% { clip-path: polygon(0% 56%, 16% 0%, 76% 7%, 100% 24%, 94% 100%, 8% 88%); }
        }

        .p5-shadow-tri {
          position: absolute;
          top: 50%;
          transform-origin: left center;
          background: rgba(255,255,255,0.85);
          z-index: 1;
          pointer-events: none;
          transform: translateY(-40%) translateX(calc(-0.75cqw * var(--scale))) scaleX(0);
          transition: transform 0.18s ease;
          width: calc(var(--item-w) * var(--scale));
          height: calc(var(--item-h) * var(--scale));
        }
        .p5-shadow-tri.pop {
          animation: p5-shadow-pop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .p5-highlight {
          position: absolute;
          top: 50%;
          transform-origin: left center;
          background: #0dd9ff;
          z-index: 2;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
          width: calc(var(--item-w) * var(--scale));
          height: calc(var(--item-h) * var(--scale));
          transform: translateY(-50%) scaleX(0);
        }
        .p5-row.active .p5-highlight {
          animation: p5-wiggle-poly 0.66s ease-in-out infinite;
          transform: translateY(-50%) scaleX(1);
        }

        .p5-label-wrap {
          position: relative;
          z-index: 3;
        }

        .p5-label-base {
          font-family: 'Persona5Main';
          font-style: italic;
          letter-spacing: calc(0.04cqw * var(--scale));
          line-height: 0.85;
          display: block;
          white-space: nowrap;
          user-select: none;
          color: #ffffff;
          -webkit-text-stroke: calc(1.1cqw * var(--scale)) rgba(0, 0, 0, 0.8);
          paint-order: stroke fill;
          font-size: calc(var(--item-font) * var(--scale));
        }

        .p5-label-dark {
          color: #f6f3f3;
          transition: color 0.12s ease;
        }
        .p5-row.active .p5-label-dark { color: #ffffff; }
        .p5-row:hover:not(.active) .p5-label-dark { color: #ffffff; }

        .p5-label-bright {
          color: #1a1a1a;
          -webkit-text-stroke: calc(1.1cqw * var(--scale)) rgba(255, 255, 255, 0.9);
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.12s ease;
        }
        .p5-row.active .p5-label-bright { opacity: 1; }

        .p5-hint {
          position: absolute;
          bottom: 2.6cqh; right: 1.7cqw;
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 0.5cqh;
          font-family: 'Persona5Main';
          opacity: 0;
          transition: opacity 0.5s ease 0.9s;
        }
        .p5-hint.mounted { opacity: 1; }
        .p5-hint-row {
          display: flex; align-items: center; gap: 0.5cqw;
          font-size: 0.8cqw; letter-spacing: 0.12cqw;
          color: rgba(255,255,255,0.28);
        }
        .p5-hint-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 0.2cqw;
          padding: 0.1cqh 0.35cqw; font-size: 0.7cqw;
        }

        .p5-name-tag {
          position: absolute;
          top: 4.6cqh;
          left: 2.5cqw;
          z-index: 20;
          font-family: 'FuturaStdBold';
          font-style: italic;
          font-size: 1.8cqw;
          line-height: 1.0;
          letter-spacing: 0.12cqw;
          color: white;
          text-shadow: 0.2cqw 0.3cqh 0 rgba(0,0,0,.35);
          transform: rotate(0deg) skewX(-5deg) scaleX(1.08);
          transform-origin: left top;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          user-select: none;
          pointer-events: none;
          text-transform: uppercase;
        }
        .p5-name-tag span:first-child {
          font-size: 2.2cqw;
          letter-spacing: -0.12cqw;
        }
        .p5-name-tag span:last-child {
          margin-top: 0.6cqh;
          font-size: 4.2cqw;
          letter-spacing: -0.25cqw;
        }

        /* =========================================================
           MOBILE OPTIMIZATIONS (PORTRAIT & LANDSCAPE)
           ========================================================= */
        @media (max-width: 768px) {
          .p5-overlay {
            justify-content: flex-start;
            align-items: flex-start;
          }
          .p5-menu {
            --scale: 1.2;
            --y-scale: 0.75;
            align-items: flex-start;
            margin-left: max(5cqw, env(safe-area-inset-left));
            padding-top: max(28cqh, env(safe-area-inset-top));
          }

         .p5-name-tag {
            top: max(4cqh, env(safe-area-inset-top));
            left: max(5cqw, env(safe-area-inset-left));
            transform: rotate(0deg) skewX(-5deg) scale(0.9);
          }
        }

       @media (hover: none) and (pointer: coarse) and (orientation: landscape), (max-height: 600px) {
          .p5-overlay {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            justify-content: flex-start;
            align-items: flex-start;
          }

          .p5-menu {
            --scale: 0.48; 
            --y-scale: 0.45;
            align-items: flex-start;
            margin-left: max(6vw, env(safe-area-inset-left));
            margin-right: auto;
            /* Slightly bumped gap from 0.5vh to 0.8vh */
            gap: 0.6vh; 
            /* Increased from 22vh to 24vh to center between title and bottom button */
            padding-top: max(24vh, calc(env(safe-area-inset-top) + 25vh));
            padding-bottom: max(3vh, env(safe-area-inset-bottom));
          }

          .p5-name-tag {
            top: max(5vh, env(safe-area-inset-top));
            left: max(6vw, env(safe-area-inset-left));
            transform: rotate(0deg) skewX(-5deg) scale(0.75);
          }

          .p5-row {
            padding: 0.8vh 0;
          }
        }

        /* Hide keyboard hints on touch devices */
        @media (hover: none) and (pointer: coarse) {
          .p5-hint {
            display: none !important;
          }
        }
      `}</style>

      <div className="p5-overlay">
        <div className="p5-name-tag">
          <span>RAYMOND'S</span>
          <span>PERSONA5</span>
        </div>

        <nav className="p5-menu">
          {ITEMS.map((item, i) => {
            const isActive = active === i;
            const dist = Math.abs(i - active);
            const opacity = isActive ? 1 : Math.max(0.5, 1 - dist * 0.2);
            
            const estW = item.label.length * item.fontSize * 0.6 + 5;
            const estH = item.fontSize * 0.94;
            const clipFn = CLIP_SHAPES[i] ?? CLIP_SHAPES[0];

            return (
              <a
                key={item.id}
                href="#"
                className={`p5-row ${isActive ? "active" : ""} ${mounted ? "mounted" : ""}`}
                style={{
                  '--item-x': `${item.offsetX}cqw`,
                  '--item-y': `${item.offsetY}cqh`,
                  '--item-font': `${item.fontSize}cqw`,
                  '--item-w': `${estW}cqw`,
                  '--item-h': `${estH}cqw`,
                  '--item-skew': `${item.skew}deg`,
                  '--item-skew-y': `${item.skewY}deg`,
                  transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                }}
                onClick={(e) => { e.preventDefault(); onNavigate?.(item.page); }}
                onMouseEnter={() => activate(i)}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="p5-glow" />
                <div className="p5-skew-wrap">
                  <div
                    key={isActive ? `pop-${i}-${animKey}` : `idle-${i}`}
                    className={`p5-shadow-tri${isActive ? ' pop' : ''}`}
                    style={{ clipPath: clipFn(estW, estH) }}
                  />
                  <div
                    className="p5-highlight"
                    style={{ clipPath: clipFn(estW, estH) }}
                  />
                  <div className="p5-label-wrap" style={{ opacity }}>
                    <span className="p5-label-base p5-label-dark">
                      {item.label}
                    </span>
                    <span
                      className="p5-label-base p5-label-bright"
                      style={{ clipPath: clipFn(estW, estH) }}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </nav>

        <div className={`p5-hint ${mounted ? "mounted" : ""}`}>
          <div className="p5-hint-row"><span className="p5-hint-key">↑↓</span><span>NAVIGATE</span></div>
          <div className="p5-hint-row"><span className="p5-hint-key">↵</span><span>CONFIRM</span></div>
        </div>
      </div>
    </>
  );
}
