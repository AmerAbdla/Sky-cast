// Single source of truth for the application: Open-Meteo REST API.
// Requires no client-side API key, eliminating key leakage risks.

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Open-Meteo returns timestamps formatted as "2026-09-20T14:00" in the city's local time,
 * without a timezone offset suffix. Directly passing this string to `new Date()` makes
 * browsers interpret it in UTC or local device time, causing date shifting.
 * We manually construct the Date with the exact hours/days to preserve city local time.
 */
export function parseApiTime(value) {
  const [datePart, timePart = "00:00"] = String(value).split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour || 0, minute || 0);
}

export function describeWeather(code, isDay = true) {
  if (code === 0) return { condition: "Clear sky", icon: isDay ? "☀️" : "🌙" };
  if (code === 1) return { condition: "Mainly clear", icon: isDay ? "🌤️" : "🌙" };
  if (code === 2) return { condition: "Partly cloudy", icon: isDay ? "⛅" : "☁️" };
  if (code === 3) return { condition: "Overcast", icon: "☁️" };
  if ([45, 48].includes(code)) return { condition: "Fog", icon: "🌫️" };
  if ([51, 53, 55].includes(code)) return { condition: "Drizzle", icon: "🌦️" };
  if ([56, 57].includes(code)) return { condition: "Freezing drizzle", icon: "🌧️" };
  if ([61, 63, 65].includes(code)) return { condition: "Rain", icon: "🌧️" };
  if ([66, 67].includes(code)) return { condition: "Freezing rain", icon: "🌧️" };
  if ([71, 73, 75, 77].includes(code)) return { condition: "Snow", icon: "❄️" };
  if ([80, 81, 82].includes(code)) return { condition: "Rain showers", icon: "🌦️" };
  if ([85, 86].includes(code)) return { condition: "Snow showers", icon: "🌨️" };
  if (code === 95) return { condition: "Thunderstorm", icon: "⛈️" };
  if ([96, 99].includes(code)) return { condition: "Thunderstorm with hail", icon: "⛈️" };
  return { condition: "Unknown", icon: "❔" };
}

export function formatCityLabel(city) {
  if (!city) return "";
  const parts = [city.name, city.admin1, city.country].filter(Boolean);
  // Avoid duplicate labels (e.g. "Singapore, Singapore")
  return parts.filter((part, i) => parts.indexOf(part) === i).join(", ");
}

export function cityKey(city) {
  return `${city.latitude.toFixed(3)},${city.longitude.toFixed(3)}`;
}

async function getJson(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Weather service returned ${res.status}. Try again in a moment.`);
  }
  return res.json();
}

export async function fetchForecast({ latitude, longitude, unit = "celsius", signal }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,is_day",
    hourly:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation_probability,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
  });

  if (unit === "fahrenheit") {
    params.set("temperature_unit", "fahrenheit");
    params.set("wind_speed_unit", "mph");
  }

  return getJson(`${FORECAST_URL}?${params.toString()}`, signal);
}

export async function searchCities(query, signal) {
  const params = new URLSearchParams({
    name: query,
    count: "6",
    language: "en",
    format: "json",
  });
  const data = await getJson(`${GEOCODING_URL}?${params.toString()}`, signal);
  return (data.results ?? []).map((result) => ({
    id: String(result.id),
    name: result.name,
    admin1: result.admin1 ?? "",
    country: result.country ?? "",
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

/** Transforms raw Open-Meteo API response into a component-friendly data structure. */
export function normalizeForecast(raw) {
  if (!raw) return null;

  const current = {
    time: parseApiTime(raw.current.time),
    temperature: raw.current.temperature_2m,
    apparentTemperature: raw.current.apparent_temperature,
    humidity: raw.current.relative_humidity_2m,
    windSpeed: raw.current.wind_speed_10m,
    pressure: raw.current.surface_pressure,
    isDay: raw.current.is_day === 1,
    ...describeWeather(raw.current.weather_code, raw.current.is_day === 1),
  };

  const daily = raw.daily.time.map((dateStr, i) => {
    const date = parseApiTime(dateStr);
    return {
      key: dateStr,
      date,
      isToday: i === 0,
      high: raw.daily.temperature_2m_max[i],
      low: raw.daily.temperature_2m_min[i],
      rain: raw.daily.precipitation_probability_max[i] ?? 0,
      sunrise: parseApiTime(raw.daily.sunrise[i]),
      sunset: parseApiTime(raw.daily.sunset[i]),
      ...describeWeather(raw.daily.weather_code[i], true),
    };
  });

  // Start hourly projections from the current local hour, not from midnight
  const startIndex = Math.max(
    raw.hourly.time.findIndex((t) => t >= raw.current.time),
    0
  );

  const hourly = raw.hourly.time.slice(startIndex, startIndex + 12).map((timeStr, offset) => {
    const i = startIndex + offset;
    const isDay = raw.hourly.is_day[i] === 1;
    return {
      key: timeStr,
      date: parseApiTime(timeStr),
      isNow: offset === 0,
      temperature: raw.hourly.temperature_2m[i],
      apparentTemperature: raw.hourly.apparent_temperature[i],
      humidity: raw.hourly.relative_humidity_2m[i],
      rain: raw.hourly.precipitation_probability[i] ?? 0,
      ...describeWeather(raw.hourly.weather_code[i], isDay),
    };
  });

  return { current, daily, hourly, timezone: raw.timezone };
}

/**
 * Format timestamp nicely into local time and relative time in English
 */
export function formatRadarTime(timestampSec) {
  if (!timestampSec) return { timeStr: "–", relativeStr: "–" };
  const date = new Date(timestampSec * 1000);
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  let relativeStr = "Now (Live)";
  if (diffMinutes > 5) {
    relativeStr = `${diffMinutes} min ago`;
  } else if (diffMinutes < -5) {
    relativeStr = `Forecast in ${Math.abs(diffMinutes)} min`;
  }

  return { timeStr, relativeStr, date };
}

