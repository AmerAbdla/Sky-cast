# 🌤️ Skycast

A key-free global weather app built with React. Search any city or browse the map to get current conditions, hourly and 7-day forecasts, a live rain radar, and an animated wind layer.

**Live demo:** [sky-cast-blue-tau.vercel.app](https://sky-cast-blue-tau.vercel.app)

<!-- Add 1–2 screenshots or a short GIF here, e.g. ![Skycast home](./docs/screenshot.png) -->

---

## Features

- **No API key needed:** forecasts and geocoding come from the free [Open-Meteo](https://open-meteo.com/) API, so the app runs with zero configuration.
- **Radar map:** animated rain and cloud radar from [RainViewer](https://www.rainviewer.com/api.html), displayed on an interactive Leaflet map.
- **Wind visualization:** a canvas-based particle animation that shows wind direction and speed.
- **Hourly and 7-day forecasts:** temperature, humidity, wind, and conditions, with SVG charts.
- **Zoom-aware city markers:** 180+ cities are clustered and revealed progressively as you zoom, so the map stays readable.
- **Favorites:** saved locations persist between visits using `localStorage`.
- **Responsive layout:** works on mobile and desktop, with a glassmorphism-style UI.

---

## Tech Stack

| Area | Tools |
| --- | --- |
| UI | React 19, React Router v7 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Maps | Leaflet, React-Leaflet |
| Data | Open-Meteo (forecast and geocoding), RainViewer (radar) |
| Animation | HTML5 Canvas API |

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
git clone https://github.com/AmerAbdla/Sky-cast.git
cd Sky-cast
npm install
```

### Run locally

```bash
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

---

## Notes

- Open-Meteo's free tier is intended for non-commercial use and has rate limits, so heavy traffic may need a paid plan or self-hosting.

## Credits

- Weather data: [Open-Meteo](https://open-meteo.com/) (CC BY 4.0)
- Radar tiles: [RainViewer](https://www.rainviewer.com/)
- Map data: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

## License

Add a license (for example MIT) and state it here.
