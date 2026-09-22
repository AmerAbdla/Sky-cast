import { useEffect, useRef, useState } from "react";
import { TileLayer } from "react-leaflet";

/**
 * RainViewer API color scheme:
 * Color 2: Universal blue-green-yellow-red radar palette
 * Smoothing: 1, Snow: 1 -> "/2/1_1.png"
 */
const COLOR_SCHEME = "2/1_1";

export default function RadarAnimationLayer({
  isPlaying,
  playbackSpeed = 1,
  onFramesLoaded,
  onCurrentFrameChange,
}) {
  const [radarData, setRadarData] = useState(null);
  const [frames, setFrames] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const timerRef = useRef(null);

  // Fetch RainViewer weather map frames
  useEffect(() => {
    let active = true;
    const fetchRadar = async () => {
      try {
        const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
        if (!res.ok) throw new Error("Could not load radar data");
        const data = await res.json();
        if (!active) return;

        const pastFrames = data.radar?.past ?? [];
        const nowcastFrames = data.radar?.nowcast ?? [];
        const combined = [...pastFrames, ...nowcastFrames];

        if (combined.length > 0) {
          setRadarData(data);
          setFrames(combined);
          setCurrentIdx(combined.length - 1); // Start with the most recent frame
          if (onFramesLoaded) {
            onFramesLoaded(combined);
          }
        }
      } catch {
        // Radar frame failure is non-fatal
      }

    };

    fetchRadar();
    // Refresh radar frames every 5 minutes
    const interval = setInterval(fetchRadar, 5 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [onFramesLoaded]);

  // Notify parent of current frame index and time
  useEffect(() => {
    if (frames.length > 0 && onCurrentFrameChange) {
      onCurrentFrameChange(currentIdx, frames[currentIdx]);
    }
  }, [currentIdx, frames, onCurrentFrameChange]);

  // Advance animation frame loop
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.round(900 / playbackSpeed);
    timerRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % frames.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, frames.length, playbackSpeed]);

  if (!radarData || frames.length === 0) return null;

  const activeFrame = frames[currentIdx];
  const nextFrame = frames[(currentIdx + 1) % frames.length];

  const activeUrl = `${radarData.host}${activeFrame.path}/256/{z}/{x}/{y}/${COLOR_SCHEME}.png`;
  const nextUrl = nextFrame ? `${radarData.host}${nextFrame.path}/256/{z}/{x}/{y}/${COLOR_SCHEME}.png` : null;

  return (
    <>
      {/* Active visible radar frame */}
      <TileLayer
        key={`radar-${activeFrame.path}`}
        url={activeUrl}
        opacity={0.8}
        zIndex={400}
        tileSize={256}
      />
      {/* Invisible preloader for next frame to eliminate flickering */}
      {isPlaying && nextUrl && (
        <TileLayer
          key={`preload-${nextFrame.path}`}
          url={nextUrl}
          opacity={0.001}
          zIndex={399}
          tileSize={256}
        />
      )}
    </>
  );
}

