<<<<<<< HEAD
# Rayzo
=======
# Rayzo — Frontend

Modern, medical-grade frontend for an AI X-ray analysis platform for doctors. **Frontend only** — backend APIs are assumed to exist and can be wired in later.

## Features

- **Landing** — Hero, animated headline, CTA “Analyze X-ray”
- **Auth** — Login & Register with medical registration number, floating labels, password visibility toggle
- **Dashboard** — Welcome message, quick stats (total scans, last scan), “Upload New X-ray” and “Reports” cards
- **Upload** — Drag & drop X-ray upload, image preview, progress animation, analysis result with confidence meter and disclaimer
- **Reports** — List/grid of past reports (thumbnail, disease, confidence %, date), click to open report
- **Report view** — Large image viewer, zoom, heatmap toggle placeholder, confidence chart (Recharts), download button, disclaimer

## Tech stack

- **React 18** (Vite)
- **Tailwind CSS 4** (with `@tailwindcss/vite`)
- **Framer Motion** — page and card animations
- **React Router 6**
- **Axios** — ready for API integration (currently using fake API)
- **Lucide React** — icons
- **Recharts** — confidence breakdown chart

## Project structure

https://clinicvision.netlify.app/
