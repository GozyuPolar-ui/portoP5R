# Persona 5 Portfolio

A personal portfolio of **Matius Remon**, styled after the menu UI of *Persona 5*: red, black and white, skewed type, and a Joker cut-in every time you pick something.

> **[View Live Demo](https://porto-p5-r.vercel.app/)**

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?logo=framer&logoColor=white)

## What's in it

| Page | What it shows |
| --- | --- |
| **Main menu** | The Persona-style menu: *About Me, Resume, Side Projects, Socials, GitHub Link* |
| **About Me** | Short profile, experience and languages, with character portraits |
| **Resume** | Education, skills, projects and focus areas, laid out as game-style cards |
| **Side Projects** | The Mists of Dawn, PixelValeWeb, E.D.I.T.H., ExceedOG |
| **Socials** | X, Instagram and GitHub as a "social links" screen |

## Highlights

- **Joker cut-in transition.** Choosing a menu item plays `jokerlanding` or `jokerfail` at random, like the game. The clips are green-screen footage; the green and blue are keyed out on a `<canvas>` at runtime, so only Joker's silhouette is drawn over the live page. The clip is preloaded first and the page only changes mid-animation.
- **Persona 5 look and feel.** Custom wiggle polygons, skewed labels, stroked text, and the red / black / white palette.
- **Sound.** Menu SFX on every move and select, plus a toggleable background music player with a volume slider that remembers your setting.
- **Keyboard and touch.** Arrow keys, Enter and Escape work like game controls. On phones there are tap and drag-safe gestures, and a prompt to rotate to landscape (the layout is a fixed 16:9 stage).
- **Looping background video** behind every page.
- **Reduced motion.** With `prefers-reduced-motion` on, the Joker transition is skipped and the page just changes.

## Tech stack

- [React 19](https://react.dev) and [React Router 7](https://reactrouter.com)
- [Vite 8](https://vite.dev) for dev server and build
- [Framer Motion](https://www.framer.com/motion/) for the stripe page transitions
- Plain CSS with container-query units (`cqw` / `cqh`) so everything scales with the 16:9 stage
- Optional: a tiny Flask server (`flask_app.py`) that serves the built `dist/` folder

## Getting started

Requires **Node.js 20.19+ or 22+**.

```bash
git clone https://github.com/GozyuPolar-ui/portoP5R.git
cd portoP5R
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run build:watch` | Rebuild on file changes |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Serve the build with Flask (optional)

```bash
npm run build
pip install -r requirements.txt
python flask_app.py     # http://localhost:5000
```

## Project structure

```
src/
  App.jsx               Router, background video, BGM player, mobile gestures
  P5Menu.jsx            Main menu (wiggle polygons, keyboard and mouse)
  JokerTransition.jsx   Random Joker cut-in with canvas chroma key
  jokerContext.js       Context and hook used by the menu to trigger it
  PageTransition.jsx    Stripe overlays between pages
  AboutMe.jsx  ResumePage.jsx  SideProjectsPage.jsx  Socials.jsx
  utils/audio.js        Menu select sound
  assets/               Videos, portraits, icons
public/audio/           background.mp3, select.mp3
```

## Make it yours

All the content is plain data at the top of each page file:

- `src/AboutMe.jsx`: `REVEAL_CONTENT`
- `src/ResumePage.jsx`: `ITEMS` and `DETAILS`
- `src/SideProjectsPage.jsx`: `ITEMS` (titles, stacks, links)
- `src/Socials.jsx`: `ITEMS` (handles, links, counts)
- `src/App.jsx`: the GitHub menu link, in `handleNavigate`

Joker transition timing (when the page changes during the clip) is in `CLIPS` at the top of `src/JokerTransition.jsx`.

## Deployment

It is a static site, so any static host works:

1. **Vercel / Netlify / Cloudflare Pages:** import the repo, build command `npm run build`, output directory `dist`.
2. **GitHub Pages:** build in a GitHub Action (`npm ci && npm run build`) and publish `dist/`. Vite needs `base: '/portoP5R/'` in `vite.config.js` when the site lives at `username.github.io/portoP5R/`.

The live demo is deployed on Vercel and redeploys automatically on every push to `main`.

## Credits and disclaimer

This is a non-commercial fan-made portfolio. *Persona 5* and its characters, art style and music belong to Atlus / SEGA. Character art and Joker animation clips are used for the visual theme only. Background music in `public/audio/` should be audio you have the right to use.

## Contact

- GitHub: [@GozyuPolar-ui](https://github.com/GozyuPolar-ui)
- Instagram: [@r3mon34](https://www.instagram.com/r3mon34/)
- X: [@ExceedOGHQ](https://x.com/ExceedOGHQ)
