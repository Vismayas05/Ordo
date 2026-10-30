# ORDO — Alert Scheduler & Dynamic Schedule Cascade

A personal alert scheduler built for focus, time awareness, and schedule protection. Designed in **Jet Black**, **Cerulean Blue**, and **Neon Rose**, with procedural audio alarms and a real-time schedule shift engine.

---

## 🎯 How It Works

1. **Schedule Your Day**:
   - Add tasks with their start time, duration (minutes), priority, and category.
   - The app organizes your commitments into a chronological timeline.

2. **Real-Time Focus Tracking**:
   - As you work, Ordo tracks your active task with live countdowns.

3. **Stress Alarm on Overdue Tasks**:
   - If you get caught up in a task and exceed its planned time without marking it done, Ordo triggers a **Stress Alarm**.
   - A visual alert HUD appears showing the exact overrun time and which downstream tasks are affected.
   - Procedural audio rings using the user's customized frequency and rhythm.

4. **1-Click Auto-Shift**:
   - When a task runs late, instead of manually re-scheduling everything, click **"Auto-Shift Schedule"**.
   - Ordo instantly recalculates all upcoming start times forward to keep your day realistic.

---

## 🔒 100% Private & Personalized for Every User

### Why Every User's Ordo is Different:
When you deploy this application, **every visitor gets their own independent schedule and interface**:

- **No Shared Tasks**:
  - All data is saved directly in the user's browser via secure client-side storage (`localStorage`).
  - **User A's tasks are never visible to User B**.
  - New visitors always start with a clean schedule (`0 tasks`). There are **no hardcoded dummy tasks** for visitors.

- **Unique Acoustic Signatures**:
  - Each user gets their own randomized Ordo ID (e.g. `ORDO-5216`).
  - Users can tune their alarm frequency (from a 200 Hz deep sub-synth to a 950 Hz sharp chime), select waveform timbres (*Sine, Sawtooth, Square, Triangle*), and set their delay grace cushion (0m, 3m, 5m, 10m, 15m).
  - Alarms are synthesized procedurally in the browser using the **Web Audio API** — requiring no external audio downloads.

---

## 🎨 Visual Identity

- **Background**: Deep Jet Black (`#030407`) with translucent glass panels.
- **Accents**:
  - **Cerulean Blue** (`#00c2ff`): Primary flow, scheduled times, active tasks, progress indicators.
  - **Neon Rose** (`#ff007f`): Stress alarms, overdue notifications, high-priority markers.
- **Background Animation**: Lightweight HTML5 Canvas particle constellation that smoothly pulses and shifts intensity with stress levels.
- **Fully Responsive**: Optimized for laptops, desktops, tablets, and mobile phones.

---

## 🚀 Deployment Guide

This project is a static React application powered by Vite. You can deploy it anywhere for free in less than 2 minutes:

### Option 1: Deploy on Vercel
1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**.

### Option 2: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) and import your repo.
2. Build Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Click **Deploy Site**.

### Option 3: Deploy on Cloudflare Pages or GitHub Pages
- Run `npm run build` and publish the generated `dist/` folder.

Every user who visits your deployed link will get their own fresh, private Ordo workspace.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Build for production
npm run build
```

---

## 📁 Project Structure

```
ordo/
├── index.html                           # App shell with Google Fonts
├── src/
│   ├── components/
│   │   ├── BackgroundCanvas.jsx         # 60fps Jet Black & Neon particle canvas
│   │   ├── OrdoLogo.jsx                 # Vector concentric ring brand logo
│   │   ├── OrdoProfileModal.jsx         # Custom acoustic alarm & persona tuner
│   │   └── StressCascadeBanner.jsx      # Stress alert HUD & auto-shift trigger
│   ├── pages/
│   │   └── Insights.jsx                 # Productivity analytics & distribution
│   ├── services/
│   │   ├── alarmSound.js                # Web Audio API procedural sound synthesizer
│   │   ├── personaConfig.js             # User acoustic profiles & grace cushions
│   │   └── stressEngine.js              # Real-time overrun & schedule shift engine
│   ├── App.jsx                          # Main application state & navigation
│   └── index.css                        # Jet Black, Cerulean, and Neon Rose styling
└── package.json
```
