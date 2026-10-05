import { useState, useEffect, useRef } from "react";
import { playSelectSound } from "./utils/audio.js";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import icon1 from "./assets/icon1.png";
import icon2 from "./assets/icon2.png";
import icon3 from "./assets/icon3.png";
import mainm from "./assets/mainm.jpeg";
import mainm2 from "./assets/mainm2.jpeg";
import mainf from "./assets/mainf.jpeg";

const CHARS = [char1, char2, char3];
const MAIN_IMAGES = [mainm, mainm2, mainf];
const ICONS = [icon1, icon2, icon3];

const REVEAL_CONTENT = [
  {
    title: "ABOUT ME",
    upper: [
      "Self-taught developer crafting web, games, and AI tools",
      "Computer Science student at Universitas Sumatera Utara",
    ],
    lower: "Name: Matius Remon  | Age: 19 | Location: Indonesia",
  },
  {
    title: "EXPERIENCE",
    upper: [
      "IT Support Intern at Bank Danamon,",
      "IT Support at Dinas Ketenagakerjaan,",
      "and Computer Lab Assistant at Universitas Prima.",
    ],
    lower: "IT Support | Lab Assistant | Web & Game Dev",
  },
  {
    title: "LANGUAGES",
    upper: [
      "Indonesian (Native), English (Professional)",
      "Mandarin (Basic)",
      "Fluent in code, too: JavaScript, Python, and more",
    ],
    lower: "GitHub: @GozyuPolar-ui",
  },
];

const ITEMS = [
  { id: "PERSONA", label: "PERSONA" },
  { id: "EXPERIENCE", label: "EXPERIENCE" },
  { id: "LANGUAGES", label: "LANGUAGES" },
];

export default function AboutMe() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isFirstRenderAudio = useRef(true);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isFirstRenderAudio.current) {
      isFirstRenderAudio.current = false;
      return;
    }
    playSelectSound();
  }, [active]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
      if (e.key === "ArrowDown")
        setActive((i) => Math.min(ITEMS.length - 1, i + 1));
      if (e.key === "Enter") setRevealed(true);
      if (e.key === "ArrowRight") setRevealed(true);
      if (e.key === "ArrowLeft") {
        if (revealed) setRevealed(false);
        else navigate(-1);
      }
      if (e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, revealed]);

  return (
    <div id="menu-screen">
      {revealed && <div key={`dim-${active}`} className="sc-dim" />}
      {revealed && (
        <div
          key={`panel-${active}`}
          className={`sc-reveal-panel${mounted ? " mounted" : ""}`}
        >
          <div className="sc-reveal-upper-bar">
            {/* Added Card Header Title */}
            <div className="sc-reveal-title">
              {REVEAL_CONTENT[active].title}
            </div>
            {REVEAL_CONTENT[active].upper.map((line) => (
              <div className="sc-reveal-upper-line" key={line}>
                {line}
              </div>
            ))}
          </div>
          <div className="sc-reveal-lower-bar">
            {REVEAL_CONTENT[active].lower}
          </div>
        </div>
      )}
      {revealed && (
        <div key={`nav-${active}`} className="sc-right-nav">
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">LB</span>
          <span className="sc-nav-dot" />
          <span className="sc-nav-btn">RB</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}
      {revealed && (
        <div
          key={`portrait-${active}`}
          className={`sc-main-portrait-shell${mounted ? " mounted" : ""}`}
        >
          <img
            className="sc-main-portrait"
            src={MAIN_IMAGES[active]}
            alt=""
          />
        </div>
      )}

      <style>{`
        /* =========================================================
           GLOBAL OVERRIDE: Remove 16:9 pillarbox overlay
           ========================================================= */
        #menu-screen {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          outline: none !important;
        }

        #menu-screen::before,
        #menu-screen::after {
          display: none !important;
        }

        .sc-root {
          position: absolute;
          inset: 0;
          z-index: 900000 !important;
          left: max(4.5cqw, env(safe-area-inset-left));
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 1.8cqh;
          padding-left: 0;
        }

        .sc-dim {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 900010 !important;
          background: rgba(13,13,13,0.68);
          pointer-events: none;
          animation: sc-dim-in 0.32s ease-out;
        }

        @keyframes sc-dim-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes sc-reveal-bar-in {
          0% {
            opacity: 0;
            transform: translateX(-6.5cqw) rotate(-20deg) scaleX(0.72);
          }
          60% {
            opacity: 0.96;
            transform: translateX(1cqw) rotate(-20deg) scaleX(1.03);
          }
          100% {
            opacity: 0.92;
            transform: translateX(0) rotate(-20deg) scaleX(1);
          }
        }

        @keyframes sc-portrait-in {
          0% {
            opacity: 0;
            transform: translateX(4.2cqw) skewX(-8deg) scale(0.94);
            filter: blur(8px);
          }
          55% {
            opacity: 1;
            transform: translateX(-0.4cqw) skewX(-8deg) scale(1.015);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateX(0) skewX(-8deg) scale(1);
            filter: blur(0);
          }
        }

        @keyframes sc-arrow-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-0.3cqw); opacity: 0.4; }
        }

        @keyframes sc-arrow-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(0.3cqw); opacity: 0.4; }
        }

        /* ── Main Portrait Shell ── */
        .sc-main-portrait-shell {
          position: absolute;
          top: 0;
          right: -2cqw;
          z-index: 900025 !important;
          pointer-events: none;
          width: 38cqw;
          height: 100cqh;
          overflow: hidden;
          opacity: 0;
          transform: translateX(1.3cqw) skewX(-8deg) scale(0.98);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .sc-main-portrait-shell.mounted {
          opacity: 1;
          transform: translateX(0) skewX(-8deg) scale(1);
          animation: sc-portrait-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sc-main-portrait {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top right;
          transform: skewX(8deg) scale(1.08);
          transform-origin: top right;
        }

        /* ── Reveal Container & Text Bars ── */
        .sc-reveal-panel {
          position: absolute;
          top: 42cqh;
          left: 14cqw;
          width: 85cqw;
          height: 58cqh;
          z-index: 900035 !important;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.98) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 4.8cqw) 100%, 0 100%);
          box-shadow:
            0 0 0 0.1cqw rgba(255,255,255,0.18),
            1cqw 0 0 rgba(217,35,35,0.82),
            1.5cqw 0 0 rgba(255,255,255,0.26);
          opacity: 0;
          transform: translateX(-2.2cqw) rotate(-20deg);
          transform-origin: left bottom;
          transition: opacity 0.3s ease, transform 0.35s ease;
        }
        .sc-reveal-panel.mounted {
          opacity: 0.94;
          transform: translateX(0) rotate(-20deg);
          animation: sc-reveal-bar-in 0.46s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-reveal-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 0.8cqh;
          background: #d92323;
          clip-path: inherit;
        }

        /* Upper Container */
        .sc-reveal-upper-bar {
          position: absolute;
          top: 8%;
          left: 2%;
          width: 88%;
          height: 48%;
          background: rgba(13,13,13,0.94);
          clip-path: polygon(0 0, 100% 0, calc(100% - 1.8cqw) 100%, 0 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 0.6cqh;
          padding: 0 2cqw;
          color: #ffffff;
        }

        /* Card Title Style */
        .sc-reveal-title {
          font-family: 'Bebas Neue', 'Persona5Main', sans-serif;
          font-size: 1.5cqw;
          letter-spacing: 0.1cqw;
          color: #d92323;
          text-transform: uppercase;
          margin-bottom: 0.3cqh;
          line-height: 1;
        }

        .sc-reveal-upper-line {
          font-family: 'Persona5Main', sans-serif;
          font-weight: 400;
          font-size: 1.15cqw;
          letter-spacing: 0.03cqw;
          word-spacing: 0.2cqw;
          line-height: 1.4;
          white-space: nowrap;
          text-align: left;
        }

        /* Lower Container */
        .sc-reveal-lower-bar {
          position: absolute;
          top: 60%;
          left: 5%;
          width: 55%;
          height: 22%;
          background: rgba(13,13,13,0.94);
          clip-path: polygon(0 0, 100% 0, calc(100% - 1.5cqw) 100%, 0 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: #ffffff;
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 400;
          font-size: 1.35cqw;
          letter-spacing: 0.08cqw;
          padding-left: 1.8cqw;
        }

        @keyframes sc-right-nav-pop {
          0% { opacity: 0; transform: scale(0.55) translateY(-1cqh); }
          65% { opacity: 1; transform: scale(1.1) translateY(0.2cqh); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── L/R Navigation controls ── */
        .sc-right-nav {
          position: absolute;
          top: 14cqh;
          left: 9cqw;
          display: flex;
          align-items: center;
          gap: 0.35cqw;
          pointer-events: none;
          z-index: 900040 !important;
          transform: translateX(-2.2cqw) rotate(-20deg);
          transform-origin: left bottom;
          animation: sc-right-nav-pop 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sc-right-nav .sc-nav-btn {
          font-family: 'Persona5Main', sans-serif;
          font-size: 5.5cqw;
          letter-spacing: 0.16cqw;
          line-height: 1;
          user-select: none;
          color: #ffffff;
          -webkit-text-stroke: 0.1cqw #0d0d0d;
          paint-order: stroke fill;
          background: none;
          border: none;
          padding: 0 0.3cqw;
        }
        .sc-right-nav .sc-nav-dot {
          width: 0.9cqw;
          height: 0.9cqw;
          border-radius: 999px;
          background: #111;
          margin: 0 0.55cqw;
          flex-shrink: 0;
        }
        .sc-right-nav .sc-nav-arrow {
          font-family: 'Persona5Main', sans-serif;
          font-size: 1.2cqw;
          color: #d92323;
          display: inline-block;
          user-select: none;
        }
        .sc-right-nav .sc-nav-arrow.left { animation: sc-arrow-left 0.8s ease-in-out infinite; }
        .sc-right-nav .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

        /* ── Menu Bars ── */
        .sc-bar {
          position: relative;
          width: 45cqw;
          height: 6.5cqh;
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
          background: #111;
          cursor: pointer;
          pointer-events: none;
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.75cqw) 100%, 0 100%);
          box-shadow: 0 0.6cqh 2.4cqh rgba(13,13,13,0.65);
          z-index: 1;
          transform: skewX(-18deg);
        }

        .sc-bar-outer {
          position: relative;
          pointer-events: auto !important;
          cursor: pointer !important;
          flex-shrink: 0;
          transform: translateX(-100%);
          transition: transform .22s ease, filter .22s ease;
          outline: none;
          z-index: 10;
        }

        .sc-bar-outer:nth-child(1) { z-index: 30; }
        .sc-bar-outer:nth-child(2) { z-index: 20; }
        .sc-bar-outer:nth-child(3) { z-index: 10; }

        .sc-bar-outer:hover,
        .sc-bar-outer.active {
          z-index: 50 !important;
        }

        .sc-bar-outer:hover {
          transform: translateX(1cqw) scale(1.02) rotate(-1deg);
          filter: drop-shadow(0 0 1cqw rgba(217,35,35,.55));
        }

        .sc-bar-outer.active:hover {
          animation: none;
          transform: translateX(1.3cqw) scale(1.04) rotate(-1deg);
          filter: drop-shadow(0 0 1.2cqw rgba(217,35,35,.8));
        }

        .sc-bar-outer:hover .sc-label,
        .sc-bar-outer.active:hover .sc-label {
          color: #000000;
          text-shadow: none;
        }

        .sc-bar-outer:hover .sc-char {
          transform: scale(1.08) translateX(-0.3cqw);
          transition: .25s;
        }

        .sc-bar-outer.active:not(:hover) .sc-label {
          color: black;
          text-shadow: none;
        }

        .sc-bar-outer.active { height: 9cqh; }
        .sc-bar-outer.active .sc-bar { height: 9cqh; }
        .sc-bar-outer.active .sc-bar-red { height: 9cqh; opacity: 1; }
        .sc-bar-outer.mounted { transform: translateX(0); }
        .sc-bar-outer:nth-child(1) { transition-delay: 0ms; }
        .sc-bar-outer:nth-child(2) { transition-delay: 80ms; }
        .sc-bar-outer:nth-child(3) { transition-delay: 160ms; }

        .sc-bar-red {
          position: absolute;
          top: 0; left: 0;
          width: 45cqw;
          height: 6.5cqh;
          background: #d92323;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 0.55cqw) 100%);
          transform: translateY(-0.7cqh);
          opacity: 0;
          transition: opacity 0.2s ease, height 0.3s cubic-bezier(0.22,1,0.36,1);
          z-index: 0;
          pointer-events: none;
        }

        .sc-bar-outer.active::before {
          content: "";
          position: absolute;
          left: -4.5cqw;
          top: 50%;
          width: 7cqw;
          height: 0.8cqh;
          background: #d92323;
          transform: translateY(-50%) rotate(-28deg);
          z-index: -1;
        }

        .sc-bar-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          transform: translateX(100%);
          background: #ffffff;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 1.75cqw) 100%, calc(100% - 1.75cqw) 100%);
          transition: transform .35s cubic-bezier(0.22, 1, 0.36, 1), clip-path .35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        .sc-bar-outer.active .sc-bar-fill {
          transform: translateX(0);
          clip-path: polygon(22% 0, 100% 0, calc(100% - 0.75cqw) 100%, calc(22% + 7.5cqw) 100%);
        }

        .sc-bar-shade {
          position: absolute;
          top: 0; bottom: 0;
          left: 73%;
          width: 6%;
          background: linear-gradient(90deg, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0) 100%);
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .sc-bar-outer.active .sc-bar-shade { opacity: 1; }

        .sc-bar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 0.6cqh;
          background: linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0.55) 100%);
          z-index: 10;
          pointer-events: none;
        }

        .sc-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.1cqw 0 1.1cqw;
          transform: skewX(18deg);
        }

        .sc-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.3cqh;
          padding-left: 4.2cqw;
        }
        .sc-main-top {
          display: flex;
          align-items: center;
          gap: 0.65cqw;
        }

        .sc-icon {
          width: 1.75cqw;
          height: auto;
          object-fit: contain;
          flex-shrink: 0;
          opacity: 0.6;
          transition: opacity 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-icon { opacity: 1; }

        .sc-label {
          font-family: 'Persona5Main', sans-serif;
          font-size: 1.55cqw;
          letter-spacing: 0.22cqw;
          line-height: 1;
          color: rgba(255,255,255,0.85);
          transition: color 0.2s ease;
          user-select: none;
        }

        .sc-char {
          position: absolute;
          top: 0;
          left: 6cqw;
          height: 100%;
          width: auto;
          max-width: 8.8cqw;
          object-fit: cover;
          object-position: top;
          pointer-events: none;
          z-index: 3;
          clip-path: polygon(1.1cqw 0%, 100% 0%, calc(100% - 1.1cqw) 100%, 0% 100%);
        }

        .sc-footer {
          position: absolute;
          bottom: max(2.6cqh, env(safe-area-inset-bottom)); 
          right: max(1.7cqw, env(safe-area-inset-right));
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 0.5cqh;
          font-family: 'Persona5Main';
          opacity: 0;
          transition: opacity 0.5s ease 0.9s;
        }
        .sc-footer.mounted { opacity: 1; }
        
        .sc-footer-row {
          display: flex; align-items: center; gap: 0.5cqw;
          font-size: 0.8cqw; letter-spacing: 0.12cqw;
          color: rgba(255,255,255,0.28);
        }
        
        .sc-footer-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 0.2cqw;
          padding: 0.1cqh 0.35cqw; font-size: 0.7cqw;
        }

        /* =========================================================
           MOBILE OPTIMIZATIONS
           ========================================================= */

        @media (hover: none) and (pointer: coarse) {
          .sc-footer {
            display: none !important;
          }
        }

        @media (hover: none) and (pointer: coarse) and (orientation: landscape), (max-height: 600px) {
          .sc-root {
            position: fixed !important;
            left: max(1.5vw, env(safe-area-inset-left)) !important;
            top: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            z-index: 900030 !important;
            transform: translateY(-9vh) !important; 
          }

          .sc-bar {
             height: 8.5vh !important;
             width: 42vw !important;
          }
          .sc-bar-outer.active { height: 11vh !important; }
          .sc-bar-outer.active .sc-bar { height: 11vh !important; }
          .sc-bar-outer.active .sc-bar-red { height: 11vh !important; }
          
          .sc-label {
            font-size: 2.2vw !important;
          }
          
          .sc-reveal-panel {
            position: fixed !important;
            top: 35vh !important;
            left: 8vw !important;
            width: 84vw !important;
            height: 62vh !important;
            z-index: 900035 !important;
          }

          .sc-reveal-title {
            font-size: 2.5vw !important;
          }
          
          .sc-reveal-upper-line {
            font-size: 2.1vw !important;
            word-spacing: 0.3vw !important;
          }
          
          .sc-reveal-lower-bar {
            font-size: 2.3vw !important;
            padding-left: 2.5vw !important;
          }
          
          .sc-right-nav {
            position: fixed !important;
            top: 10vh !important;
            left: 5vw !important;
            z-index: 900040 !important;
          }
          .sc-right-nav .sc-nav-btn {
            font-size: 6.5vw !important;
          }

          .sc-main-portrait-shell {
            position: fixed !important;
            top: 0 !important;
            right: -2vw !important;
            width: 30vw !important;
            height: 100vh !important;
            z-index: 900025 !important;
          }

          .sc-main-portrait {
            object-fit: contain !important;
            object-position: right top !important;
            transform: skewX(8deg) scale(0.85) !important;
            transform-origin: top right !important;
          }
        }
      `}</style>

      <div className="sc-root" role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            tabIndex={0}
            onFocus={() => setActive(i)}
            className={`sc-bar-outer${active === i ? " active" : ""}${
              mounted ? " mounted" : ""
            }`}
            onClick={() => {
              setActive(i);
              setRevealed(true);
            }}
            onMouseEnter={() => {
              setActive(i);
            }}
          >
            <div className="sc-bar-red" />
            <div className="sc-bar">
              <img className="sc-char" src={CHARS[i]} alt="" />
              <div className="sc-bar-fill" />
              <div className="sc-bar-shade" />
              <div className="sc-bar-content">
                <div className="sc-main">
                  <div className="sc-main-top">
                    {ICONS[i] && (
                      <img className="sc-icon" src={ICONS[i]} alt="" />
                    )}
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`sc-footer${mounted ? " mounted" : ""}`}>
        <div className="sc-footer-row">
          <span className="sc-footer-key">↑↓</span>
          <span>NAVIGATE</span>
        </div>
        <div className="sc-footer-row">
          <span className="sc-footer-key">↵</span>
          <span>CONFIRM</span>
        </div>
        <div className="sc-footer-row">
          <span className="sc-footer-key">ESC</span>
          <span>BACK</span>
        </div>
      </div>
    </div>
  );
}
