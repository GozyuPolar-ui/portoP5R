import { useEffect, useState, useRef } from "react";
import { playSelectSound } from "./utils/audio.js";
import { useNavigate } from "react-router-dom";

const ITEMS = [
  {
    id: "Mists of Dawn",
    title: "The Mists of Dawn",
    stack: "RPG Maker MZ",
    summary: "An RPG featuring Rayy and Cath, built in RPG Maker MZ and deployed as an Android APK",
    href: "https://github.com/GozyuPolar-ui",
  },
  {
    id: "PixelValeWeb",
    title: "PixelValeWeb",
    stack: "Next.js, Supabase",
    summary: "An indie game distribution platform with a Gemini-powered AI support assistant",
    href: "https://github.com/GozyuPolar-ui",
  },
  {
    id: "E.D.I.T.H.",
    title: "E.D.I.T.H. AI Assistant",
    stack: "Python, WebSocket",
    summary: "A JARVIS-inspired desktop AI assistant with a Python WebSocket backend",
    href: "https://github.com/GozyuPolar-ui",
  },
  {
    id: "ExceedOG",
    title: "ExceedOG Portfolio",
    stack: "HTML, CSS, JavaScript, GSAP",
    summary: "A fan site replicating the KURO Games website in vanilla HTML, CSS, and JS with GSAP animations",
    href: "https://github.com/GozyuPolar-ui",
  },
];

export default function SideProjectsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isFirstRenderAudio = useRef(true);
  const detailPanelRef = useRef(null);

  useEffect(() => {
    if (isFirstRenderAudio.current) {
      isFirstRenderAudio.current = false;
      return;
    }
    playSelectSound();
  }, [active]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setActive((i) => Math.min(ITEMS.length - 1, i + 1));
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate]);

  // Handle tap on mobile: set active and smooth scroll to details panel
  const handleItemClick = (index) => {
    setActive(index);
    if (window.innerWidth <= 768 && detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div id="menu-screen">
      <style>{`
        #menu-screen {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: none !important;
          background: #000 !important;
          box-shadow: none !important;
          border: none !important;
          outline: none !important;
          overflow: hidden !important;
          container-type: size;
          z-index: 1;
        }

        /* Mobile Back Button */
        .mobile-back-btn {
          display: none;
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 50;
          background: #d92323;
          color: #fff;
          font-family: 'Persona5Main', sans-serif;
          font-size: 1.1rem;
          padding: 8px 16px;
          border: 2px solid #000;
          box-shadow: 3px 3px 0 #000;
          transform: skew(-10deg);
          cursor: pointer;
          pointer-events: all;
          letter-spacing: 1px;
        }

        .sp-shell {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: grid;
          grid-template-columns: 48% 52%;
          grid-template-rows: auto 1fr;
          column-gap: 1.5cqw;
          padding: 10cqh 5cqw 6cqh 5cqw;
          overflow: hidden;
        }

        .sp-title {
          grid-column: 1;
          grid-row: 1;
          font-family: 'Persona5Main', sans-serif;
          font-size: 3.75cqw;
          color: #ffffff;
          line-height: 0.92;
          letter-spacing: 0.05cqw;
          text-shadow: 0 0.2cqh 0 rgba(13,13,13,0.3);
          margin-bottom: 1.5cqh;
          opacity: 0;
          transform: translateX(-1.25cqw);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .sp-title.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .sp-left {
          grid-column: 1;
          grid-row: 2;
          display: flex;
          flex-direction: column;
          gap: 1.1cqh;
        }

        .sp-item {
          position: relative;
          min-height: 8.7cqh;
          background: rgba(13,13,13,0.94);
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.7cqw) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14), 0 0.75cqh 1.5cqh rgba(13,13,13,0.35);
          padding: 1.3cqh 0.8cqw;
          cursor: pointer;
          opacity: 0;
          transform: translateX(-1.8cqw);
          transition: transform 0.24s ease, background 0.24s ease, opacity 0.4s ease;
        }
        .sp-item.mounted {
          opacity: 1;
          transform: translateX(0);
        }
        .sp-item.active {
          background: rgba(255, 255, 255, 0.97);
          transform: translateX(0.3cqw);
        }

        .sp-item-title {
          font-family: 'FuturaStdBold', sans-serif;
          font-size: 2.6cqw;
          line-height: 1.2;
          color: #ffffff;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding-bottom: 0.1em;
        }
        .sp-item.active .sp-item-title {
          color: #111;
        }

        .sp-item-stack {
          font-family: 'Persona5Main', sans-serif;
          font-size: 1.35cqw;
          letter-spacing: 0.07cqw;
          color: #ffffff;
          margin-top: 0.37cqh;
        }
        .sp-item.active .sp-item-stack {
          color: #0d0d0d;
        }

        .sp-right {
          grid-column: 2;
          grid-row: 2;
          position: relative;
          background: linear-gradient(180deg, rgba(13,13,13,0.96) 0%, rgba(13,13,13,0.96) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.9cqw) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), 0.6cqw 1.1cqh 0 rgba(13,13,13,0.5);
          padding: 2.2cqh 1.25cqw 3cqh 1.25cqw;
          overflow: hidden;
          align-self: start;
        }

        .sp-tag {
          display: inline-block;
          font-family: 'Persona5Main', sans-serif;
          font-size: 1.25cqw;
          letter-spacing: 0.08cqw;
          background: #ffffff;
          color: #0d0d0d;
          padding: 0.37cqh 0.5cqw;
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.4cqw) 100%, 0 100%);
        }

        .sp-right-title {
          font-family: 'FuturaStdBold', sans-serif;
          font-size: 4cqw;
          line-height: 1.1;
          color: #ffffff;
          margin-top: 1.5cqh;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding: 0.1em;
        }

        .sp-right-summary {
          margin-top: 1.5cqh;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2cqw;
          line-height: 1.05;
          letter-spacing: 0.05cqw;
          color: #ffffff;
        }

        .sp-link {
          margin-top: 2.6cqh;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.45cqw;
          letter-spacing: 0.05cqw;
          color: #ffffff;
          background: #d92323;
          display: inline-flex;
          align-items: center;
          padding: 0.75cqh 0.9cqw;
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.5cqw) 100%, 0 100%);
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
        }
        .sp-link:hover {
          background: #ffffff;
          color: #0d0d0d;
          transform: translateX(0.3cqw) scale(1.02);
          box-shadow: -0.3cqw 0 0 #d92323;
        }

        .sp-footer {
          position: absolute;
          bottom: 2.6cqh; right: 1.7cqw;
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 0.5cqh;
          font-family: 'Persona5Main', sans-serif;
          opacity: 0;
          transition: opacity 0.5s ease 0.9s;
        }

        .sp-footer.mounted { opacity: 1; }

        .sp-footer-row {
          display: flex; align-items: center; gap: 0.5cqw;
          font-size: 0.8cqw; letter-spacing: 0.12cqw;
          color: rgba(255,255,255,0.28);
        }

        .sp-footer-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 0.2cqw;
          padding: 0.1cqh 0.35cqw; font-size: 0.7cqw;
        }

        /* --- RESPONSIVE TABLET & MOBILE OPTIMIZATIONS --- */
        @media screen and (max-width: 1024px) {
          .sp-shell {
            padding: 8cqh 4cqw 5cqh 4cqw;
          }
        }

        @media screen and (max-width: 768px), screen and (max-height: 600px) {
          .mobile-back-btn { display: block; }
          .sp-footer { display: none; } /* Hide keyboard hints on touch screens */

          .sp-shell {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 70px 4vw 60px 4vw;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .sp-title {
            font-size: 2rem;
            margin-bottom: 5px;
          }

          .sp-left {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            gap: 12px;
          }

          .sp-item {
            min-height: 70px;
            padding: 12px 15px;
            clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          }

          .sp-item-title {
            font-size: 1.3rem;
          }

          .sp-item-stack {
            font-size: 0.9rem;
            margin-top: 4px;
          }

          .sp-right {
            width: 100%;
            max-width: 500px;
            margin: 10px auto 40px auto;
            padding: 20px 18px;
            clip-path: polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
          }

          .sp-tag {
            font-size: 0.85rem;
            padding: 4px 10px;
            clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
          }

          .sp-right-title {
            font-size: 1.6rem;
            margin-top: 12px;
          }

          .sp-right-summary {
            font-size: 1.15rem;
            margin-top: 12px;
            line-height: 1.3;
          }

          .sp-link {
            font-size: 1.1rem;
            margin-top: 20px;
            padding: 12px 16px;
            clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
            word-break: break-all; /* Prevents long URLs from overflowing horizontally */
          }
        }
      `}</style>

      <button 
        className="mobile-back-btn" 
        onClick={() => navigate(-1)}
        aria-label="Go Back"
      >
        ◀ BACK
      </button>

      <div className="sp-shell">
        <div className={`sp-title${mounted ? " mounted" : ""}`}>PROJECTS</div>
        
        <div className="sp-left">
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`sp-item${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => setActive(index)}
              onClick={() => handleItemClick(index)}
            >
              <div className="sp-item-title">{item.title}</div>
              <div className="sp-item-stack">{item.stack}</div>
            </div>
          ))}
        </div>

        <div className="sp-right" ref={detailPanelRef}>
          <div className="sp-tag">DETAILS</div>
          <div className="sp-right-title">{ITEMS[active].title}</div>
          <div className="sp-right-summary">{ITEMS[active].summary}</div>
          
          <a 
            className="sp-link" 
            href={ITEMS[active].href} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            OPEN LINK: {ITEMS[active].href.replace("https://", "")}
          </a>
        </div>

        <div className={`sp-footer${mounted ? " mounted" : ""}`}>
          <div className="sp-footer-row">
            <span className="sp-footer-key">↑↓</span>
            <span>NAVIGATE</span>
          </div>
          <div className="sp-footer-row">
            <span className="sp-footer-key">ESC</span>
            <span>BACK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
