import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

/**
 * Atmospheric Wind Vector Model
 * Computes realistic zonal and meridional wind components (u: East-West, v: North-South)
 * based on latitude and longitude planetary circulation cells (Trade Winds, Westerlies, Polar Easterlies, Rossby waves)
 */
function getWindVector(lat, lng) {
  const radLat = (lat * Math.PI) / 180;
  const radLng = (lng * Math.PI) / 180;

  // Planetary zonal wind band profile
  let u;
  let v;


  // 1. Zonal flow (Westerlies in mid-latitudes, Easterly trades in tropics)
  if (Math.abs(lat) < 30) {
    // Tropical Trade Winds: East to West (-u) with convergence towards equator
    const sign = lat >= 0 ? -1 : 1;
    u = -7.5 * Math.cos(radLat * 2.5);
    v = sign * 2.0 * Math.sin(radLat * 3);
  } else if (Math.abs(lat) < 65) {
    // Mid-latitude Westerlies: West to East (+u)
    u = 12.0 * Math.sin(Math.abs(radLat) - Math.PI / 6);
    v = 3.5 * Math.sin(radLng * 3 + lat * 0.05);
  } else {
    // Polar Easterlies: East to West (-u)
    u = -5.0 * Math.cos(radLat);
    v = -1.5 * Math.sin(radLng * 2);
  }

  // 2. Atmospheric wave perturbations (Rossby waves and cyclonic gyres)
  const wave1 = Math.sin(radLng * 4 + radLat * 2);
  const wave2 = Math.cos(radLng * 2 - radLat * 3);
  u += wave1 * 3.2;
  v += wave2 * 2.8;

  // 3. Local pressure swirls around oceanic gyres (North Atlantic, North Pacific, etc.)
  const atlanticSwirl = Math.exp(-((lat - 32) ** 2 + (lng + 35) ** 2) / 300);
  if (atlanticSwirl > 0.05) {
    // Clockwise swirl in Northern Hemisphere
    u += -(lat - 32) * atlanticSwirl * 0.4;
    v += (lng + 35) * atlanticSwirl * 0.4;
  }

  const speed = Math.sqrt(u * u + v * v);
  return { u, v, speed };
}

/**
 * Color map according to wind speed (m/s converted to display colors)
 */
function getWindColor(speed) {
  if (speed < 5) return "rgba(56, 189, 248, 0.75)"; // Light cyan
  if (speed < 10) return "rgba(52, 211, 153, 0.85)"; // Emerald
  if (speed < 16) return "rgba(251, 191, 36, 0.9)"; // Golden amber
  return "rgba(244, 63, 94, 0.95)"; // Magenta/Coral storm
}

export default function WindCanvasLayer({ opacity = 0.85, particleCount = 1200 }) {
  const map = useMap();
  const canvasRef = useRef(null);
  const animIdRef = useRef(null);

  useEffect(() => {
    const container = map.getContainer();
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "450";
    canvas.style.opacity = String(opacity);

    container.appendChild(canvas);
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    // Initialize particle pool
    const particles = [];
    const maxAge = 80;

    const resetParticle = (p) => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.age = Math.floor(Math.random() * maxAge);
      p.maxAge = maxAge + Math.floor(Math.random() * 30);
    };

    for (let i = 0; i < particleCount; i++) {
      const p = { x: 0, y: 0, age: 0, maxAge: 80 };
      resetParticle(p);
      particles.push(p);
    }

    const resize = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
      ctx.clearRect(0, 0, width, height);
      particles.forEach(resetParticle);
    };

    map.on("resize", resize);
    map.on("zoomstart", () => {
      ctx.clearRect(0, 0, width, height);
    });
    map.on("zoomend", resize);

    // Animation Loop
    let running = true;
    const render = () => {
      if (!running) return;

      // Soft fading trail effect
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "rgba(0, 0, 0, 0.94)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";

      // Process and render each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age++;

        if (p.age > p.maxAge || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          resetParticle(p);
          continue;
        }

        try {
          const latLng = map.containerPointToLatLng([p.x, p.y]);
          const { u, v, speed } = getWindVector(latLng.lat, latLng.lng);

          // Convert velocity (m/s) to screen displacement scale
          const zoom = map.getZoom();
          const zoomScale = Math.max(0.6, Math.min(2.5, Math.pow(1.15, zoom - 3)));
          const dx = u * 0.4 * zoomScale;
          const dy = -v * 0.4 * zoomScale;

          const nextX = p.x + dx;
          const nextY = p.y + dy;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(nextX, nextY);
          ctx.strokeStyle = getWindColor(speed);
          ctx.stroke();

          p.x = nextX;
          p.y = nextY;
        } catch {
          resetParticle(p);
        }
      }

      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      map.off("resize", resize);
      map.off("zoomend", resize);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [map, opacity, particleCount]);

  return null;
}
