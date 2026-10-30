# ORDO

> An intelligent, focus-first alert scheduler that protects your daily schedule through dynamic time-shift alarms and personalized acoustic synthesis.

---

## 📌 Overview

**ORDO** is a modern task scheduler and focus manager designed in **Jet Black**, **Cerulean Blue**, and **Neon Rose**. Unlike traditional static to-do lists, ORDO actively monitors your progress during the day:

When you spend too long on a task and fail to transition to the next, ORDO generates a **Stress Alarm** and calculates the downstream delay on your upcoming commitments. With a single click on **Auto-Shift**, your entire day's timeline automatically recalibrates to eliminate scheduling conflicts.

---

## ✨ Features

- **Dynamic Schedule Timeline**: Chronological task tracking with live countdowns, priority markers, and category pills.
- **Stress Alarm & Auto-Shift**: Detects task overruns in real-time and warns how delays push subsequent tasks. Recalibrate your entire day forward with one click.
- **Procedural Acoustic Alarm Synthesizer**: Built on the browser's native **Web Audio API**. Generates customizable, multi-oscillator alarms (*Sine, Sawtooth, Square, Triangle*) across frequencies from 200 Hz to 950 Hz without external audio dependencies.
- **Personalized Flow Archetypes**: Choose or customize your unique flow profile (e.g. *Hyperfocus Deep Worker*, *Velocity Sprinter*, *Zen Harmonic Flow*) with custom delay cushions.
- **Interactive Particle Background**: High-performance 60fps HTML5 Canvas with glowing Cerulean Blue and Neon Rose constellations that dynamically pulse with stress levels.
- **Privacy-First Architecture**: 100% client-side storage via browser `localStorage`. Every visitor gets an isolated, private workspace with zero shared data.
- **Bilingual Support**: Instant toggle between **English** and **Malayalam (മലയാളം)**.
- **Responsive Layout**: Designed for seamless use on smartphones, tablets, laptops, and desktops.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Audio Engine**: Web Audio API (Procedural Oscillator Synthesis)
- **Visuals**: HTML5 Canvas (Hardware-accelerated Particle Engine)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd ordo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

### Production Build

To test or build the optimized production bundle:
```bash
npm run build
```
The output files will be created in the `dist/` directory.

---

## 🌐 How to Deploy

ORDO is a client-side static web application. It can be hosted on any static cloud provider at zero cost.

### Option A: Deploy on Vercel (Recommended — 2 Minutes)
1. Push your repository to [GitHub](https://github.com/).
2. Log in to [Vercel](https://vercel.com/) and click **"Add New" > "Project"**.
3. Select your `ordo` repository.
4. Leave settings as default:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your live URL will be ready immediately.

### Option B: Deploy on Netlify
1. Log in to [Netlify](https://netlify.com/) and click **"Add new site" > "Import an existing project"**.
2. Connect your GitHub repository.
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **"Deploy ordo"**.

### Option C: Deploy on Cloudflare Pages
1. Go to your Cloudflare Dashboard and navigate to **Workers & Pages**.
2. Connect your Git repository.
3. Select the **Vite** preset (Build command: `npm run build`, Build output directory: `dist`).
4. Click **"Save and Deploy"**.

---

## 📂 Project Structure

```
ordo/
├── index.html                   # HTML entry point with Google Fonts
├── public/                      # Static assets
├── src/
│   ├── components/
│   │   ├── BackgroundCanvas.jsx # Interactive 60fps canvas animation
│   │   ├── OrdoLogo.jsx         # Scalable vector brand logo
│   │   ├── OrdoProfileModal.jsx # Acoustic alarm & persona tuner
│   │   └── StressCascadeBanner.jsx # Real-time overrun HUD
│   ├── pages/
│   │   └── Insights.jsx         # Analytics and time distribution
│   ├── services/
│   │   ├── alarmSound.js        # Web Audio API alarm synthesizer
│   │   ├── personaConfig.js     # Flow profiles & frequency presets
│   │   └── stressEngine.js      # Schedule calculation & shift algorithms
│   ├── App.jsx                  # Main application state & shell
│   ├── index.css                # Jet Black & Neon styling rules
│   └── main.jsx                 # React root mount
├── package.json
└── vite.config.js
```

---

## 📄 License

This project is licensed under the MIT License.
