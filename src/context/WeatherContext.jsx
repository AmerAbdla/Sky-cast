import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cityKey, fetchForecast, normalizeForecast } from "../weather";

const WeatherContext = createContext(null);

const DEFAULT_CITIES = [
  { id: "khartoum", name: "Khartoum", admin1: "", country: "Sudan", latitude: 15.5007, longitude: 32.5599 },
  { id: "new-york", name: "New York", admin1: "New York", country: "United States", latitude: 40.7128, longitude: -74.006 },
  { id: "london", name: "London", admin1: "England", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278 },
  { id: "tokyo", name: "Tokyo", admin1: "", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { id: "sydney", name: "Sydney", admin1: "New South Wales", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
];

const STORAGE_KEY = "skycast:v1";

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.cities) || parsed.cities.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function WeatherProvider({ children }) {
  const [cities, setCities] = useState(() => readStored()?.cities ?? DEFAULT_CITIES);
  const [activeCity, setActiveCity] = useState(() => readStored()?.activeCity ?? DEFAULT_CITIES[0]);
  const [unit, setUnit] = useState(() => (readStored()?.unit === "fahrenheit" ? "fahrenheit" : "celsius"));

  const [forecast, setForecast] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cities, activeCity, unit }));
    } catch {
      // Storage access might be restricted (e.g. private browsing) — fail silently
    }
  }, [cities, activeCity, unit]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;
      setStatus("loading");
      setError(null);
    });

    fetchForecast({
      latitude: activeCity.latitude,
      longitude: activeCity.longitude,
      unit,
      signal: controller.signal,
    })
      .then((raw) => {
        if (cancelled) return;
        setForecast(normalizeForecast(raw));
        setLastUpdated(new Date());
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled || err.name === "AbortError") return;
        setError(err.message || "Could not reach the weather service.");
        setStatus("error");
      });

    // Abort signal prevents stale API responses from overwriting the actively selected city
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [activeCity, unit, reloadToken]);

  const addCity = useCallback((city) => {
    setCities((prev) => (prev.some((c) => cityKey(c) === cityKey(city)) ? prev : [...prev, city]));
    setActiveCity(city);
  }, []);

  const removeCity = useCallback((city) => {
    setCities((prev) => {
      const next = prev.filter((c) => cityKey(c) !== cityKey(city));
      return next.length > 0 ? next : prev;
    });
    setActiveCity((current) =>
      cityKey(current) === cityKey(city)
        ? cities.find((c) => cityKey(c) !== cityKey(city)) ?? current
        : current
    );
  }, [cities]);

  const value = useMemo(
    () => ({
      cities,
      activeCity,
      setActiveCity,
      addCity,
      removeCity,
      unit,
      unitSymbol: unit === "fahrenheit" ? "°F" : "°C",
      speedUnit: unit === "fahrenheit" ? "mph" : "km/h",
      toggleUnit: () => setUnit((u) => (u === "celsius" ? "fahrenheit" : "celsius")),
      forecast,
      status,
      error,
      lastUpdated,
      refresh: () => setReloadToken((n) => n + 1),
    }),
    [cities, activeCity, addCity, removeCity, unit, forecast, status, error, lastUpdated]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used inside <WeatherProvider>.");
  }
  return context;
}
