import { useEffect, useState, useRef } from "react";
import { playSelectSound } from "./utils/audio.js";
import { useNavigate } from "react-router-dom";
import mainVideo from "./assets/main1.mp4";

const ITEMS = [
  { id: "i", badge: "I", title: "EDUCATION", subtitle: "BA Language and Literature / Diploma in Intercultural Studies", rank: 3 },
  { id: "ii", badge: "II", title: "SKILLS", subtitle: "Google Workspace / Basic JavaScript / Adobe InDesign / Adobe Photoshop", rank: 4 },
  { id: "iii", badge: "III", title: "PROJECTS", subtitle: "Minor image and video editing projects", rank: 4 },
  { id: "iv", badge: "IV", title: "FOCUS", subtitle: "Localization / Translation / Language QA", rank: 5 },
];

const DETAILS = [
  {
    index: "01",
    title: "EDUCATION LOG",
    progress: "2/4",
    rows: [
      { index: "01", title: "Elementary & Junior High, Global Prima", status: "Completed" },
      { index: "02", title: "Senior High, SMA Brigjend Katamso 1 Medan", status: "Completed" },
      { index: "03", title: "BSc Computer Science, Universitas Sumatera Utara", status: "In progress" },
      { index: "04", title: "Web, Game & AI Development (Self-taught)", status: "Learning" },
    ],
    bottomTitle: "GENERAL EXPERIENCE",
    bullets: [
      "- Built web platforms, an RPG game, and an AI desktop assistant.",
      "- Hands-on IT support: troubleshooting, hardware, and user assistance.",
    ],
  },
  {
    index: "02",
    title: "SKILLS OVERVIEW",
    progress: "4/4",
    rows: [
      { index: "01", title: "HTML, CSS & JavaScript", status: "Proficient" },
      { index: "02", title: "Next.js & Laravel", status: "Learning" },
      { index: "03", title: "RPG Maker MZ & Game Dev", status: "Intermediate" },
      { index: "04", title: "Python & AI Tooling", status: "Intermediate" },
    ],
    bottomTitle: "CORE COMPETENCIES",
    bullets: [
      "- Responsive web development with HTML, CSS, and JavaScript.",
      "- Game development, AI tooling, and solo project delivery.",
    ],
  },
  {
    index: "03",
    title: "PROJECT ARCHIVE",
    progress: "1/3",
    rows: [
      { index: "01", title: "The Mists of Dawn (RPG Maker MZ, Android)", status: "Completed" },
      { index: "02", title: "PixelValeWeb (Next.js + Supabase)", status: "In Progress" },
      { index: "03", title: "E.D.I.T.H. (Python AI Desktop Assistant)", status: "In Progress" },
    ],
    bottomTitle: "HIGHLIGHTS",
    bullets: [
      "- Shipped an Android RPG and a game distribution platform.",
      "- Built an AI desktop assistant with a Python WebSocket backend.",
    ],
  },
  {
    index: "04",
    title: "CORE FOCUS AREAS",
    progress: "3/3",
    rows: [
      { index: "01", title: "Web Development", status: "Active" },
      { index: "02", title: "Game Development", status: "Active" },
      { index: "03", title: "AI Tooling", status: "Active" },
    ],
    bottomTitle: "PRIMARY OBJECTIVE",
    bullets: [
      "- Seeking internship or junior roles in web or game development.",
      "- Open to collaborating on indie game and AI projects.",
    ],
  },
];

export default function ResumePage() {
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
  }, [navigate]);

  // Smooth scroll to details on mobile when a card is tapped
  const handleCardClick = (index) => {
    setActive(index);
    if (window.innerWidth <= 768 && detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const currentDetail = DETAILS[active];

  return (
    <div id="menu-screen">
      <div className="resume-entry-mask" aria-hidden="true">
        <video className="resume-entry-video" src={mainVideo} autoPlay loop muted playsInline />
      </div>
      
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

        #menu-screen::before,
        #menu-screen::after {
          display: none !important;
        }

        .sc-dim {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
        }

        .resume-entry-mask {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 9;
          overflow: hidden;
          background: #732424;
          clip-path: circle(0 at 50% 50%);
          animation: resume-entry-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
        }

        .resume-entry-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        @keyframes resume-entry-reveal {
          0% { clip-path: circle(0 at 50% 50%); }
          99% { clip-path: circle(150vmax at 50% 50%); }
          100% { clip-path: none; }
        }

        .resume-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          overflow: hidden;
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

        .resume-stack {
          position: absolute;
          top: 9cqh;
          left: 10.5cqw;
          width: min(52cqw, 820px);
          display: flex;
          flex-direction: column;
          gap: 0.9cqh;
          pointer-events: none;
          transform: scale(0.9);
          transform-origin: top left;
        }

        .resume-list-tag {
          font-family: 'Persona5Main';
          font-size: 4.8cqw;
          line-height: 0.9;
          color: #ffffff;
          letter-spacing: 0.1cqw;
          margin: 0 0 0.55cqh 0.6cqw;
          text-shadow: 0 0.18cqh 0 rgba(13,13,13,0.18);
          opacity: 0;
          transform: translateX(-1.25cqw);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .resume-list-tag.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(-4.7cqw) rotate(-5deg) scale(0.95);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: all;
          cursor: pointer;
        }

        .resume-card-wrap.mounted {
          opacity: 1;
          transform: translateX(0) rotate(0deg) scale(1);
        }

        .resume-card {
          position: relative;
          height: 10.4cqh;
          margin-left: 0.5cqw;
          width: calc(100% - 0.5cqw);
          background: linear-gradient(180deg, #181818 0%, #090909 100%);
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          box-shadow: 0 0.74cqh 0 #000, 0.6cqw 1.1cqh 30px rgba(0,0,0,.45);
          transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          overflow: visible;
        }

        .resume-card-wrap.active .resume-card {
          background: #ffffff;
          box-shadow: 0.5cqw 0.74cqh 0 #d92323;
          transform: translateX(0.4cqw) scale(1.03) rotate(-0.4deg);
        }

        .resume-card-wrap.active .resume-card::after {
          content: "";
          position: absolute;
          right: -0.94cqw;
          top: 0;
          width: 0.83cqw;
          height: 100%;
          background: #d92323;
          transform: skew(-18deg);
        }

        .resume-card-inner {
          position: absolute;
          inset: 0;
          padding: 1.3cqh 1.15cqw 1.3cqh 6cqw;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          overflow: visible;
        }

        .resume-badge {
          position: absolute;
          top: 1.3cqh;
          left: -0.78cqw;
          width: 4.7cqw;
          height: 7.2cqh;
          z-index: 20;
          background: #0d0d0d;
          border: 0.18cqw solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: skewX(-8deg) rotate(-4deg);
          box-shadow: 0 0.55cqh 1.1cqh rgba(0,0,0,0.6);
          transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease;
        }

        .resume-badge-text {
          font-family: 'Persona5Main';
          font-size: 1.56cqw;
          color: #ffffff;
          letter-spacing: 0px;
          transform: skewX(8deg) rotate(4deg);
        }

        .resume-card-wrap.active .resume-badge {
          background: #d92323;
          border-color: #0d0d0d;
          transform: translateX(0.4cqw) skewX(-8deg) rotate(-4deg) scale(1.03);
        }

        .resume-title {
          font-family: 'Persona5Main';
          font-size: 2.7cqw;
          line-height: 0.9;
          letter-spacing: 0.1cqw;
          color: #ffffff;
          transition: color 0.22s ease;
        }

        .resume-card-wrap.active .resume-title {
          color: #0d0d0d;
        }

        .resume-rank {
          display: flex;
          align-items: center;
          gap: 0.5cqw;
          margin-top: 0.18cqh;
          flex-shrink: 0;
        }

        .resume-rank-label {
          font-family: 'Persona5Main';
          font-size: 1.56cqw;
          letter-spacing: 0.1cqw;
          color: #ffffff;
          transition: color 0.22s ease;
        }

        .resume-rank-number {
          font-family: 'Persona5Main';
          font-size: 2.6cqw;
          line-height: 0.82;
          color: #ffffff;
          transition: color 0.22s ease;
        }

        .resume-card-wrap.active .resume-rank-label,
        .resume-card-wrap.active .resume-rank-number {
          color: #0d0d0d;
        }

        .resume-subtitle-bar {
          position: absolute;
          left: 3.3cqw;
          right: 0.7cqw;
          bottom: 1.1cqh;
          height: 3.15cqh;
          background: linear-gradient(90deg, #ffffff, #ececec);
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.5cqw) 100%, 0 100%);
          display: flex;
          align-items: center;
          padding: 0 0.9cqw;
          transition: background 0.22s ease;
        }

        .resume-card-wrap.active .resume-subtitle-bar {
          background: #0d0d0d;
        }

        .resume-subtitle {
          font-family: 'Bebas Neue';
          font-size: 1.45cqw;
          line-height: 1;
          letter-spacing: 0px;
          color: #0d0d0d;
          transition: color 0.22s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .resume-card-wrap.active .resume-subtitle {
          color: #ffffff;
        }

        .resume-detail-panel {
          position: absolute;
          top: 18cqh;
          right: 9cqw;
          width: min(44cqw, 680px);
          z-index: 12;
          padding: 2cqh 1.25cqw 2.2cqh 1.25cqw;
          background: linear-gradient(180deg, rgba(20,20,20,.97), rgba(8,8,8,.99));
          background-size: cover;
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.94cqw) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), 0.83cqw 1.48cqh 0 rgba(13,13,13,0.55);
          overflow: hidden;
        }

        .resume-detail-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .4;
          background: linear-gradient(135deg, rgba(255,255,255,.08) 0, transparent 18%),
                      repeating-linear-gradient(0deg, transparent 0, transparent 1.66cqh, rgba(255,255,255,.015) 1.76cqh);
          pointer-events: none;
        }

        .resume-detail-top {
          position: relative;
          display: grid;
          grid-template-columns: 3.38cqw 1fr auto;
          align-items: center;
          gap: 1.25cqw;
          min-height: 8.5cqh;
          padding: 0 1.15cqw;
          background: linear-gradient(90deg, #ffffff 0%, #ffffff 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.83cqw) 100%, 0 100%);
          color: #0d0d0d;
          box-shadow: 0.5cqw 0 0 rgba(217,35,35,0.88);
        }

        .resume-detail-top-index {
          font-family: 'Persona5Main';
          font-size: 2.4cqw;
          line-height: 1;
        }

        .resume-detail-top-title {
          font-family: 'Persona5Main';
          font-size: 1.98cqw;
          line-height: 0.95;
          letter-spacing: 0px;
          word-spacing: 0.4cqw;
        }

        .resume-detail-top-progress {
          font-family: 'Persona5Main';
          font-size: 2.18cqw;
          letter-spacing: 0.1cqw;
          line-height: 1;
        }

        .resume-detail-list {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.92cqh;
          margin-top: 1.66cqh;
        }

        .resume-detail-row {
          display: grid;
          grid-template-columns: 2.6cqw 1fr auto;
          align-items: center;
          gap: 0.73cqw;
          min-height: 5.18cqh;
          padding: 0 0.73cqw;
          background: rgba(13,13,13,0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.73cqw) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
          transition: transform 0.16s ease, background 0.16s ease;
        }

        .resume-detail-row:hover {
          transform: translateX(0.2cqw);
          background: rgba(25,25,25,1);
          border-left: 0.4cqw solid #d92323;
        }

        .resume-detail-row-index {
          font-family: 'Bebas Neue';
          font-size: 1.35cqw;
          letter-spacing: 0.05cqw;
          color: #ffffff;
        }

        .resume-detail-row-title {
          font-family: 'Bebas Neue';
          font-size: 1.45cqw;
          line-height: 1;
          color: #ffffff;
        }

        .resume-detail-status {
          font-family: 'Bebas Neue';
          font-size: 1.14cqw;
          line-height: 1;
          letter-spacing: 0.057cqw;
          color: #0d0d0d;
          background: #ffffff;
          padding: 0.65cqh 0.62cqw;
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.4cqw) 100%, 0 100%);
        }

        .resume-detail-bottom {
          position: relative;
          margin-top: 2cqh;
          padding: 2cqh 1.25cqw;
          background: rgba(13,13,13,0.97);
          clip-path: polygon(0 0, 100% 0, calc(100% - 0.83cqw) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
        }

        .sc-footer {
          position: absolute;
          bottom: 2.6cqh; right: 7.2cqw;
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

        .resume-detail-bottom-title {
          font-family: 'Persona5Main';
          font-size: 1.56cqw;
          letter-spacing: 0px;
          word-spacing: 0.4cqw;
          color: #ffffff;
          margin-bottom: 1.3cqh;
        }

        .resume-detail-bullets {
          display: flex;
          flex-direction: column;
          gap: 1.1cqh;
        }

        .resume-detail-bullet {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.25cqw;
          line-height: 1.3;
          letter-spacing: 0.026cqw;
          word-spacing: 0.15cqw;
          color: #ffffff;
        }

        /* --- RESPONSIVE TABLET & MOBILE OPTIMIZATIONS --- */
        @media screen and (max-width: 1024px) {
          .resume-stack {
            top: 12cqh;
            left: 5cqw;
            width: min(48cqw, 600px);
            transform: scale(0.9);
          }
          .resume-detail-panel {
            top: 12cqh;
            right: 4cqw;
            width: min(45cqw, 500px);
          }
        }

        @media screen and (max-width: 768px), screen and (max-height: 600px) {
          /* Enable scrolling and switch to vertical flex stack */
          .resume-overlay {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 25px;
            padding: 70px 4vw 60px 4vw;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .mobile-back-btn { display: block; }
          .sc-footer { display: none; } /* Hide keyboard hints */

          .resume-stack {
            position: relative;
            top: auto; left: auto;
            width: 94%;
            max-width: 500px;
            transform: none !important;
            gap: 15px;
          }

          .resume-list-tag { font-size: 1.8rem; margin-bottom: 5px; }

          .resume-card {
            height: 75px;
            margin-left: 10px;
            width: calc(100% - 10px);
            clip-path: polygon(0 0, 96% 0, 100% 100%, 3% 100%);
          }

          .resume-card-inner { padding: 10px 15px 10px 55px; }
          .resume-title { font-size: 1.4rem; }
          .resume-rank-label { font-size: 0.75rem; }
          .resume-rank-number { font-size: 1.4rem; }

          .resume-badge {
            width: 36px; height: 52px;
            left: -8px; top: 10px;
            border-width: 2px;
          }
          .resume-badge-text { font-size: 1.1rem; }

          .resume-subtitle-bar {
            left: 50px; right: 10px;
            bottom: 8px; height: 24px;
            padding: 0 10px;
          }
          .resume-subtitle { font-size: 0.85rem; }

          .resume-detail-panel {
            position: relative;
            top: auto; right: auto;
            width: 94%;
            max-width: 500px;
            padding: 15px;
            margin-bottom: 30px;
            clip-path: polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
          }

          .resume-detail-top {
            grid-template-columns: 40px 1fr auto;
            min-height: 50px;
            padding: 10px 12px;
            gap: 10px;
          }
          .resume-detail-top-index { font-size: 1.4rem; }
          .resume-detail-top-title { font-size: 1.2rem; }
          .resume-detail-top-progress { font-size: 1.3rem; }

          .resume-detail-row {
            grid-template-columns: 30px 1fr auto;
            min-height: 44px;
            padding: 6px 10px;
            gap: 10px;
          }
          .resume-detail-row-index { font-size: 1rem; }
          .resume-detail-row-title { font-size: 1rem; }
          .resume-detail-status { font-size: 0.85rem; padding: 4px 8px; }

          .resume-detail-bottom { padding: 15px; }
          .resume-detail-bottom-title { font-size: 1.2rem; margin-bottom: 10px; }
          .resume-detail-bullet { font-size: 1rem; line-height: 1.4; }
        }
      `}</style>

      <button 
        className="mobile-back-btn" 
        onClick={() => navigate(-1)}
        aria-label="Go Back"
      >
        ◀ BACK
      </button>

      <div className="resume-overlay">
        <div className="resume-stack">
          <div className={`resume-list-tag${mounted ? " mounted" : ""}`}>LIST</div>
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`resume-card-wrap${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => setActive(index)}
              onClick={() => handleCardClick(index)}
            >
              <div className="resume-badge">
                <div className="resume-badge-text">{item.badge}</div>
              </div>
              <div className="resume-card">
                <div className="resume-card-inner">
                  <div className="resume-title">{item.title}</div>
                  <div className="resume-rank">
                    <div className="resume-rank-label">RANK</div>
                    <div className="resume-rank-number">{item.rank}</div>
                  </div>
                </div>
                <div className="resume-subtitle-bar">
                  <div className="resume-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentDetail && (
          <div className="resume-detail-panel" ref={detailPanelRef}>
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">{currentDetail.index}</div>
              <div className="resume-detail-top-title">{currentDetail.title}</div>
              <div className="resume-detail-top-progress">{currentDetail.progress}</div>
            </div>

            <div className="resume-detail-list">
              {currentDetail.rows.map((row) => (
                <div className="resume-detail-row" key={row.index}>
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </div>
              ))}
            </div>

            <div className="resume-detail-bottom">
              <div className="resume-detail-bottom-title">{currentDetail.bottomTitle}</div>
              <div className="resume-detail-bullets">
                {currentDetail.bullets.map((bullet, i) => (
                  <div className="resume-detail-bullet" key={i}>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={`sc-footer${mounted ? " mounted" : ""}`}>
          <div className="sc-footer-row">
            <span className="sc-footer-key">↑↓</span>
            <span>NAVIGATE</span>
          </div>
          <div className="sc-footer-row">
            <span className="sc-footer-key">ESC</span>
            <span>BACK</span>
          </div>
        </div>
      </div> 
    </div>  
  );
}
