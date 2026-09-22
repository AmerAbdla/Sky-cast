import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useWeather } from "../context/WeatherContext";
import { fetchForecast, normalizeForecast, cityKey, searchCities, formatRadarTime } from "../weather";
import { WORLD_CITIES, getWorldCitiesForZoom, searchPreloadedCities } from "../data/worldCities";
import RadarAnimationLayer from "./RadarAnimationLayer";
import WindCanvasLayer from "./WindCanvasLayer";

/* ── Base Map Tile Providers ────────────────────────────────── */
const BASE_MAPS = [
  {
    id: "voyager",
    name: "Detailed (World Cities & Towns)",
    shortName: "Detailed",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap, &copy; CARTO",
  },
  {
    id: "dark",
    name: "Dark Night",
    shortName: "Dark Night",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap, &copy; CARTO",
  },
  {
    id: "osm",
    name: "Street Map (OpenStreetMap)",
    shortName: "Street Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  {
    id: "satellite",
    name: "Satellite Hybrid",
    shortName: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    attribution: "&copy; Esri &copy; CARTO",
  },
];

/* ── Weather Movement & Layer definitions ───────────────────── */
const WEATHER_MODES = [
  { id: "radar", label: "Live Radar Loop", icon: "🌧️" },
  { id: "wind", label: "Wind Streamlines", icon: "💨" },
  { id: "temperature", label: "Temperature", icon: "🌡️" },
  { id: "clouds", label: "Cloud Cover", icon: "☁️" },
];

/* ── Temperature color mapping ──────────────────────────────── */
function tempColor(t) {
  if (!Number.isFinite(t)) return "#94a3b8";
  if (t < 0) return "#818cf8"; // Frost violet
  if (t < 12) return "#60a5fa"; // Cool blue
  if (t < 22) return "#34d399"; // Mild green
  if (t < 32) return "#fbbf24"; // Warm amber
  return "#f87171"; // Hot coral
}

/* ── Custom Leaflet Marker Icon for World Cities ────────────── */
function createCityMarkerIcon(name, value, color, isSelected) {
  return L.divIcon({
    className: "custom-city-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div style="
        display:inline-flex;align-items:center;gap:6px;
        background:${isSelected ? "rgba(37,99,235,0.95)" : "rgba(15,23,42,0.88)"};
        border:1.5px solid ${isSelected ? "#60a5fa" : "rgba(148,163,184,0.3)"};
        border-radius:24px;padding:4px 10px 4px 8px;
        color:#fff;font-family:system-ui,-apple-system,sans-serif;
        font-size:11px;font-weight:600;white-space:nowrap;
        box-shadow:${isSelected ? "0 0 16px rgba(59,130,246,0.8)" : "0 4px 14px rgba(0,0,0,0.6)"};
        backdrop-filter:blur(8px);
        transform:translate(-50%,-50%);
        cursor:pointer;
        transition:transform 0.15s ease, background 0.15s ease;
      ">
        <span style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};flex-shrink:0;"></span>
        <span style="letter-spacing:0.2px;">${name}</span>
        ${value ? `<span style="color:${color};font-weight:700;padding-left:2px;">${value}</span>` : ""}
      </div>`,
  });
}

/* ── Map Zoom and Click Event Tracker ───────────────────────── */
function MapController({ onZoomChange, onMapClick, targetCoords }) {
  const map = useMap();
  const prevTarget = useRef(null);

  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
    click: (e) => onMapClick(e.latlng),
  });

  useEffect(() => {
    if (!targetCoords) return;
    const { lat, lng, zoom } = targetCoords;
    if (
      !prevTarget.current ||
      prevTarget.current.lat !== lat ||
      prevTarget.current.lng !== lng
    ) {
      prevTarget.current = { lat, lng };
      map.flyTo([lat, lng], zoom || Math.max(map.getZoom(), 5), {
        duration: 1.2,
      });
    }
  }, [map, targetCoords]);

  return null;
}

const round = (v) => (Number.isFinite(v) ? Math.round(v) : "–");

/* ══════════════════════════════════════════════════════════════
   WeatherMap Component — English Only
   ══════════════════════════════════════════════════════════ */
export default function WeatherMap() {
  const {
    cities,
    activeCity,
    setActiveCity,
    addCity,
    unit,
    unitSymbol,
    speedUnit,
    forecast,
  } = useWeather();

  // Active Modes & Settings
  const [weatherMode, setWeatherMode] = useState("radar"); // radar | wind | temperature | clouds
  const [baseMapId, setBaseMapId] = useState("voyager"); // voyager | dark | osm | satellite
  const [showCityPins, setShowCityPins] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(3);
  const [flyTarget, setFlyTarget] = useState(null);

  // Radar Animation States
  const [isRadarPlaying, setIsRadarPlaying] = useState(true);
  const [radarSpeed, setRadarSpeed] = useState(1);
  const [radarFrames, setRadarFrames] = useState([]);
  const [currentRadarIdx, setCurrentRadarIdx] = useState(0);
  const [currentFrameObj, setCurrentFrameObj] = useState(null);

  // Selected Location / Clicked Location
  const [selectedCity, setSelectedCity] = useState(activeCity);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [clickedWeather, setClickedWeather] = useState(null);
  const [isFetchingClicked, setIsFetchingClicked] = useState(false);

  // City Weather Data Cache
  const [weatherCache, setWeatherCache] = useState({});

  // Global Search Box
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  /* ── Fetch weather for visible tracked & key cities ───────── */
  useEffect(() => {
    const ac = new AbortController();
    const citiesToFetch = [...cities];

    // Add top Tier 1 cities to initial background fetch
    WORLD_CITIES.slice(0, 15).forEach((wc) => {
      if (!citiesToFetch.some((c) => cityKey(c) === cityKey(wc))) {
        citiesToFetch.push(wc);
      }
    });

    Promise.all(
      citiesToFetch.map((c) =>
        fetchForecast({
          latitude: c.latitude,
          longitude: c.longitude,
          unit,
          signal: ac.signal,
        })
          .then((raw) => ({ k: cityKey(c), d: normalizeForecast(raw) }))
          .catch(() => null)
      )
    ).then((results) => {
      if (ac.signal.aborted) return;
      setWeatherCache((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          if (r) next[r.k] = r.d;
        });
        return next;
      });
    });

    return () => ac.abort();
  }, [cities, unit]);

  /* ── Filter visible world cities by current zoom level ────── */
  const visibleCities = useMemo(() => {
    const worldList = getWorldCitiesForZoom(currentZoom);
    // Always include user tracked cities
    const trackedKeys = new Set(cities.map(cityKey));
    const merged = [...cities];

    worldList.forEach((wc) => {
      if (!trackedKeys.has(cityKey(wc))) {
        merged.push(wc);
      }
    });
    return merged;
  }, [currentZoom, cities]);

  /* ── Instant World City Search ────────────────────────────── */
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return;

    // Online Geocoding search for ANY city on Earth
    const ac = new AbortController();
    const timer = setTimeout(() => {
      setIsSearching(true);
      searchCities(q, ac.signal)
        .then((remote) => {
          if (ac.signal.aborted) return;
          const localMatches = searchPreloadedCities(q).slice(0, 6);
          // Merge local + remote unique cities
          const existing = new Set(localMatches.map(cityKey));
          const additions = remote.filter((c) => !existing.has(cityKey(c)));
          setSearchResults([...localMatches, ...additions].slice(0, 8));
        })
        .catch(() => {})
        .finally(() => {
          if (!ac.signal.aborted) setIsSearching(false);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [searchQuery]);

  /* ── Handle city selection ────────────────────────────────── */
  const handleSelectCity = useCallback(
    (city) => {
      setSelectedCity(city);
      setActiveCity(city);
      setClickedLocation(null);
      setClickedWeather(null);
      setFlyTarget({ lat: city.latitude, lng: city.longitude, zoom: 6 });
      setIsSearchOpen(false);
      setSearchQuery("");

      // If not cached, fetch immediately
      const k = cityKey(city);
      if (!weatherCache[k]) {
        fetchForecast({
          latitude: city.latitude,
          longitude: city.longitude,
          unit,
        })
          .then((raw) => {
            const norm = normalizeForecast(raw);
            setWeatherCache((prev) => ({ ...prev, [k]: norm }));
          })
          .catch(() => {});
      }
    },
    [setActiveCity, weatherCache, unit]
  );

  /* ── Handle Map Click anywhere on Earth ───────────────────── */
  const handleMapClick = useCallback(
    async (latlng) => {
      const lat = Number(latlng.lat.toFixed(4));
      const lng = Number(latlng.lng.toFixed(4));

      setClickedLocation({ lat, lng });
      setIsFetchingClicked(true);
      setClickedWeather(null);

      try {
        const raw = await fetchForecast({ latitude: lat, longitude: lng, unit });
        const norm = normalizeForecast(raw);
        setClickedWeather(norm);
        setSelectedCity({
          id: `coord-${lat}-${lng}`,
          name: `Coordinates (${lat}, ${lng})`,
          country: norm.timezone || "Global Location",
          latitude: lat,
          longitude: lng,
        });
      } catch {
        setClickedWeather({ error: "Failed to fetch weather for this location." });
      } finally {
        setIsFetchingClicked(false);
      }
    },
    [unit]
  );

  /* ── Add clicked coordinate to tracked cities ─────────────── */
  const handleAddClickedToCities = () => {
    if (!clickedLocation) return;
    const newCity = {
      id: `custom-${Date.now()}`,
      name: `Location (${clickedLocation.lat.toFixed(2)}, ${clickedLocation.lng.toFixed(2)})`,
      admin1: "",
      country: clickedWeather?.timezone || "Earth",
      latitude: clickedLocation.lat,
      longitude: clickedLocation.lng,
    };
    addCity(newCity);
    setSelectedCity(newCity);
    setClickedLocation(null);
  };

  /* ── Derive selected city weather ─────────────────────────── */
  const activeWeather =
    (clickedLocation && clickedWeather && !clickedWeather.error
      ? clickedWeather
      : weatherCache[cityKey(selectedCity)]) ?? forecast;

  const today = activeWeather?.daily?.[0];

  /* ── Radar time info ──────────────────────────────────────── */
  const radarTimeInfo = formatRadarTime(currentFrameObj?.time);

  /* ── Legend for Temperature ───────────────────────────────── */
  const tempLegend =
    unit === "fahrenheit"
      ? [
          { l: "< 32°F", c: "#818cf8" },
          { l: "32–54°F", c: "#60a5fa" },
          { l: "55–72°F", c: "#34d399" },
          { l: "73–89°F", c: "#fbbf24" },
          { l: "> 90°F", c: "#f87171" },
        ]
      : [
          { l: "< 0°C", c: "#818cf8" },
          { l: "0–12°C", c: "#60a5fa" },
          { l: "13–22°C", c: "#34d399" },
          { l: "23–32°C", c: "#fbbf24" },
          { l: "> 33°C", c: "#f87171" },
        ];

  const activeBaseMap = BASE_MAPS.find((b) => b.id === baseMapId) || BASE_MAPS[0];

  return (
    <div className="min-h-screen bg-slate-950 pb-16 font-sans text-slate-100">
      {/* Top Banner */}
      <div className="container mx-auto px-3 pt-3 sm:px-4 sm:pt-4 lg:px-16">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-blue-500" />
              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl md:text-3xl">
                Global Interactive Weather Map
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
              Explore live radar precipitation, wind flow particle streamlines, and real-time conditions worldwide.
            </p>
          </div>

          {/* World City Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-3 text-slate-400">
                🔍
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  const q = val.trim();
                  if (q.length < 2) {
                    setSearchResults([]);
                    setIsSearching(false);
                  } else {
                    setSearchResults(searchPreloadedCities(q).slice(0, 6));
                  }
                }}
                placeholder="Search any world city or capital..."
                className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/90 py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 backdrop-blur-md transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {isSearching && (
                <span className="absolute right-3 text-xs text-blue-400 animate-spin">
                  ⏳
                </span>
              )}
            </div>

            {/* Search Dropdown Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-[2000] mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl custom-scrollbar">
                <div className="mb-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  City Results ({searchResults.length})
                </div>
                {searchResults.map((city) => (
                  <button
                    key={`${city.latitude}-${city.longitude}-${city.name}`}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-blue-600/20"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">
                        {city.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-400">
                      Jump →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Control Bar: Weather Movement Modes & Map Styles ─ */}
        <div className="mb-4 flex flex-col gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 p-2 sm:p-2.5 backdrop-blur-lg sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {/* Weather Movement Layers */}
          <div className="flex w-full items-center gap-1 overflow-x-auto no-scrollbar touch-pan-x pb-1 sm:w-auto sm:gap-1.5 sm:overflow-visible sm:pb-0">
            <span className="mr-1 hidden text-xs font-bold text-slate-400 sm:inline-block">
              Motion Layer:
            </span>
            {WEATHER_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setWeatherMode(mode.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 ${
                  weatherMode === mode.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 hover:text-white"
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Base Map Selector & City Badges Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Map Styles Selector */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-800/60 p-1">
              <span className="px-1.5 text-[10px] font-bold text-slate-400 sm:px-2 sm:text-[11px]">
                Map:
              </span>
              {BASE_MAPS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBaseMapId(b.id)}
                  className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition sm:px-2.5 sm:text-[11px] ${
                    baseMapId === b.id
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {b.shortName}
                </button>
              ))}
            </div>

            {/* City Badges Toggle */}
            <button
              type="button"
              onClick={() => setShowCityPins(!showCityPins)}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                showCityPins
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white"
              }`}
            >
              <span>{showCityPins ? "✓" : "○"}</span>
              <span>City Badges</span>
            </button>
          </div>
        </div>

        {/* ── Main Grid: Map + Sidebar ──────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Interactive Map Viewport ─────────────────────── */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl sm:rounded-3xl lg:col-span-2">
            {/* Map Canvas */}
            <div className="h-[400px] w-full sm:h-[480px] lg:h-[600px]">
              <MapContainer
                center={[selectedCity.latitude, selectedCity.longitude]}
                zoom={currentZoom}
                minZoom={2}
                maxZoom={12}
                style={{ height: "100%", width: "100%", background: "#090d16" }}
                zoomControl={true}
                attributionControl={false}
              >
                {/* Base Map Tile Layer */}
                <TileLayer
                  key={activeBaseMap.id}
                  url={activeBaseMap.url}
                  attribution={activeBaseMap.attribution}
                  maxZoom={18}
                />
                {/* Satellite Labels overlay if satellite mode selected */}
                {activeBaseMap.labelsUrl && (
                  <TileLayer
                    key={`${activeBaseMap.id}-labels`}
                    url={activeBaseMap.labelsUrl}
                    zIndex={350}
                  />
                )}

                {/* Map event and fly-to controller */}
                <MapController
                  onZoomChange={setCurrentZoom}
                  onMapClick={handleMapClick}
                  targetCoords={flyTarget}
                />

                {/* Weather Movement Layer: RainViewer Radar Animation */}
                {weatherMode === "radar" && (
                  <RadarAnimationLayer
                    isPlaying={isRadarPlaying}
                    setIsPlaying={setIsRadarPlaying}
                    playbackSpeed={radarSpeed}
                    onFramesLoaded={(frames) => setRadarFrames(frames)}
                    onCurrentFrameChange={(idx, frame) => {
                      setCurrentRadarIdx(idx);
                      setCurrentFrameObj(frame);
                    }}
                  />
                )}

                {/* Weather Movement Layer: Dynamic Wind Particle Currents */}
                {weatherMode === "wind" && (
                  <WindCanvasLayer opacity={0.85} particleCount={1400} />
                )}

                {/* World Cities Pins & Badges */}
                {showCityPins &&
                  visibleCities.map((city) => {
                    const w = weatherCache[cityKey(city)];
                    const isSel = cityKey(city) === cityKey(selectedCity);
                    let displayVal = "";
                    let dotColor = "#60a5fa";

                    if (weatherMode === "temperature" && w?.current) {
                      displayVal = `${round(w.current.temperature)}°`;
                      dotColor = tempColor(w.current.temperature);
                    } else if (weatherMode === "wind" && w?.current) {
                      displayVal = `${round(w.current.windSpeed)}`;
                      dotColor = "#38bdf8";
                    } else if (weatherMode === "clouds" && w?.current) {
                      displayVal = w.current.icon || "☁️";
                      dotColor = "#94a3b8";
                    } else if (w?.current) {
                      displayVal = `${round(w.current.temperature)}°`;
                      dotColor = tempColor(w.current.temperature);
                    }

                    return (
                      <Marker
                        key={cityKey(city)}
                        position={[city.latitude, city.longitude]}
                        icon={createCityMarkerIcon(
                          city.name,
                          displayVal,
                          dotColor,
                          isSel
                        )}
                        eventHandlers={{
                          click: () => handleSelectCity(city),
                        }}
                      />
                    );
                  })}

                {/* User Click Marker (Click anywhere on Earth) */}
                {clickedLocation && (
                  <Marker position={[clickedLocation.lat, clickedLocation.lng]}>
                    <Popup autoPan={false}>
                      <div className="text-left font-sans text-xs">
                        <p className="font-bold text-blue-400">
                          📍 Pinpoint Location
                        </p>
                        <p className="text-[11px] text-slate-300">
                          {clickedLocation.lat}° N, {clickedLocation.lng}° E
                        </p>
                        {isFetchingClicked ? (
                          <p className="my-2 animate-pulse text-slate-400">
                            Fetching weather conditions...
                          </p>
                        ) : clickedWeather && !clickedWeather.error ? (
                          <div className="my-2 border-t border-slate-700/60 pt-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-2xl">
                                {clickedWeather.current.icon}
                              </span>
                              <span className="text-xl font-extrabold text-white">
                                {round(clickedWeather.current.temperature)}
                                {unitSymbol}
                              </span>
                            </div>
                            <p className="font-semibold text-blue-300">
                              {clickedWeather.current.condition}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Wind: {round(clickedWeather.current.windSpeed)} {speedUnit} · Humidity: {clickedWeather.current.humidity}%
                            </p>
                            <button
                              type="button"
                              onClick={handleAddClickedToCities}
                              className="mt-2 w-full rounded-lg bg-blue-600 px-2 py-1 text-[11px] font-bold text-white transition hover:bg-blue-500"
                            >
                              + Add to Tracked Cities
                            </button>
                          </div>
                        ) : (
                          <p className="my-2 text-rose-400">
                            Unable to load weather for this point
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            {/* ── Interactive Radar Playback Bar (When Radar mode is active) ─ */}
            {weatherMode === "radar" && radarFrames.length > 0 && (
              <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-900/90 p-2.5 shadow-2xl backdrop-blur-xl sm:rounded-2xl sm:p-3 md:flex-row md:items-center md:justify-between">
                {/* Playback controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRadarPlaying(!isRadarPlaying)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg transition hover:bg-blue-500 sm:h-9 sm:w-9"
                    title={isRadarPlaying ? "Pause radar motion" : "Play radar motion"}
                  >
                    {isRadarPlaying ? "⏸" : "▶"}
                  </button>

                  <div className="text-left">
                    <p className="text-xs font-bold text-white">
                      {radarTimeInfo.timeStr}
                    </p>
                    <p className="text-[10px] text-blue-300">
                      {radarTimeInfo.relativeStr}
                    </p>
                  </div>
                </div>

                {/* Timeline Scrubber */}
                <div className="flex flex-1 items-center gap-2 px-1 sm:gap-3 sm:px-2">
                  <span className="text-[10px] font-medium text-slate-400">
                    -2h
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={radarFrames.length - 1}
                    value={currentRadarIdx}
                    onChange={(e) => {
                      setIsRadarPlaying(false);
                      setCurrentRadarIdx(Number(e.target.value));
                    }}
                    className="weather-timeline w-full"
                  />
                  <span className="text-[10px] font-bold text-emerald-400">
                    Live
                  </span>
                </div>

                {/* Speed selector */}
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <span className="text-[10px] text-slate-400">Speed:</span>
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRadarSpeed(s)}
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition ${
                        radarSpeed === s
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Wind Flow Legend (When Wind mode is active) ─ */}
            {weatherMode === "wind" && (
              <div className="absolute bottom-3 left-3 z-[1000] flex max-w-[calc(100%-24px)] flex-wrap items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/90 p-2 text-[10px] backdrop-blur-md sm:gap-3 sm:px-3.5 sm:py-2 sm:text-[11px]">
                <span className="font-bold text-slate-300">Wind Velocity:</span>
                <span className="flex items-center gap-1 text-sky-300">
                  <span className="h-2 w-2 rounded-full bg-sky-400" /> Calm (&lt; 15 km/h)
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Moderate (15–35)
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Strong (35–60)
                </span>
                <span className="flex items-center gap-1 text-rose-300">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Gale (&gt; 60)
                </span>
              </div>
            )}

            {/* ── Temperature Legend (When Temperature mode is active) ─ */}
            {weatherMode === "temperature" && (
              <div className="absolute bottom-3 left-3 z-[1000] flex max-w-[calc(100%-24px)] flex-wrap items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/90 p-2 text-[10px] backdrop-blur-md sm:gap-3 sm:px-3.5 sm:py-2 sm:text-[11px]">
                <span className="font-bold text-slate-300">Temp Scale:</span>
                {tempLegend.map((r) => (
                  <span key={r.l} className="flex items-center gap-1 text-slate-300">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: r.c, boxShadow: `0 0 6px ${r.c}` }}
                    />
                    {r.l}
                  </span>
                ))}
              </div>
            )}

            {/* ── Map Mode Badge (Top Left) ─ */}
            <div className="absolute left-3 top-3 z-[1000] flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md sm:left-4 sm:top-4 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-md shadow-blue-500" />
              <span>{WEATHER_MODES.find((m) => m.id === weatherMode)?.label}</span>
              <span className="text-[10px] text-slate-400">
                · Zoom {currentZoom}x ({visibleCities.length} cities)
              </span>
            </div>
          </div>

          {/* ── Sidebar: Selected City Weather & Context ───────── */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Selected City Card */}
            <section className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 p-4 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-6">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Currently Selected
                </span>
                {activeWeather?.current && (
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
                    {activeWeather.current.isDay ? "DAY ☀️" : "NIGHT 🌙"}
                  </span>
                )}
              </div>

              {activeWeather?.current ? (
                <>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-black text-white">
                        {selectedCity.name}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {[selectedCity.admin1, selectedCity.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <span className="text-5xl leading-none drop-shadow-md">
                      {activeWeather.current.icon}
                    </span>
                  </div>

                  <div className="mb-4 flex items-baseline gap-4">
                    <span className="text-5xl font-black text-white">
                      {round(activeWeather.current.temperature)}°
                    </span>
                    <div>
                      <p className="text-sm font-bold text-blue-300">
                        {activeWeather.current.condition}
                      </p>
                      <p className="text-xs text-slate-400">
                        Feels like: {round(activeWeather.current.apparentTemperature)}{unitSymbol}
                      </p>
                    </div>
                  </div>

                  {today && (
                    <div className="mb-4 flex items-center gap-4 rounded-xl bg-slate-800/50 p-2.5 text-xs text-slate-300">
                      <span>High: <b className="text-amber-400">{round(today.high)}°</b></span>
                      <span>Low: <b className="text-blue-400">{round(today.low)}°</b></span>
                      <span>Precip: <b className="text-sky-300">{today.rain}%</b></span>
                    </div>
                  )}

                  {/* Weather Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 border-t border-slate-800 pt-4 text-xs">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-800/30 p-2.5">
                      <p className="text-[10px] text-slate-400">Wind Speed</p>
                      <p className="font-bold text-white">
                        {round(activeWeather.current.windSpeed)} {speedUnit}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800/80 bg-slate-800/30 p-2.5">
                      <p className="text-[10px] text-slate-400">Humidity</p>
                      <p className="font-bold text-white">
                        {activeWeather.current.humidity}%
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800/80 bg-slate-800/30 p-2.5">
                      <p className="text-[10px] text-slate-400">Pressure</p>
                      <p className="font-bold text-white">
                        {round(activeWeather.current.pressure)} hPa
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800/80 bg-slate-800/30 p-2.5">
                      <p className="text-[10px] text-slate-400">Data Status</p>
                      <p className="font-bold text-emerald-400">Real-time Live</p>
                    </div>
                  </div>

                  <Link
                    to="/"
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600/20 py-2.5 text-xs font-bold text-blue-300 transition hover:bg-blue-600 hover:text-white"
                  >
                    <span>View full 7-day forecast for {selectedCity.name}</span>
                    <span>→</span>
                  </Link>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                  Loading weather data for this location...
                </div>
              )}
            </section>

            {/* Quick World Cities / Tracked Cities Navigator */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tracked & Featured Cities
                </h3>
                <span className="text-[10px] text-slate-500">
                  Click to jump
                </span>
              </div>

              <div className="flex max-h-72 flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                {cities.map((city) => {
                  const w = weatherCache[cityKey(city)];
                  const isSel = cityKey(city) === cityKey(selectedCity);
                  return (
                    <button
                      key={cityKey(city)}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition-all ${
                        isSel
                          ? "border-blue-500/50 bg-blue-600/15"
                          : "border-slate-800/70 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">
                          {w?.current?.icon || "🌍"}
                        </span>
                        <div>
                          <p className={`text-xs font-bold ${isSel ? "text-blue-300" : "text-white"}`}>
                            {city.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {city.country}
                          </p>
                        </div>
                      </div>

                      {w?.current && (
                        <div className="text-right">
                          <span className={`text-sm font-black ${isSel ? "text-blue-300" : "text-white"}`}>
                            {round(w.current.temperature)}°
                          </span>
                          <span className="block text-[9px] text-slate-400">
                            {w.current.condition}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
